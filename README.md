# 🌍 Gulf Apex Consultant — Travel & Visa Web App

> A production-grade React single-page application for Gulf Apex Consultant, a Dubai-based travel and visa consultancy serving travellers from India and across South Asia.

---

## 📸 Overview

Gulf Apex Consultant is a full-featured travel consultancy website built as a single `App.jsx` file using React and React Router. It covers everything from destination browsing and tour enquiries to UAE visa consultation — all connected to WhatsApp for instant lead capture and Firebase Firestore for data persistence.

---

## ✨ Features

### 🗺️ Pages & Routing
| Route | Page |
|---|---|
| `/` | Home — hero slider, search bar, experiences, destinations, testimonials |
| `/about` | About — company info, expert team with photos |
| `/contact` | Contact — enquiry form with date pickers and budget selector |
| `/visa-consultation` | Visa Consultation — India → UAE visa types, charges table, enquiry form |
| `/dubai` `/abu-dhabi` `/doha` `/riyadh` `/muscat` `/kuwait` `/bahrain` | Destination pages with tour listings |

### 🧩 Components
- **Sticky Header** with dropdown navigation, mobile hamburger menu, and scroll-aware shadow
- **Hero Slider** — auto-advancing 3-slide carousel with animated text and CTA buttons
- **Search Bar** — destination, tour type, date and guest count fields
- **Experience Board** — interactive hover-to-preview tour listing panel
- **Destination Grid** — 7 Gulf destinations with image cards
- **Our Experts** — team cards with photos, roles and badges (About page)
- **Visa Charges Table** — transparent INR pricing with processing times
- **Enquiry Modal** — reusable modal triggered from any tour or CTA
- **WhatsApp Float Button** — fixed-position instant contact button
- **CTA Bands** — full-width gradient call-to-action sections
- **Footer** — brand info, links, newsletter signup, social icons

### 🔥 Firebase Integration
All three enquiry forms save data to **Firebase Firestore** in real time:
- `enquiries` — modal tour enquiries
- `contact_enquiries` — contact page form submissions
- `visa_enquiries` — visa consultation form submissions

Each document includes all form fields plus a `serverTimestamp()` and `source` field for tracking.

### 📲 WhatsApp Lead Capture
Every form builds a structured WhatsApp message and opens `wa.me` in a new tab, so no lead ever falls through the cracks — even without a backend.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (hooks) |
| Routing | React Router v6 |
| Styling | Injected CSS-in-JS (single style block) |
| Fonts | Google Fonts — Playfair Display + DM Sans |
| Database | Firebase Firestore (v10 modular SDK) |
| Deployment | Any static host (Vite / CRA / Netlify / Vercel) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A Firebase project (for Firestore)

### Installation

```bash
git clone https://github.com/your-username/gulf-apex-consultant.git
cd gulf-apex-consultant
npm install
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Firestore Database** in your project
3. Copy your Firebase config and replace the placeholder in `App.jsx`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Run Locally

```bash
npm run dev    # Vite
# or
npm start      # Create React App
```

---

## 📁 Project Structure

```
src/
└── App.jsx          # Entire application — styles, data, components, pages
public/
└── index.html
package.json
```

> This is intentionally a single-file architecture for simplicity and portability. All styles, data constants, helper functions, components and page components live in `App.jsx`.

---

## 🗂️ Firestore Collections

| Collection | Triggered By | Key Fields |
|---|---|---|
| `enquiries` | Tour/modal enquiry form | name, phone, email, packageName, guests, budget, dateFrom, dateTo, message |
| `contact_enquiries` | Contact page form | name, phone, email, service, guests, budget, dateFrom, dateTo, message |
| `visa_enquiries` | Visa consultation form | name, phone, email, visaType, travelDate, passengers, message |

All documents include `createdAt: serverTimestamp()` and `source: "page_name"`.

---

## 🌐 Destinations Covered

- 🇦🇪 Dubai
- 🇦🇪 Abu Dhabi
- 🇶🇦 Doha
- 🇸🇦 Riyadh
- 🇴🇲 Muscat
- 🇰🇼 Kuwait
- 🇧🇭 Bahrain

---

## 🛂 Visa Consultation Page

The `/visa-consultation` page is built specifically for Indian passport holders enquiring about UAE visas. It includes:

- 6 visa categories with indicative INR pricing
- Transparent charges table with processing times
- Documents required checklist
- 5-step application process walkthrough
- Enquiry form saving to Firestore + WhatsApp redirect
- "Get Exact Charges" WhatsApp button for real-time pricing queries

---

## 📄 License

This project is proprietary and built for Gulf Apex Consultant. All rights reserved © 2026 Gulf Apex Consultant L.L.C.

---

## 🤝 Contributing

This is a private client project. For bug reports or feature requests, please contact the development team directly via the email above.
