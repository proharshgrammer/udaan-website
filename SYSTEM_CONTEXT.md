# Udaan Vidyapeeth — System Context

> **Purpose:** Persistent context document. Read this before making any changes to the backend, Cloud Functions, or data pipeline. Update this file whenever architecture changes.

---

## 1. Firebase Projects — TWO SEPARATE PROJECTS

| Project | Firebase ID | Purpose |
|---|---|---|
| **Main Backend** | `udaan-vp` | App + Web shared backend. Firestore, Auth, Cloud Functions, Storage. This is the real database. |
| **Website-only** | `udaan-website` | Only for Leads (CTA form) and Blog management. Has its own Firestore. DO NOT mix with `udaan-vp`. |

> ⚠️ **Do NOT deploy Cloud Functions or backend logic to `udaan-website`.** It is purely a content/CMS project.

The `cloud-function/` folder in this repo is deployed to **`udaan-vp`**.

---

## 2. Repository Structure

```
udaan-website/             ← Git repo root
├── cloud-function/        ← Firebase Functions (deploys to udaan-vp)
│   ├── index.js           ← 3 Cloud Functions (see Section 4)
│   ├── .env               ← Razorpay keys + webhook secret (DO NOT COMMIT)
│   ├── replay.js          ← Manual single-payment Sheets replay script
│   ├── replay-batch.js    ← Batch Sheets replay (by Razorpay payment ID)
│   ├── backfill-all.js    ← Full historical backfill from Firestore
│   └── service-account.json ← Firebase Admin SDK key for udaan-vp (DO NOT COMMIT)
├── udaan-client/          ← React web app (student-facing)
├── udaan-admin/           ← React admin panel (leads + blog only)
├── data_models_for_developer.md ← Firestore schema reference for app devs
└── SYSTEM_CONTEXT.md      ← THIS FILE
```

---

## 3. Firestore Collections (in `udaan-vp`)

### `users/{uid}`
Student profile. Document ID = Firebase Auth UID.
```
name, email, phoneNumber, state, field, rank,
exam, dob, interest, profileImageUrl,
homeStateRank (optional), categoryRank (optional)
```

### `courses/{courseId}`
Course/program data. Managed via the app's admin panel.
```
isEnabled (boolean, default true — set false to hide from web),
name, thumbnailUrl, price, discountedPrice,
about, mentorId, mentorName, discountCodes[]
```

### `courses/{courseId}/students/{uid}` ← ENROLLMENT SOURCE OF TRUTH
Who is enrolled in each course. Written by BOTH app and web webhooks.
```
studentId, enrolledDate   ← App reads only these two
name, email, phoneNumber, paymentId, orderId, pricePaid, couponApplied  ← Web extras
```

### `purchases/{uid}/user_purchases/{orderId}` ← PAYMENT RECORD (web only)
Written only by the `razorpayWebhookSite` Cloud Function (web flow).
```
courseId, pricePaid, purchaseDate, paymentId, method
```
> ⚠️ App-only enrollments may NOT have a `purchases` record.
> Always use `courses/{courseId}/students` as the ground truth for enrollment.

---

## 4. Cloud Functions (deployed to `udaan-vp`)

All functions live in `cloud-function/index.js`.

### `createOrder` (onCall)
- Used by: Web (Checkout.jsx) AND Mobile App
- Creates a Razorpay order with `notes: { uid, courseId, finalPrice }`
- The `notes` fields are how the webhook identifies which user/course to enroll

### `razorpayWebhookSite` (onRequest)
- Triggered by Razorpay on `order.paid` event
- Validates HMAC signature → idempotency check → writes to Firestore
- Does NOT sync to Sheets directly (handled by `onStudentEnrolled` trigger)
- Registered in Razorpay Dashboard for `order.paid`

### `onStudentEnrolled` (onDocumentCreated) ← NEW
- **Firestore trigger** on `courses/{courseId}/students/{uid}`
- Fires whenever a student doc is created — catches BOTH app and web enrollments
- Fetches user profile (with Auth fallback), course name, payment details → syncs to Google Sheets
- Single point of Sheets sync — prevents duplicates

