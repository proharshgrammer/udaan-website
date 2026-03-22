# Udaan Vidyapeeth — Project Context

> Read this file first. It tells you what this project is and points you to the right file for each topic.

## What is this project?

A React.js website + admin panel for **Udaan Vidyapeeth** — an Indian EdTech brand that provides college counselling to students after competitive entrance exams (JEE, NEET, CUET, AKTU, MHT-CET, IPU and all state counsellings).

**The product in one sentence:** A bold, energetic marketing + lead capture website that builds trust with anxious students, collects their details, and redirects them to the mobile app for purchases — with a separate no-code admin panel for the non-technical client.

---

## File index

| File | Read this for... |
|------|-----------------|
| `PRD.md` | What to build, user flows, page specs, mentor specs, lead capture |
| `TECH_STACK.md` | Architecture, folder structure, Firebase schema, security rules, env vars, code snippets |
| `DESIGN_SYSTEM.md` | Brand colors, typography, Tailwind config, all component specs |
| `ADMIN_PANEL.md` | Full admin panel spec — routes, pages, forms, editor setup |
| `CONTENT.md` | All copy, placeholder data, mentor bios, seed data for Firebase |
| `RULES.md` | Coding conventions, what NOT to do, patterns to follow |
| `BUILD_ORDER.md` | Step-by-step build sequence + QA checklist |

---

## Key decisions (already made — do not change)

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | React + Vite | Fast, standard |
| Styling | Tailwind CSS | Mobile-first utility |
| Database | Firebase Firestore | Free, real-time, no server |
| Auth | Firebase Auth | Admin only, email+password |
| Storage | Firebase Storage | Free 5GB for images + PDFs |
| Rich editor | Quill.js | Free, open source |
| Hosting | Vercel | Free, CI/CD |
| Payments | NOT on website | Mobile app handles purchases |
| Student accounts | NONE | No login for students |
| Backend server | NONE | Firebase only |

---

## People

| Person | Role |
|--------|------|
| Ritik Mishra | Co-founder, Lead Counsellor, JEE/NEET/CUET specialist, face of YT/Instagram |
| Abhishek Mishra | Co-founder, Lead Counsellor, state counsellings specialist, face of YT/Instagram |
| Client | Same as above (Ritik + Abhishek) — will use admin panel |

---

## URLs

| URL | What |
|-----|------|
| `udaanvidyapeeth.com` | Main website |
| `admin.udaanvidyapeeth.com` | Admin panel |
| Firebase project | Single shared project for both apps |

---

## Exam coverage
JEE Main · JEE Advanced · NEET · CUET · AKTU · MHT-CET · IPU · All major state counsellings

---

## Brand in 5 words
**Bold. Aspirational. Trustworthy. Indian. Expert.**

Colors: Steel Blue `#4A72A8` · Dark `#0D0D0D` · White `#FFFFFF`
Fonts: Poppins (headings) · Inter (body)
Logo dark bg: `logo-dark.png` · Logo light bg: `logo-light.png`

---

## Critical rules (repeat from RULES.md)

1. NO payments on the website — ever
2. NO student login — ever
3. NO backend server — Firebase only
4. Admin auth is ONLY for `admin.udaanvidyapeeth.com`
5. All env vars use `VITE_` prefix
6. Lead dismiss uses `sessionStorage` (not localStorage)
7. Hard-code nothing — prices, URLs, and copy come from Firestore or `.env`
