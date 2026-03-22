# Tech Stack & Architecture

## Overview
Two separate React apps. One Firebase project. Zero monthly cost.

```
udaanvidyapeeth.com          →  Vercel deploy #1  (main website)
admin.udaanvidyapeeth.com    →  Vercel deploy #2  (admin panel)
                                      ↕
                             Firebase (shared)
                             ├── Firestore DB
                             ├── Firebase Storage
                             └── Firebase Auth
```

## Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + Vite | Fast dev, small bundle |
| Styling | Tailwind CSS v3 | Utility-first, mobile-first |
| Routing | React Router v6 | Standard SPA routing |
| Database | Firebase Firestore | Real-time, no server, free tier |
| File storage | Firebase Storage | Images + PDFs, 5GB free |
| Auth | Firebase Auth | Email/password, admin only |
| Rich text | Quill.js + react-quill | Blog/notice editor in admin |
| SEO | react-helmet-async | Per-page meta tags |
| Notifications | react-hot-toast | Admin panel feedback |
| Dates | date-fns | Notice/blog date formatting |
| Hosting | Vercel | Free, CI/CD via GitHub |

## Project structure

### Main website — `udaan-website/`
```
udaan-website/
├── public/
│   ├── logo-dark.png          # Use on dark backgrounds (Udaan-light.png)
│   ├── logo-light.png         # Use on light backgrounds (Final_Logo_White_Lines.png)
│   ├── favicon.ico
│   └── og-image.png           # 1200x630px social share preview
├── src/
│   ├── assets/                # Static icons, exam logos
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CourseCard.jsx     # Course listing card with deep link logic
│   │   ├── ExamBadge.jsx      # Pill badge: JEE / NEET / CUET etc.
│   │   ├── MentorCard.jsx     # Concept B editorial horizontal card
│   │   ├── MentorTeaser.jsx   # Compact homepage strip (2-col)
│   │   ├── LeadForm.jsx       # Reusable lead capture form
│   │   ├── LeadPopup.jsx      # Scroll-triggered modal
│   │   ├── StickyBar.jsx      # Bottom sticky lead bar
│   │   └── WhatsAppFAB.jsx    # Floating action button
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Courses.jsx
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── News.jsx
│   │   └── Contact.jsx
│   ├── hooks/
│   │   ├── useFirestore.js    # Generic Firestore read hook
│   │   └── useLeadCapture.js  # sessionStorage dismiss logic
│   ├── utils/
│   │   ├── deepLink.js        # App deep link + store redirect logic
│   │   └── whatsapp.js        # wa.me URL builder
│   ├── firebase.js            # Firebase init (reads from .env)
│   ├── styles/
│   │   └── globals.css        # Tailwind base + custom CSS vars
│   ├── App.jsx
│   └── main.jsx
├── .env                       # See ENV VARIABLES section
├── vite.config.js
└── vercel.json
```

### Admin panel — `udaan-admin/`
```
udaan-admin/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── RichEditor.jsx     # Quill.js wrapper
│   │   ├── MediaUploader.jsx  # Firebase Storage upload
│   │   └── ProtectedRoute.jsx # Auth guard
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx      # Stats: lead count, notice count, blog count
│   │   ├── Notices.jsx        # CRUD notices
│   │   ├── Blog.jsx           # CRUD blog posts with Quill editor
│   │   ├── Courses.jsx        # CRUD course listings
│   │   ├── Team.jsx           # CRUD mentor/team profiles
│   │   ├── Leads.jsx          # Read-only leads inbox
│   │   └── Media.jsx          # Upload images + PDFs
│   ├── firebase.js            # Same config as website
│   ├── App.jsx                # Protected routes
│   └── main.jsx
├── .env
└── vercel.json
```

## Firebase Firestore collections

### `/leads`
```js
{
  name: string,           // required
  phone: string,          // required
  city: string,           // required
  exam: string,           // required — "JEE" | "NEET" | "CUET" | "AKTU" | "MHT-CET" | "IPU" | "Other"
  rank: string,           // required
  email: string,          // optional
  createdAt: Timestamp,
  read: boolean           // default false, admin marks as read
}
```

### `/notices`
```js
{
  title: string,
  body: string,
  exams: string[],        // ["JEE", "NEET"] etc.
  date: Timestamp,
  pinned: boolean,
  sourceUrl: string,      // optional external link
  createdAt: Timestamp
}
```

### `/blogs`
```js
{
  title: string,
  content: string,        // HTML from Quill editor
  exams: string[],
  thumbnail: string,      // Firebase Storage URL
  date: Timestamp,
  readTime: number,       // minutes
  published: boolean,
  createdAt: Timestamp
}
```

### `/courses`
```js
{
  name: string,
  exam: string,
  description: string,
  price: number,
  features: string[],     // bullet points of what's included
  appDeepLink: string,    // udaanvidyapeeth://course/{id}
  playStoreUrl: string,
  appStoreUrl: string,
  active: boolean,
  order: number           // display order
}
```

### `/team`
```js
{
  name: string,
  role: string,
  bio: string,
  photo: string,          // Firebase Storage URL (empty = show initials)
  initials: string,       // "RM" | "AM"
  avatarColor: string,    // hex — "#4A72A8" | "#1A3A6B"
  examsExpertise: string[],
  coFounder: boolean,
  studentsGuided: number,
  yearsExp: number,
  order: number
}
```

## Firebase Security Rules
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leads: anyone can create, only authenticated admin can read/update/delete
    match /leads/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    // Everything else: public read, authenticated write
    match /{collection}/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Firebase Storage Rules
```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Environment variables

### Both apps share the same Firebase config:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Website only:
```env
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX     # Admin WhatsApp number (with country code, no +)
VITE_PLAY_STORE_URL=                  # Google Play Store listing URL
VITE_APP_STORE_URL=                   # Apple App Store listing URL
VITE_APP_DEEP_LINK_SCHEME=udaanvidyapeeth
```

## Deep link logic (`utils/deepLink.js`)
```js
export function getCourseLink(course) {
  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const deepLink = `${import.meta.env.VITE_APP_DEEP_LINK_SCHEME}://course/${course.id}`;

  if (isAndroid) {
    // Try deep link, fall back to Play Store after 2s
    window.location.href = deepLink;
    setTimeout(() => { window.location.href = course.playStoreUrl; }, 2000);
  } else if (isIOS) {
    window.location.href = deepLink;
    setTimeout(() => { window.location.href = course.appStoreUrl; }, 2000);
  } else {
    window.open(course.playStoreUrl, '_blank');
  }
}
```

## Lead capture sessionStorage logic
```js
// useLeadCapture.js
const KEY = 'udaan_lead_dismissed';
export function usLeadCapture() {
  const isDismissed = () => sessionStorage.getItem(KEY) === 'true';
  const dismiss = () => sessionStorage.setItem(KEY, 'true');
  return { isDismissed, dismiss };
}
// Pop-up: show after 50% scroll IF !isDismissed()
// On dismiss: call dismiss() — pop-up stays gone for session
// On submit: call dismiss() — no need to show again
```

## vercel.json (both apps)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
