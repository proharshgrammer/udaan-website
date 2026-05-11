/**
 * migrate-student.js
 * 
 * Migrates a student's enrollment from one UID (old/typo account) to another
 * UID (correct account). Copies enrollment docs across all courses and
 * optionally copies purchase records.
 *
 * Usage:
 *   node migrate-student.js <OLD_UID> <NEW_UID>
 *
 * Example:
 *   node migrate-student.js PsyvKbui9FdiLO6aVz7TweOLUto2 <correct_uid_here>
 *
 * Requires: service-account.json in the same folder.
 */

const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrate(oldUid, newUid) {
    console.log(`\n🔄 Migrating enrollments from ${oldUid} → ${newUid}\n`);

    // 1. Find all course enrollments for the old UID
    const coursesSnap = await db.collection('courses').get();
    let migratedCount = 0;

    for (const courseDoc of coursesSnap.docs) {
        const courseId = courseDoc.id;
        const courseName = courseDoc.data().name || courseId;

        const oldEnrollmentRef = db.collection('courses').doc(courseId).collection('students').doc(oldUid);
        const oldEnrollmentSnap = await oldEnrollmentRef.get();

        if (!oldEnrollmentSnap.exists) continue;

        const enrollmentData = oldEnrollmentSnap.data();
        console.log(`📚 Found enrollment in "${courseName}" (${courseId})`);
        console.log(`   Old doc data:`, JSON.stringify(enrollmentData, null, 2));

        // 2. Write enrollment under the new UID
        const newEnrollmentRef = db.collection('courses').doc(courseId).collection('students').doc(newUid);
        
        // Check if new UID already has an enrollment in this course
        const existingSnap = await newEnrollmentRef.get();
        if (existingSnap.exists) {
            console.log(`   ⚠️  New UID already enrolled in "${courseName}" — merging data...`);
        }

        await newEnrollmentRef.set({
            ...enrollmentData,
            studentId: newUid,  // Update studentId to match new UID
            _migratedFrom: oldUid,  // Audit trail
            _migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        console.log(`   ✅ Copied enrollment to new UID`);

        // 3. Delete the old enrollment doc
        await oldEnrollmentRef.delete();
        console.log(`   🗑️  Deleted old enrollment doc`);

        migratedCount++;
    }

    // 4. Migrate purchase records (if any)
    const oldPurchasesSnap = await db.collection('purchases').doc(oldUid)
        .collection('user_purchases').get();

    if (!oldPurchasesSnap.empty) {
        console.log(`\n💳 Found ${oldPurchasesSnap.size} purchase record(s) — migrating...`);

        // Ensure root purchases doc exists for new UID
        const newPurchasesRoot = db.collection('purchases').doc(newUid);
        if (!(await newPurchasesRoot.get()).exists) {
            await newPurchasesRoot.set({ uid: newUid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
        }

        for (const purchaseDoc of oldPurchasesSnap.docs) {
            const purchaseData = purchaseDoc.data();
            const purchaseId = purchaseDoc.id;

            await db.collection('purchases').doc(newUid)
                .collection('user_purchases').doc(purchaseId)
                .set({
                    ...purchaseData,
                    _migratedFrom: oldUid,
                    _migratedAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });

            // Delete old purchase doc
            await purchaseDoc.ref.delete();
            console.log(`   ✅ Migrated purchase ${purchaseId}`);
        }

        // Clean up old root doc
        await db.collection('purchases').doc(oldUid).delete();
        console.log(`   🗑️  Cleaned up old purchases root doc`);
    } else {
        console.log(`\n💳 No purchase records found for old UID (app-only enrollment)`);
    }

    console.log(`\n✅ Done! Migrated ${migratedCount} course enrollment(s) from ${oldUid} → ${newUid}`);
    console.log(`\n⚠️  Reminder: You may want to delete the old Auth account (${oldUid}) from Firebase Console → Authentication.`);
}

// --- CLI ---
const [oldUid, newUid] = process.argv.slice(2);

if (!oldUid || !newUid) {
    console.error('Usage: node migrate-student.js <OLD_UID> <NEW_UID>');
    console.error('Example: node migrate-student.js PsyvKbui9FdiLO6aVz7TweOLUto2 abc123newuid');
    process.exit(1);
}

if (oldUid === newUid) {
    console.error('❌ Old and new UIDs are the same. Nothing to do.');
    process.exit(1);
}

migrate(oldUid, newUid)
    .then(() => process.exit(0))
    .catch(err => {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    });