### `replayToSheets` (onCall)
- Admin-triggered manual re-sync
- Call with: `{ uid: "...", orderId: "order_XXXX" }`

> The app has a SEPARATE purchase confirmation function (not in this repo/project).
> App payments write to `courses/{courseId}/students/{uid}` but NOT to `purchases/`.

---

## 5. Payment Flow

```
Student pays → Razorpay fires webhook → razorpayWebhookSite
  → Writes to purchases/{uid}/user_purchases/{orderId}
  → Writes to courses/{courseId}/students/{uid}
       ↓
  onStudentEnrolled trigger fires → syncs row to Google Sheet

Client-side (Checkout.jsx) also writes to courses/{courseId}/students/{uid}
as an immediate fallback. onDocumentCreated only fires on the FIRST write
(create), so whichever writes first triggers the Sheet sync — no duplicates.

App enrollments also write to courses/{courseId}/students/{uid}
→ same trigger fires → same Sheet sync. No code changes needed in app.
```

---

## 6. Google Sheets Enrollment Tracker

- **Sheet:** https://docs.google.com/spreadsheets/d/1aivPJcwuk5oQ_pVsLscK1-vEDcwPvtcA2kBjswz2Hn0
- **Apps Script Webhook:** `https://script.google.com/macros/s/AKfycbynf_ek_pgz0330MmuTtHyFtvcDjcoPYm0O1tfckY_NNKf7LnYj0qenKk4ankfC96q6XA/exec`

**Column order (A→N):**
`Date | Student Name | Email | Phone (WhatsApp) | Home State | Category | CRL Rank | Home State Rank | Category Rank | Course Price | Payment ID | Order ID | Mentor | First Call`

**Sheet tabs** (one per course, tab name MUST exactly match `courses/{id}.name` in Firestore):
- Combo Program (15 % OFF )
- JoSAA and CSAB Counselling Program
- Separate Counselling Program
- JoSAA, CSAB (with one Homestate) Counselling Program
- Jac Delhi + GGSIPU Counselling Program
- All UP Counselling Program
- Udaan Maha Webinar (hidden tab)

> ⚠️ Tab name mismatch → Apps Script silently creates a new tab instead of writing to the right one.
> Apps Script always returns HTTP 200 — check `{"status":"success/error"}` in body, not HTTP code.

---

## 7. Razorpay Configuration

```
Key ID:         rzp_live_SZ8CTSOCfd0mZJ   (cloud-function/.env)
Key Secret:     ZXxolQGCYCf5dwmQpTvIqZdA  (cloud-function/.env)
Webhook Secret: UdaanSecureWebhook123!    (cloud-function/.env)
```

> 2 payments from Apr 28 (pay_SisxlI3bM3G4KZ, pay_Sim2NruvzaO0Y4) don't exist
> under these Razorpay keys — likely processed via the app's payment flow/account.

---

## 8. Local Admin Scripts (run from cloud-function/ folder)

```bash
# Single payment replay (needs uid + orderId from Firestore)
node replay.js <uid> <orderId>

# Batch replay by Razorpay payment ID (edit PAYMENT_IDS array first)
node replay-batch.js

# Full historical backfill — ALL courses, ALL students (app + web)
node backfill-all.js
```

All scripts require `service-account.json` (Firebase Admin key for `udaan-vp`).
Download from: Firebase Console → udaan-vp → Project Settings → Service Accounts.

---

## 9. Known Bugs & Fixes Applied

| Date | Bug | Fix Applied |
|---|---|---|
| Apr 27+ | Students in Firebase Auth but not Firestore | Webhook now auto-creates `users` doc from Auth record if missing |
| Apr 28 | Sheets call returned 200 but no row written | Apps Script silently fails — check body `status` field |
| Apr 28 | Old `razorpayWebhook` function blocked deploy | Deleted from GCP |
| Apr 28 | Razorpay init at module level crashed Firebase CLI | Moved to lazy `getRazorpay()` |
| May 1 | 7/9 backlog payments replayed; 2 failed (wrong Razorpay account) | Added manually to sheet |
