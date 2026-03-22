# Design System

## Brand identity
- **Brand name:** Udaan Vidyapeeth (उड़aan)
- **Tagline:** Your rank. Your dream college. Let's figure it out together.
- **Vibe:** Bold & energetic (Unacademy/Byju's energy) + structured clarity (editorial)
- **Audience:** Indian students 17–22, anxious about college after entrance exams
- **Tone:** Inspirational + informational + action-oriented. Never condescending.

## Logo files
```
public/logo-dark.png    →  Use on dark/blue backgrounds  (white circle outline version)
public/logo-light.png   →  Use on white/light backgrounds
```
Always show the correct logo variant based on section background.

## Colors
```css
:root {
  --brand-blue: #4A72A8;      /* Primary — buttons, accents, badges */
  --brand-dark: #1A3A6B;      /* Deep blue — hover states, secondary avatar */
  --brand-bg: #0D0D0D;        /* Near-black — hero sections, dark strips */
  --brand-light: #E8EFF9;     /* Light blue tint — badge backgrounds */
  --white: #FFFFFF;
}
```

### Color usage rules
- Dark hero sections: `bg-[#0D0D0D]` with white text
- Light content sections: white bg with `#0D0D0D` text
- Alternate: dark → light → dark → light rhythm across homepage sections
- Buttons: `bg-[#4A72A8]` white text, hover `bg-[#1A3A6B]`
- Exam badge pills: `bg-[#E8EFF9] text-[#0C447C]`
- Co-founder badge: `bg-[#E6F1FB] text-[#0C447C]`
- WhatsApp FAB: green `#25D366`

## Typography
```css
/* Google Fonts — add to index.html */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500&family=Dancing+Script:wght@700&display=swap');

font-family: 'Poppins', sans-serif;    /* Headings, nav, CTAs */
font-family: 'Inter', sans-serif;      /* Body text, descriptions */
font-family: 'Dancing Script', cursive; /* Logo wordmark only */
```

### Type scale
```
Hero heading:    Poppins 800  56px / 4xl–5xl
Section heading: Poppins 700  36px / 3xl
Card heading:    Poppins 600  20px / xl
Body:            Inter  400  16px / base  line-height: 1.7
Small/muted:     Inter  400  14px / sm
Badge/label:     Inter  500  12px / xs
```

## Tailwind config additions
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4A72A8',
          dark: '#1A3A6B',
          bg: '#0D0D0D',
          light: '#E8EFF9',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      }
    }
  }
}
```

## Component specs

### ExamBadge
```jsx
// Pill badge for exam type labels
<span className="inline-block bg-brand-light text-[#0C447C] text-xs font-medium px-3 py-1 rounded-full">
  JEE
</span>
```
Exam options: JEE · NEET · CUET · AKTU · MHT-CET · IPU · State

### CourseCard
```
bg-white | border border-gray-100 | rounded-2xl | p-6 | hover:shadow-md transition
├── ExamBadge (top left)
├── Course name — Poppins 600 18px
├── Features list — Inter 14px muted, 3–4 bullets
├── Price — Poppins 700 24px brand-blue
└── "Buy Now" button — full width, brand-blue bg, white text
```

### MentorCard (Concept B — About Us primary)
```
bg-gray-50 | rounded-xl | border border-gray-100 | overflow-hidden
├── Left accent bar: 8px wide | bg-brand-blue | full height
└── Content area: p-5 flex gap-5
    ├── Avatar: 80x80 circle | initials 24px 500 white
    │   Ritik:    bg-brand-blue  (#4A72A8)
    │   Abhishek: bg-brand-dark  (#1A3A6B)
    └── Info column:
        ├── Row: Name (17px Poppins 500) + "Co-founder" pill badge
        ├── Subtitle: "Lead Counsellor · 3 years experience" (13px muted)
        ├── Bio paragraph (13px Inter line-height 1.65)
        └── Stats row: "3000+ students · 3 yrs · JEE, NEET, CUET"
```
When `photo` field is present in Firestore: replace initials circle with `<img>` (same size, rounded-full, object-cover).

### MentorTeaser (Homepage compact strip)
```
2-column grid | bg-gray-50 rounded-xl p-4
Each cell: flex items-center gap-3 | bg-white rounded-xl p-3
├── Avatar: 48x48 circle with initials (same colors as MentorCard)
├── Name: 14px Poppins 500
└── Subtitle: 12px muted — exam specialisation
Bottom: "Meet our mentors in detail →" link → /about#mentors
```

### LeadForm
```
Fields: Name | Phone | City/State | Exam (select) | Rank/Score | Email (optional)
Submit button: "Book my free call" | full width | brand-blue
All required fields show red border + message on blur if empty
Phone: numeric input, 10-digit India format
Exam: <select> with options: JEE / NEET / CUET / AKTU / MHT-CET / IPU / Other
```

### LeadPopup
```
Overlay: fixed inset-0 bg-black/60 z-50
Modal: bg-white rounded-2xl p-6 max-w-md mx-auto mt-[15vh]
Header: brand logo + "Your rank. Your dream college." heading
Close (X) button: top-right, calls dismiss()
Contains: <LeadForm />
Trigger: window scroll >= 50% of document height, !sessionStorage dismissed
```

### StickyBar
```
fixed bottom-0 left-0 right-0 z-40 bg-brand-bg text-white py-3 px-4
flex items-center justify-between
Left: "Got your rank? Get a free expert call →"
Right: "Book Now" button (brand-blue) + dismiss X
On dismiss: sessionStorage.setItem('udaan_lead_dismissed', 'true')
```

### WhatsAppFAB
```
fixed bottom-6 right-6 z-50
bg-[#25D366] text-white rounded-full w-14 h-14
WhatsApp SVG icon center
href: wa.me/{VITE_WHATSAPP_NUMBER}?text=Hi! I need counselling guidance
Opens in new tab
```

### Navbar
```
sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100
Logo (left) | Nav links (center/right) | "Book Free Call" CTA button
Mobile: hamburger menu → slide-down drawer
Links: Home · Courses · About · Blog · News · Contact
CTA button: brand-blue bg, white text, rounded-full
```

### Footer
```
bg-brand-bg text-white | py-12 px-6
Row 1: Logo + tagline
Row 2: Links (Home · Courses · About · Blog · News · Contact)
Row 3: Social icons (YouTube, Instagram) + WhatsApp
Row 4: App store badges (Play Store + App Store)
Row 5: © 2024 Udaan Vidyapeeth. All rights reserved.
```

## Section rhythm (Homepage)
```
1. Navbar (sticky, white)
2. Hero — DARK bg (#0D0D0D)
3. Stats strip — brand-blue bg
4. Mentor teaser — light gray bg
5. Course preview — white bg
6. Lead capture section — brand-blue bg
7. Testimonials — light gray bg
8. App download strip — dark bg
9. Footer — dark bg
```
Alternate dark/light sections for visual rhythm. Never two identical bg sections adjacent.

## Responsive breakpoints (Tailwind defaults)
```
sm:  640px   — phablet
md:  768px   — tablet
lg:  1024px  — desktop
xl:  1280px  — wide desktop
```
Build mobile-first. Most students are on Android phones.
