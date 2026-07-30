# Nomad Travel Co.

Award Winning Travel & Visa Consultancy — Dubai, UAE

---

## Overview

Nomad Travel Co. is a full-featured travel and visa consultancy website for Dubai-based travel expert **Aman Singh**. It covers Gulf destination tours, holiday packages, UAE visa guidance, and WhatsApp-based lead collection — all in a single React file with zero external CSS dependencies.

Built with: React 18 · React Router v6 · Vite · CSS-in-JS · Vercel

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero slider, search bar, experiences board, destinations grid, itinerary, testimonials |
| About | `/about` | Aman Singh's profile, services, values, highlights |
| Contact | `/contact` | WhatsApp enquiry form, Google Maps embed, contact details |
| Dubai | `/dubai` | Tours and experiences |
| Abu Dhabi | `/abu-dhabi` | Tours and packages |
| Doha | `/doha` | Qatar tours |
| Riyadh | `/riyadh` | Saudi Arabia tours |
| Muscat | `/muscat` | Oman tours |
| Kuwait | `/kuwait` | Kuwait tours |
| Bahrain | `/bahrain` | Bahrain tours |

---

## Features

- Fully responsive — mobile, tablet, desktop
- Sticky header with scroll-shadow and active nav highlighting
- Hover dropdown menus with animated arrow reveals
- Hero slideshow with Ken Burns zoom and smooth crossfade
- Experience board — hover to preview, click to enquire
- Destination cards with zoom-on-hover
- WhatsApp float button with pulse animation and tooltip
- Animated footer with running gradient border and newsletter strip
- Enquiry modal — dates, guests, budget, WhatsApp redirect
- All enquiries pre-fill a WhatsApp message and open wa.me/971551234567
- No backend, no database, no Firebase

---

## Animations

- fadeUp, fadeLeft, fadeRight, scaleIn on section reveals
- Shimmer sweep on all primary buttons
- Ken Burns hero image zoom
- Hamburger to X transition
- Dropdown fadeDown entry
- Service card float on hover
- WhatsApp glow pulse ring
- Timeline stagger entries
- Footer link arrow reveal on hover

---

## Project Structure

```
src/
└── App.jsx       ← Entire app: all CSS, all pages, all components
public/
└── index.html
package.json
vite.config.js
README.md
```

Everything lives in `App.jsx`. Styles are injected via a `StyleInjector` component — no external CSS files required.

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Install and Run

```bash
git clone https://github.com/your-username/nomad-travel-co.git
cd nomad-travel-co
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `/dist` — ready to deploy anywhere.

---

## Deployment

Deployed on Vercel. To deploy your own copy:

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at vercel.com for automatic deploys on every push.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Vite | Build tool and dev server |
| CSS-in-JS (injected style tag) | All styling, zero external CSS |
| WhatsApp API (wa.me) | Lead capture and enquiry |
| Google Fonts | Playfair Display + DM Sans |
| Vercel | Hosting and deployment |

---

## Destinations Covered

| City | Country | Route |
|---|---|---|
| Dubai | UAE | `/dubai` |
| Abu Dhabi | UAE | `/abu-dhabi` |
| Doha | Qatar | `/doha` |
| Riyadh | Saudi Arabia | `/riyadh` |
| Muscat | Oman | `/muscat` |
| Kuwait | Kuwait | `/kuwait` |
| Bahrain | Bahrain | `/bahrain` |

---

## Contact

- Phone: +971 55 123 4567
- Email: info@nomadtravel.co
- Office: Office 301, Business Bay, Dubai, UAE
- WhatsApp: https://wa.me/971551234567
- Consultant: Aman Singh

---

## Developer

Built and designed by Aman Singh
amansh9596@gmail.com

---

## License

MIT License
