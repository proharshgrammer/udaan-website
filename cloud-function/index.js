const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

admin.initializeApp();

// 1. Initialize Razorpay using environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwcrj6izIPIXU7iyTEVfv3KICUE9GBw_ezsuY777Bepex6KGLpBKtBZAtiQGpIjmI0bRQ/exec';

// --- CREATE ORDER FUNCTION (Untouched) ---
exports.createOrder = onCall({
    cors: true,
    maxInstances: 10,
    region: 'us-central1'
}, async (request) => {

    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login required.');
    }

    const { courseId, promoCode } = request.data;
    const uid = request.auth.uid;

    if (!courseId) {
        throw new HttpsError('invalid-argument', 'Course ID is required.');
    }

    try {
        const courseDoc = await admin.firestore().collection('courses').doc(courseId).get();

        if (!courseDoc.exists) {
            throw new HttpsError('not-found', 'Course not found in database.');
        }

        const courseData = courseDoc.data();

        // 👇 FIX 1: Force numeric type for safety
        let finalPrice = Number(courseData.discountedPrice || courseData.price || 0);

        if (finalPrice <= 0) {
            throw new HttpsError('out-of-range', 'Course price is invalid (0 or null).');
        }

        // Promo Code Logic
        if (promoCode && courseData.discountCodes) {
            const now = new Date();
            const validCode = courseData.discountCodes.find(c => {
                const isMatch = c.code.toUpperCase() === promoCode.toUpperCase();
                // 👇 FIX 2: Handle Firestore Timestamp conversion properly
                const expiry = c.expiryDate.toDate ? c.expiryDate.toDate() : new Date(c.expiryDate);
                return isMatch && expiry > now;
            });

            if (validCode) {
                const discountAmount = (finalPrice * Number(validCode.discountPercentage)) / 100;
                finalPrice = finalPrice - discountAmount;
            } else {
                throw new HttpsError('invalid-argument', 'Invalid or expired promo code.');
            }
        }

        // 👇 FIX 3: Math.floor to ensure an Integer (Razorpay fails on decimals)
        const amountInPaise = Math.floor(finalPrice * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `rcpt_${uid.substring(0, 5)}_${Date.now()}`,
            notes: {
                uid: uid,
                courseId: courseId,
                finalPrice: finalPrice.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        return {
            orderId: order.id,
            amount: order.amount,
        };

    } catch (error) {
        // 🚨 CRITICAL: Check Firebase Logs for this specific tag
        console.error("RAZORPAY_FAILURE_DETAIL:", error);

        if (error instanceof HttpsError) throw error;

        // Send the actual error message back to Flutter to debug
        throw new HttpsError('internal', error.message || 'Payment system error');
    }
});

// --- WEBHOOK FUNCTION (Updated) ---
exports.razorpayWebhookSite = onRequest({
    cors: true,
    region: 'us-central1'
}, async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(req.rawBody)
        .digest('hex');

    if (expectedSignature !== signature) {
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;

    if (event === 'order.paid') {
        const orderEntity = req.body.payload.order.entity;
        const paymentEntity = req.body.payload.payment.entity;
        const notes = orderEntity.notes;

        if (!notes || !notes.uid) return res.status(200).send('No notes');

        try {
            const batch = admin.firestore().batch();
            const { uid, courseId, finalPrice } = notes;

            // 1. Record the purchase in user's purchases subcollection
            const purchaseRef = admin.firestore()
                .collection('purchases')
                .doc(uid)
                .collection('user_purchases')
                .doc(orderEntity.id);

            // --- IDEMPOTENCY CHECK ---
            // If Razorpay retries the webhook, we don't want to add duplicate rows to Google Sheets
            const existingPurchase = await purchaseRef.get();
            if (existingPurchase.exists) {
                console.log(`⏭️ Order ${orderEntity.id} already processed. Skipping to avoid duplicates.`);
                return res.status(200).send('OK');
            }

            batch.set(purchaseRef, {
                courseId: courseId,
                pricePaid: Number(finalPrice),
                purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                paymentId: paymentEntity.id,
                method: paymentEntity.method
            });

            // 2. Fetch User & Course Profile for Sheets Sync
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            
            const courseDoc = await admin.firestore().collection('courses').doc(courseId).get();
            const courseName = courseDoc.exists ? courseDoc.data().name : courseId;

            // 3. Record student in course's students subcollection
            const enrollmentRef = admin.firestore()
                .collection('courses')
                .doc(courseId)
                .collection('students')
                .doc(uid);

            // Use merge: true so we don't overwrite any extra fields the Web app might have written
            batch.set(enrollmentRef, {
                studentId: uid,
                studentName: userData.name || 'Student',
                enrolledDate: admin.firestore.FieldValue.serverTimestamp(), // App requires enrolledDate
            }, { merge: true });

            await batch.commit();
            console.log(`✅ User ${uid} enrolled in Firestore!`);

            // 4. Send to Google Sheets (Non-blocking backup)
            try {
                const sheetPayload = {
                    courseName: courseName,
                    name: userData.name || "",
                    email: userData.email || "",
                    phoneNumber: userData.phoneNumber || "",
                    state: userData.state || "",
                    field: userData.field || "",
                    rank: userData.rank || "",
                    homeStateRank: userData.homeStateRank || "",
                    categoryRank: userData.categoryRank || "",
                    pricePaid: Number(finalPrice),
                    paymentId: paymentEntity.id,
                    orderId: orderEntity.id,
                };

                await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify(sheetPayload),
                });
                console.log(`✅ Synced ${uid} to Google Sheets!`);
            } catch (sheetErr) {
                console.error('⚠️ Google Sheets Sync Failed:', sheetErr);
                // We don't throw here; we still want to return 200 to Razorpay
            }

        } catch (err) {
            console.error('Webhook DB Error:', err);
            return res.status(500).send('DB Error');
        }
    }
    
    res.status(200).send('OK');
});
