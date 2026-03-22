# Admin Panel Specification

## Overview
Separate React app at `admin.udaanvidyapeeth.com`. Client (non-technical) logs in with email + password and manages all website content without touching any code.

## Auth
- Firebase Auth — email/password only
- Single user (the client)
- All routes except `/login` are protected — redirect to `/login` if `!currentUser`
- On login success → redirect to `/dashboard`
- Persist auth with `browserLocalPersistence`

## Routes
```
/login          →  Login.jsx       (public)
/dashboard      →  Dashboard.jsx   (protected)
/notices        →  Notices.jsx     (protected)
/blog           →  Blog.jsx        (protected)
/courses        →  Courses.jsx     (protected)
/team           →  Team.jsx        (protected)
/leads          →  Leads.jsx       (protected)
/media          →  Media.jsx       (protected)
```

## Sidebar navigation
```
[Udaan logo]
─────────────
Dashboard
Notices
Blog
Courses
Team
─────────────
Leads inbox  [badge with unread count]
Media
─────────────
[Logout]
```

## Pages

### Dashboard
Stats cards row:
- Total leads (Firestore count of /leads)
- Unread leads (read === false)
- Published blogs
- Active courses
- Total notices

Recent leads table (last 5): name, phone, exam, rank, date

### Notices
List of all notices (newest first)
Each row: title | exam tags | date | pinned toggle | Edit | Delete
"+ New Notice" button → form modal:
```
Title*         text input
Body*          textarea (plain text, no rich editor)
Exam tags      multi-select checkboxes: JEE / NEET / CUET / AKTU / MHT-CET / IPU
Date*          date picker (defaults to today)
Pin this       toggle (only 1 can be pinned — unpin others on save)
Source URL     text input (optional)
```

### Blog
List of all articles: title | exam tags | date | published toggle | Edit | Delete
"+ New Article" button → full-page editor:
```
Title*         text input (large, Poppins)
Thumbnail      image upload → Firebase Storage → stores URL
Exam tags      multi-select
Read time      number input (minutes)
Published      toggle (draft vs live)
Content*       Quill.js rich text editor
               Toolbar: Bold | Italic | Heading 2 | Heading 3 |
                        Bullet list | Number list | Link | Image | Blockquote
```

### Courses
List of courses: name | exam | price | active toggle | Edit | Delete
"+ New Course" button → form:
```
Course name*       text input
Exam*              single select
Description*       textarea
Price (₹)*         number input
Features           dynamic list — add/remove bullet points
Play Store URL*    text input
App Store URL*     text input
App deep link*     text input (udaanvidyapeeth://course/{id})
Active             toggle (hide/show on website)
Display order      number (lower = shown first)
```

### Team
List of team members with avatar preview: name | role | order | Edit | Delete
"+ Add Member" button → form:
```
Full name*         text input
Role*              text input (e.g. "Co-founder & Lead Counsellor")
Bio*               textarea
Photo              image upload → Firebase Storage (leave empty to show initials)
Initials*          text input (2 chars, e.g. "RM")
Avatar color*      color picker (default #4A72A8)
Exam expertise     multi-select tags
Co-founder         toggle
Students guided    number input
Years experience   number input
Display order      number
```

### Leads inbox
Table: name | phone | exam | rank | city | email | date | read
- Filter by exam, filter by read/unread
- Click row → mark as read
- "Mark all as read" button
- No delete (keep all leads for records)
- Export to CSV button (client-side, all leads)

### Media
Two tabs: Images | PDFs

Upload area: drag & drop or click to browse
- Images: JPG, PNG, WEBP — max 5MB each
- PDFs: PDF only — max 20MB each
- Uploads to Firebase Storage: `/images/` or `/pdfs/` prefix
- After upload: shows URL + copy button
- List of all uploaded files with delete option

## UI guidelines for admin panel
- Clean, minimal, professional — not as bold as the website
- White background, gray sidebar
- Tailwind CSS same config as website
- Poppins headings, Inter body
- Use `react-hot-toast` for success/error notifications
- Loading skeletons for all data tables
- Confirm dialog before any delete action
- All forms validate before submit (required fields, URL format, etc.)
- Mobile-friendly — client may use on phone

## Key component: RichEditor (Quill.js)
```jsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'blockquote'],
    ['clean']
  ]
};
// Image handler: upload to Firebase Storage, insert URL into editor
```

## Key component: MediaUploader
```jsx
// Firebase Storage upload with progress bar
// Returns download URL on success
// Stores URL in state for form submission
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
```
