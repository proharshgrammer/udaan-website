# Build Order

Follow this exact sequence. Each phase builds on the previous one.

## Phase 1 — Project scaffold (do this first, always)

### Website (`udaan-website`)
```bash
npm create vite@latest udaan-website -- --template react
cd udaan-website
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom firebase react-helmet-async date-fns
```

Setup checklist:
- [ ] `tailwind.config.js` — add fontFamily, colors (see DESIGN_SYSTEM.md)
- [ ] `src/styles/globals.css` — Tailwind directives + Google Fonts import
- [ ] `src/firebase.js` — init with env vars
- [ ] `src/App.jsx` — React Router with all 6 routes + lazy loading
- [ ] `public/` — add both logo files + favicon
- [ ] `.env` — all VITE_ variables (see TECH_STACK.md)
- [ ] `vercel.json` — SPA rewrite rule

### Admin (`udaan-admin`)
```bash
npm create vite@latest udaan-admin -- --template react
cd udaan-admin
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom firebase react-helmet-async react-hot-toast date-fns react-quill
```

Setup checklist:
- [ ] Same Tailwind + Firebase setup as website
- [ ] `src/App.jsx` — protected routes with auth guard

---

## Phase 2 — Shared components (website)

Build in this order (each is used by multiple pages):

1. `ExamBadge.jsx` — pill badge, accepts `exam` prop
2. `Navbar.jsx` — sticky, responsive, hamburger on mobile
3. `Footer.jsx` — dark bg, all links, social icons, app badges
4. `WhatsAppFAB.jsx` — floating button, always visible
5. `LeadForm.jsx` — reusable form, accepts `onSuccess` callback
6. `LeadPopup.jsx` — uses LeadForm, scroll trigger + sessionStorage
7. `StickyBar.jsx` — bottom bar, uses sessionStorage dismiss
8. `MentorCard.jsx` — Concept B editorial card (see DESIGN_SYSTEM.md)
9. `MentorTeaser.jsx` — compact 2-col homepage strip
10. `CourseCard.jsx` — course listing card with deep link button

---

## Phase 3 — Homepage (highest priority page)

Sections in order (top to bottom):
1. Hero — dark bg, heading, exam pills, two CTAs
2. Stats strip — 4 numbers, brand-blue bg
3. Mentor teaser — `<MentorTeaser />` (loads from Firestore `/team`)
4. Course preview — 3 featured `<CourseCard />`s (loads from Firestore `/courses`)
5. Lead capture section — `<LeadForm />` in brand-blue bg section
6. Testimonials — hardcoded placeholder cards (see CONTENT.md)
7. App download strip — Google Play + App Store badges

Also wire up on homepage:
- `<LeadPopup />` (scroll trigger)
- `<StickyBar />` (always visible until dismissed)

---

## Phase 4 — Remaining website pages

### Courses page
- Filter bar (JEE / NEET / CUET / State / All)
- Grid of `<CourseCard />`s filtered by exam
- Freemium WhatsApp CTA section at bottom

### About Us page
- Brand story section
- Mentor section heading + 2× `<MentorCard />`s (from Firestore `/team`)
- Trust signals strip
- Social links

### Blog page
- Article listing grid (from Firestore `/blogs` where published === true)
- Exam filter tabs
- YouTube embed section
- PDF downloads list (from Firebase Storage)

### News page
- Pinned notice (where pinned === true) at top
- All notices list (from Firestore `/notices`)
- Each notice: title, body, exam tags, date, source link

### Contact page
- WhatsApp CTA (large, prominent)
- Booking form (saves to Firestore `/leads` same as LeadForm)
- Social links
- App download badges

---

## Phase 5 — Admin panel

Build in this order:

1. `Login.jsx` — Firebase Auth sign-in form
2. `ProtectedRoute.jsx` — auth guard component
3. `Sidebar.jsx` — navigation with all links
4. `Dashboard.jsx` — stats cards + recent leads
5. `Leads.jsx` — read-only table, mark as read, export CSV
6. `Notices.jsx` — CRUD with form modal
7. `RichEditor.jsx` — Quill.js wrapper with Firebase Storage image handler
8. `Blog.jsx` — CRUD with full-page Quill editor
9. `Courses.jsx` — CRUD with dynamic features list
10. `Team.jsx` — CRUD with avatar preview + photo upload
11. `MediaUploader.jsx` — drag & drop upload to Firebase Storage
12. `Media.jsx` — media library with copy URL + delete

---

## Phase 6 — Firebase setup

1. Create Firebase project
2. Enable Firestore — start in test mode, then apply rules from TECH_STACK.md
3. Enable Firebase Storage — apply rules from TECH_STACK.md
4. Enable Firebase Auth — Email/Password provider only
5. Create admin user in Firebase Console (Authentication tab)
6. Seed initial data:
   - `/team` — both mentors (see CONTENT.md seed data)
   - `/courses` — placeholder courses (see CONTENT.md)
   - `/notices` — 1 placeholder pinned notice

---

## Phase 7 — Deploy

### Website
```bash
# Push to GitHub repo: udaan-website
# Connect to Vercel
# Set all VITE_* env vars in Vercel dashboard
# Set custom domain: udaanvidyapeeth.com
```

### Admin panel
```bash
# Push to GitHub repo: udaan-admin
# Connect to Vercel (separate project)
# Set same VITE_FIREBASE_* env vars in Vercel dashboard
# Set custom domain: admin.udaanvidyapeeth.com
```

---

## QA checklist before handoff

### Website
- [ ] Lead popup appears after 50% scroll on homepage
- [ ] Lead popup does NOT appear again after dismissal (same session)
- [ ] Sticky bar visible on all pages, dismissible
- [ ] Lead form submits to Firestore AND opens WhatsApp notification
- [ ] Email field is NOT required
- [ ] Buy Now button redirects to correct store per device
- [ ] WhatsApp FAB opens with pre-filled message
- [ ] MentorCard loads from Firestore correctly
- [ ] Blog and notices load from Firestore in real-time
- [ ] All 6 pages render correctly on mobile (375px) and desktop (1280px)
- [ ] All pages have correct SEO meta tags
- [ ] Both logo variants (dark/light bg) used correctly

### Admin panel
- [ ] `/dashboard` redirects to `/login` when logged out
- [ ] Client can log in with email + password
- [ ] Client can create, edit, delete a notice
- [ ] Client can write and publish a blog post with rich text
- [ ] Client can upload an image and use it in a blog post
- [ ] Client can update a course name and price
- [ ] Client can update mentor bios
- [ ] Client can view all leads and mark as read
- [ ] Changes in admin appear on website within 5 seconds (Firestore real-time)
