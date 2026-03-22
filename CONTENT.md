# Content & Copy

All placeholder content ready to use. Client will replace/update via admin panel post-launch.

## Brand copy

### Taglines
- Primary: "Your rank. Your dream college. Let's figure it out together."
- Secondary: "Expert counselling for every entrance exam."
- Short: "Your Udaan starts here."

### Hero section
```
Heading:    Your rank.
            Your dream college.
            Let's figure it
            out — together.

Subheading: Expert counselling for JEE, NEET, CUET, AKTU, MHT-CET, IPU
            and every major state counselling across India.

CTA button: Book your free call
Secondary:  Explore courses
```

### Stats strip (placeholder numbers — client to verify)
```
6000+    Students guided
50+      Colleges covered
10+      Exams we handle
3        Years of expertise
```

### Lead capture section
```
Heading:    Got your rank?
Subheading: Let's find your college. Book a free 20-minute
            call with our counselling experts — no cost, no strings.

Form label: Your rank. Your dream college.
            Let's figure it out together.

Submit CTA: Book my free call
```

### Freemium CTA (courses page)
```
Heading:    Not sure which course is right for you?
Body:       Talk to us first — completely free.
            Get a 15-minute call to understand exactly
            what kind of support you need.
CTA:        Chat on WhatsApp → free
```

### App download strip
```
Heading:    Take Udaan with you
Body:       Download the app for full course access,
            recorded sessions, and choice filling tools.
```

## Homepage testimonials (placeholder — replace with real ones)

```js
const testimonials = [
  {
    name: "Arjun Sharma",
    exam: "JEE Main",
    rank: "AIR 8,420",
    college: "NIT Trichy — CSE",
    quote: "Ritik sir helped me understand exactly which round to lock in. Couldn't have made this decision alone.",
    avatar: "AS"
  },
  {
    name: "Priya Verma",
    exam: "NEET",
    rank: "584 / 720",
    college: "KGMC Lucknow — MBBS",
    quote: "I was completely lost after results. One session with Udaan and I had a clear college list ready.",
    avatar: "PV"
  },
  {
    name: "Rohan Gupta",
    exam: "AKTU",
    rank: "State Rank 1,240",
    college: "HBTU Kanpur — ECE",
    quote: "Abhishek sir's breakdown of the AKTU seat matrix was the clearest explanation I've seen anywhere.",
    avatar: "RG"
  },
  {
    name: "Sneha Patel",
    exam: "MHT-CET",
    rank: "Percentile 97.8",
    college: "COEP Pune — Mechanical",
    quote: "The choice filling session was worth every rupee. Got my first preference college.",
    avatar: "SP"
  }
]
```

## Placeholder courses (replace via admin panel)

```js
const courses = [
  {
    name: "JEE Complete Counselling",
    exam: "JEE",
    description: "End-to-end JEE counselling — rank analysis, college list, choice filling, and round-wise strategy.",
    price: 1999,
    features: [
      "1-on-1 counselling session (60 min)",
      "Personalised college list based on your rank",
      "Choice filling support",
      "Round-wise lock strategy",
      "WhatsApp support during counselling"
    ],
    active: true
  },
  {
    name: "NEET Complete Counselling",
    exam: "NEET",
    description: "Full NEET counselling support — from MCC to state quota — with expert guidance at every round.",
    price: 1999,
    features: [
      "1-on-1 counselling session (60 min)",
      "MCC + state quota strategy",
      "College preference list",
      "Stray vacancy round guidance",
      "WhatsApp support during counselling"
    ],
    active: true
  },
  {
    name: "State Counselling Support",
    exam: "State",
    description: "Specialised support for AKTU, MHT-CET, IPU and other state counsellings.",
    price: 1499,
    features: [
      "1-on-1 counselling session (45 min)",
      "State-specific seat matrix analysis",
      "Choice filling support",
      "Round strategy",
      "WhatsApp support"
    ],
    active: true
  },
  {
    name: "CUET Counselling",
    exam: "CUET",
    description: "Central university counselling — CSAS portal guidance, preference building, and lock strategy.",
    price: 1499,
    features: [
      "1-on-1 session (45 min)",
      "CSAS portal walkthrough",
      "Program preference building",
      "University shortlisting",
      "WhatsApp support"
    ],
    active: true
  },
  {
    name: "Free Doubt Call",
    exam: "All",
    description: "A free 15-minute call to clear your biggest counselling doubt. No commitment.",
    price: 0,
    features: [
      "15-minute call",
      "One specific doubt addressed",
      "Available via WhatsApp"
    ],
    active: true
  }
]
```

