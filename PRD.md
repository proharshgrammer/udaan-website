# Udaan Vidyapeeth — Product Requirements Document

## What we're building
A React.js marketing + lead-capture website (`udaanvidyapeeth.com`) and a separate admin panel (`admin.udaanvidyapeeth.com`) for an Indian EdTech counselling brand. The website helps students find the right college after their entrance exam. The admin panel lets the non-technical client manage all content independently.

## The problem
After getting their JEE / NEET / CUET / state exam rank, Indian students (17–22 yrs) have extreme anxiety about college selection. They need expert guidance. Udaan Vidyapeeth provides that — but has no web presence yet.

## What the website does NOT do
- No payments — purchases happen in the existing mobile app
- No student login / accounts
- No backend server — Firebase only

## Core user flows

### Student visits site
1. Lands on homepage → sees bold hero with exam tags + mentor faces teaser
2. Scrolls → lead capture form appears (pop-up after 50% scroll OR sticky bar OR mid-page section)
3. Fills form → data saved to Firebase + WhatsApp notification to admin
4. Browses courses → clicks "Buy Now" → redirected to Play Store / App Store
5. If app installed → deep link opens specific course directly in app

### Admin manages content
1. Logs in at `admin.udaanvidyapeeth.com` with email + password (Firebase Auth)
2. Posts notices, writes blog articles (rich text), updates courses, manages team profiles
3. Views student lead submissions in leads inbox
4. Uploads images and PDFs to Firebase Storage

## Pages (6)
| Page | Purpose |
|------|---------|
| Home | Hero, stats, course preview, mentor teaser, lead capture, testimonials, app download |
| Courses | Filter by exam, course cards, Buy Now → app, freemium WhatsApp CTA |
| About Us | Brand story, mentor profiles (Concept B editorial cards), trust signals, socials |
| Blog | Article listing, exam filters, YouTube embeds, PDF downloads |
| News | Notice board with date badges, exam tags, pinned latest notice |
| Contact / Book | WhatsApp link, booking form, social links, app badges |

## Lead capture — 3 triggers
| Trigger | When | Frequency |
|---------|------|-----------|
| Pop-up modal | After 50% scroll on homepage | Once per session (sessionStorage) |
| Sticky bottom bar | Always on all pages | Dismissible, stays gone for session |
| Mid-page section | Always visible on homepage | Permanent |

### Lead form fields
- Name — required
- Phone — required
- City / State — required
- Exam (JEE / NEET / CUET / AKTU / MHT-CET / IPU / Other) — required dropdown
- Expected rank / score — required
- Email — optional

### On submit
1. Write to Firestore `/leads` collection
2. Open `wa.me/{ADMIN_NUMBER}?text=New lead: {name}, {phone}, {exam}, Rank: {rank}, {city}` in new tab

## Mentor profiles — Concept B (editorial horizontal cards)
Both co-founders appear on:
- **About Us page** — full editorial cards (primary placement)
- **Homepage** — compact teaser strip with "Meet our mentors →" CTA

### Ritik Mishra
- Title: Co-founder & Lead Counsellor
- Exams: JEE (Main & Advanced), NEET, CUET
- Experience: 3 years · 3000+ students guided
- Bio: "With 3 years in the EdTech counselling space, Ritik has become one of the most trusted voices for JEE and NEET aspirants. His approach — data-driven rank analysis combined with honest, personalised guidance — has helped over 3000 students land seats at NITs, IIITs, and top medical colleges across India."
- Avatar: Initials `RM` in Steel Blue `#4A72A8` circle (replace with photo when available)

### Abhishek Mishra
- Title: Co-founder & Lead Counsellor
- Exams: AKTU, MHT-CET, IPU, and all major state counsellings
- Experience: 3 years · 3000+ students guided
- Bio: "Abhishek specialises in state-level counsellings — AKTU, MHT-CET, IPU, and beyond. Known for his no-nonsense breakdown of complex seat matrix data, he has guided 3000+ students through the most stressful phase of their academic lives, helping them make confident, informed college choices."
- Avatar: Initials `AM` in Dark Blue `#1A3A6B` circle (replace with photo when available)

### Mentor card design spec
```
Card: bg-secondary | border: 0.5px border-tertiary | border-radius: 12px | overflow: hidden
Left accent: 8px wide bar | color: #4A72A8 | full card height
Avatar: 80x80px circle | initials 24px 500 white
Name: 17px Poppins 500 | Co-founder badge: bg #E6F1FB text #0C447C 11px pill
Subtitle: 13px muted | Bio: 13px line-height 1.65
Stats row: students · years · exams (13px, bold value)
```

## App integration
```
Buy Now button  →  if Android: Play Store URL
                   if iOS: App Store URL
                   if app installed: udaanvidyapeeth://course/{course-id}
Freemium CTA    →  wa.me/{ADMIN_NUMBER}?text=Hi! I want a free counselling call
App badges      →  Homepage bottom strip + Contact page
```

## Exams covered
JEE Main, JEE Advanced, NEET, CUET, AKTU, MHT-CET, IPU, and all major state counsellings
