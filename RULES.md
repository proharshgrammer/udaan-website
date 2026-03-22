# Coding Rules & Conventions

Read this before writing any code for this project.

## Non-negotiables
- **No payments on website** — all purchases happen in the mobile app. Never add a payment form, Razorpay, Stripe, or any checkout flow.
- **No student login** — students never create accounts or log in on the website.
- **No backend server** — Firebase only. No Express, no Node server, no REST API.
- **Admin auth only** — Firebase Auth is exclusively for the admin panel. Website has no auth.
- **Free tier only** — use only services that are free at launch. No paid APIs.

## React conventions
- Functional components only — no class components
- Named exports for components, default export for pages
- Co-locate styles with components using Tailwind classes — no separate CSS files per component
- Use `import.meta.env.VITE_*` for all env variables (Vite convention)
- All Firebase calls go through `src/firebase.js` — never initialise Firebase inline

## Firebase conventions
```js
// firebase.js — single init, export everything from here
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const app = initializeApp({ /* from import.meta.env */ });
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

- Use `onSnapshot` for real-time reads (notices, blogs, courses on website)
- Use `getDocs` for one-time reads (leads inbox in admin)
- Always `orderBy('createdAt', 'desc')` on list queries unless `order` field exists
- Always handle loading and error states in every Firestore hook

## Firestore hook pattern
```js
// hooks/useFirestore.js
export function useCollection(collectionName, constraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(q,
      snap => { setData(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      err => { setError(err); setLoading(false); }
    );
    return unsub;
  }, [collectionName]);

  return { data, loading, error };
}
```

## Lead form submission pattern
```js
async function submitLead(formData) {
  // 1. Save to Firestore
  await addDoc(collection(db, 'leads'), {
    ...formData,
    createdAt: serverTimestamp(),
    read: false
  });
  // 2. WhatsApp notification (opens in new tab)
  const msg = encodeURIComponent(
    `New Udaan lead:\nName: ${formData.name}\nPhone: ${formData.phone}\nExam: ${formData.exam}\nRank: ${formData.rank}\nCity: ${formData.city}`
  );
  window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  // 3. Dismiss lead capture
  sessionStorage.setItem('udaan_lead_dismissed', 'true');
}
```

## Lead capture popup rules
```
Show if:  window.scrollY / document.body.scrollHeight >= 0.5
       && !sessionStorage.getItem('udaan_lead_dismissed')
Dismiss:  sessionStorage.setItem('udaan_lead_dismissed', 'true')
          (on X click OR on successful submit)
Never:    show again in the same session after dismiss
```

## Deep link pattern
```js
// utils/deepLink.js
export function openCourse(course) {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const deep = `${import.meta.env.VITE_APP_DEEP_LINK_SCHEME}://course/${course.id}`;
  const store = isIOS ? course.appStoreUrl : course.playStoreUrl;
  window.location.href = deep;
  setTimeout(() => window.open(store, '_blank'), 1800);
}
```

## Image handling
- Logo on dark bg: use `logo-dark.png`
- Logo on light bg: use `logo-light.png`
- Mentor photos: if `photo` field is empty string, show initials avatar. If URL present, show `<img>` with `object-cover rounded-full`
- All Firebase Storage images use `getDownloadURL()` — never hardcode storage paths

## Tailwind class conventions
```
Layout:     container mx-auto px-4 sm:px-6 lg:px-8
Sections:   py-16 md:py-24
Cards:      rounded-2xl border border-gray-100 p-6
Buttons:    rounded-full px-6 py-3 font-heading font-600 transition
Headings:   font-heading font-bold text-3xl md:text-4xl lg:text-5xl
Body text:  font-body text-base text-gray-700 leading-relaxed
Muted text: text-sm text-gray-500
```

## Admin panel rules
- Every route except `/login` wrapped in `<ProtectedRoute>`
- Always show `react-hot-toast` on success and error
- Always show confirm dialog before delete: `window.confirm('Are you sure you want to delete this?')`
- Quill image handler must upload to Firebase Storage, not embed base64 (base64 bloats Firestore docs)
- All form inputs must be controlled components with validation

## Accessibility
- All images have meaningful `alt` text
- All buttons have descriptive labels (not just "click here")
- Form inputs have associated `<label>` elements
- Colour contrast meets WCAG AA minimum

## Performance
- Lazy load all page components: `const Home = lazy(() => import('./pages/Home'))`
- Wrap router in `<Suspense fallback={<LoadingSpinner />}>`
- Images from Firebase Storage: add `?alt=media` to download URLs
- Never block render with synchronous Firebase calls

## Do not
- Add any analytics (no GA, no Hotjar) unless explicitly asked
- Add any cookie banners
- Hard-code any phone numbers, URLs, or prices — all come from Firestore or .env
- Use `localStorage` for lead dismiss — use `sessionStorage` (resets on tab close)
- Write inline styles — use Tailwind classes
- Use `any` TypeScript type if TS is added later