## Placeholder blog posts (replace via admin panel)

```
1. "JEE Main 2024 Counselling: Everything You Need to Know"
   Exam: JEE | Read time: 8 min

2. "NEET Round 2 Seat Allotment — Should You Upgrade or Lock?"
   Exam: NEET | Read time: 6 min

3. "AKTU Counselling 2024: Complete Seat Matrix Breakdown"
   Exam: AKTU | Read time: 10 min

4. "Top NITs for CSE Branch — Rank-wise Cutoffs 2023"
   Exam: JEE | Read time: 7 min

5. "MHT-CET CAP Round 1 — What to Expect and How to Prepare"
   Exam: MHT-CET | Read time: 5 min
```

## Placeholder notices (replace via admin panel)

```
1. [PINNED] "JEE Main 2024 Round 2 Choice Filling Begins — Key Dates"
   Exams: [JEE] | Date: today

2. "NEET UG 2024 Stray Vacancy Round Registration Open"
   Exams: [NEET] | Date: today - 2 days

3. "AKTU 2024-25 Counselling Schedule Released"
   Exams: [AKTU] | Date: today - 3 days
```

## Mentor data (seed to Firestore `/team`)

```js
[
  {
    id: "ritik-mishra",
    name: "Ritik Mishra",
    role: "Co-founder & Lead Counsellor",
    bio: "With 3 years in the EdTech counselling space, Ritik has become one of the most trusted voices for JEE and NEET aspirants. His approach — data-driven rank analysis combined with honest, personalised guidance — has helped over 3000 students land seats at NITs, IIITs, and top medical colleges across India. A familiar face on the Udaan Vidyapeeth YouTube and Instagram channels, he brings clarity to one of the most stressful decisions a student will ever make.",
    initials: "RM",
    avatarColor: "#4A72A8",
    photo: "",
    examsExpertise: ["JEE Main", "JEE Advanced", "NEET", "CUET"],
    coFounder: true,
    studentsGuided: 3000,
    yearsExp: 3,
    order: 1
  },
  {
    id: "abhishek-mishra",
    name: "Abhishek Mishra",
    role: "Co-founder & Lead Counsellor",
    bio: "Abhishek specialises in state-level counsellings — AKTU, MHT-CET, IPU, and beyond. Known for his no-nonsense breakdown of complex seat matrix data, he has guided 3000+ students through the most stressful phase of their academic lives, helping them make confident, informed college choices. His videos on the Udaan Vidyapeeth channel have helped thousands of students understand the counselling process before they even book a session.",
    initials: "AM",
    avatarColor: "#1A3A6B",
    photo: "",
    examsExpertise: ["AKTU", "MHT-CET", "IPU", "State Counsellings"],
    coFounder: true,
    studentsGuided: 3000,
    yearsExp: 3,
    order: 2
  }
]
```

## Social & external links (fill in .env or constants file)
```js
export const LINKS = {
  youtube: "https://youtube.com/@udaanvidyapeeth",   // update with real handle
  instagram: "https://instagram.com/udaanvidyapeeth", // update with real handle
  whatsapp: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`,
  playStore: import.meta.env.VITE_PLAY_STORE_URL,
  appStore: import.meta.env.VITE_APP_STORE_URL,
}
```

## SEO meta tags (per page)
```js
const seoData = {
  home: {
    title: "Udaan Vidyapeeth — College Counselling for JEE, NEET, CUET & More",
    description: "Expert college counselling for JEE, NEET, CUET, AKTU, MHT-CET, IPU. 6000+ students guided. Book a free call today.",
  },
  courses: {
    title: "Counselling Courses & Pricing — Udaan Vidyapeeth",
    description: "Affordable college counselling packages for JEE, NEET, CUET, and state exams. 1-on-1 sessions, choice filling support, and more.",
  },
  about: {
    title: "About Us — Udaan Vidyapeeth",
    description: "Meet Ritik and Abhishek — co-founders of Udaan Vidyapeeth. 3 years of counselling expertise, 6000+ students guided.",
  },
  blog: {
    title: "Blog & Resources — Udaan Vidyapeeth",
    description: "Free articles, guides, and videos on JEE, NEET, CUET, and state counselling.",
  },
  news: {
    title: "Latest Counselling News & Notices — Udaan Vidyapeeth",
    description: "Stay updated with the latest JEE, NEET, CUET, and state counselling news and important dates.",
  },
  contact: {
    title: "Contact Us — Udaan Vidyapeeth",
    description: "Get in touch with Udaan Vidyapeeth. Book a counselling session or ask a question on WhatsApp.",
  }
}
```
