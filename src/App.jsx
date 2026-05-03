import { useState, useEffect, useRef, useMemo } from "react";
import { Routes, Route, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ── FIREBASE CONFIG ─────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyDEMO_REPLACE_WITH_YOUR_KEY",
  authDomain: "gulf-apex-consultant.firebaseapp.com",
  projectId: "gulf-apex-consultant",
  storageBucket: "gulf-apex-consultant.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch(e) { db = null; }

async function saveToFirebase(collectionName, data) {
  if (!db) return;
  try {
    await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
  } catch(e) { console.warn("Firebase save failed:", e); }
}

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:#FAF7F2;color:#1a1a1a;overflow-x:hidden}
img{display:block;max-width:100%}
a{text-decoration:none;color:inherit}
button{cursor:pointer;font:inherit;border:none;background:none}
input,select,textarea{font:inherit}
ul{list-style:none}

:root{
  --brand:#F26725;
  --brand-deep:#8f3d05;
  --brand-glow:rgba(242,103,37,.35);
  --brand-light:#fff0df;
  --navy:#0A1628;
  --navy-mid:#132040;
  --navy-soft:#1E3058;
  --cream:#FAF7F2;
  --warm:#F5EFE4;
  --white:#fff;
  --muted:#666;
  --light:#999;
  --border:#e8ddd0;
  --shadow:0 4px 24px rgba(0,0,0,.08);
  --shadow-md:0 8px 32px rgba(0,0,0,.11);
  --shadow-lg:0 16px 48px rgba(0,0,0,.15);
  --radius:14px;
  --radius-sm:9px;
}

/* ── KEYFRAMES ────────────────────────────────────────────── */
@keyframes fadeUp   {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeLeft {from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeRight{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn  {from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes fadeDown {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroZoom {from{transform:scale(1)}to{transform:scale(1.08)}}
@keyframes shimmer  {from{transform:translateX(-100%)}to{transform:translateX(100%)}}
@keyframes pulse    {0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.5)}70%{box-shadow:0 0 0 10px rgba(37,211,102,0)}}
@keyframes float    {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes borderRun{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes dotExpand{from{width:8px}to{width:26px;border-radius:4px}}
@keyframes countUp  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideBar {from{transform:scaleX(0)}to{transform:scaleX(1)}}

.anim-up    {opacity:0;animation:fadeUp   .65s ease both}
.anim-left  {opacity:0;animation:fadeLeft .65s ease both}
.anim-right {opacity:0;animation:fadeRight.65s ease both}
.anim-scale {opacity:0;animation:scaleIn  .55s ease both}
.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}
.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}

/* ── TOP BAR ─────────────────────────────────────────────── */
.topbar{background:var(--navy);color:rgba(255,255,255,.72);font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.topbar-inner{max-width:1200px;margin:auto;padding:0 28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px}
.topbar a{color:#F9C96E;transition:opacity .2s}
.topbar a:hover{opacity:.75}
.topbar-right{display:flex;gap:18px;align-items:center}

/* ── HEADER ─────────────────────────────────────────────── */
.header{background:rgba(255,255,255,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:200;transition:box-shadow .3s,background .3s}
.header.scrolled{box-shadow:0 4px 28px rgba(0,0,0,.09);background:rgba(255,255,255,.99)}
.header-inner{max-width:1200px;margin:auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:68px}

.logo{display:flex;align-items:center;gap:11px;flex-shrink:0}
.logo-icon{width:42px;height:42px;background:linear-gradient(135deg,var(--brand),#ff9f57);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px;letter-spacing:.5px;box-shadow:0 4px 14px var(--brand-glow);flex-shrink:0}
.logo-name{font-family:'Playfair Display',serif;font-size:15.5px;font-weight:700;color:var(--navy);line-height:1.2}
.logo-sub{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px}

.nav{display:flex;align-items:center;gap:2px}
.nav-item{position:relative;padding:8px 13px;font-size:13.5px;font-weight:500;color:#444;border-radius:8px;transition:color .2s,background .2s;cursor:pointer;display:flex;align-items:center;gap:4px;white-space:nowrap}
.nav-item-wrap{position:relative;display:inline-block}
.nav-item-wrap:hover .nav-item{color:var(--brand);background:var(--brand-light)}
.nav-item.active{color:var(--brand);background:var(--brand-light);font-weight:600}
.nav-item.active::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:20px;height:2px;background:var(--brand);border-radius:2px}
.nav-caret{font-size:9px;opacity:.55;transition:transform .2s}
.nav-item-wrap:hover .nav-caret{transform:rotate(180deg)}
.nav-cta{background:var(--brand)!important;color:#fff!important;font-weight:600!important;border-radius:8px;margin-left:10px;box-shadow:0 2px 10px var(--brand-glow);position:relative;overflow:hidden}
.nav-cta::after{content:'';position:absolute;inset:0;background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,.25) 50%,transparent 70%);transform:translateX(-100%);transition:transform .5s}
.nav-cta:hover{background:var(--brand-deep)!important;box-shadow:0 4px 18px var(--brand-glow)}
.nav-cta:hover::after{transform:translateX(100%)}

.dropdown{position:absolute;top:calc(100% + 2px);left:50%;transform:translateX(-50%);background:#fff;border-radius:13px;box-shadow:0 16px 48px rgba(0,0,0,.14);min-width:210px;padding:7px;border:1px solid var(--border);z-index:400;animation:fadeDown .2s ease;margin-top:0}
.dropdown a{display:block;padding:9px 14px;font-size:13px;color:#333;border-radius:8px;transition:background .15s,color .15s}
.dropdown a:hover{background:var(--brand-light);color:var(--brand)}
.dropdown a::before{content:'→';margin-right:8px;opacity:0;transition:opacity .15s,transform .15s;display:inline-block;transform:translateX(-4px)}
.dropdown a:hover::before{opacity:1;transform:translateX(0)}

.hamburger{display:none;flex-direction:column;gap:5px;padding:6px;border-radius:8px;transition:background .2s}
.hamburger:hover{background:var(--warm)}
.hamburger span{display:block;width:22px;height:2px;background:var(--navy);border-radius:2px;transition:all .28s ease}
.hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}

.theme-toggle{background:none;border:1.5px solid var(--border);border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--navy);transition:all .22s;margin-left:8px;flex-shrink:0}
.theme-toggle:hover{background:var(--brand-light);border-color:var(--brand);color:var(--brand)}

.mobile-menu{border-top:1px solid var(--border);background:#fff;max-height:80vh;overflow-y:auto}
.mob-section{padding:10px 22px 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#bbb}
.mob-link{display:block;padding:11px 22px;font-size:14px;color:#333;border-bottom:1px solid #f5f5f5;transition:color .15s,background .15s}
.mob-link:hover{color:var(--brand);background:var(--brand-light)}
.mob-link.sub{padding-left:36px;font-size:13px;color:var(--muted)}
.mob-link.cta{background:var(--brand);color:#fff;margin:14px 22px 16px;border-radius:9px;text-align:center;font-weight:600;border-bottom:none}

/* ── BUTTONS ──────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 26px;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;border:none}
.btn::after{content:'';position:absolute;inset:0;background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,.28) 50%,transparent 70%);transform:translateX(-100%);transition:transform .55s}
.btn:hover::after{transform:translateX(100%)}
.btn-primary{background:var(--brand);color:#fff;box-shadow:0 3px 12px var(--brand-glow)}
.btn-primary:hover{background:var(--brand-deep);transform:translateY(-2px);box-shadow:0 8px 24px var(--brand-glow)}
.btn-outline-dark{background:transparent;color:var(--navy);border:1.5px solid var(--navy)}
.btn-outline-dark:hover{background:var(--navy);color:#fff;transform:translateY(-2px)}
.btn-ghost{background:rgba(255,255,255,.18);color:#fff;border:2px solid rgba(255,255,255,.9);backdrop-filter:blur(4px);text-shadow:0 1px 3px rgba(0,0,0,.2)}
.btn-ghost:hover{background:rgba(255,255,255,.3);border-color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.2)}
.btn-white{background:#fff;color:var(--brand-deep)}
.btn-white:hover{background:#fff5e0;transform:translateY(-2px)}
.btn.full{width:100%}

/* ── HERO ──────────────────────────────────────────────────── */
.hero{position:relative;height:94vh;min-height:580px;overflow:hidden}
.hero-slide{position:absolute;inset:0;opacity:0;transition:opacity 1s ease}
.hero-slide.active{opacity:1}
.hero-slide img{width:100%;height:100%;object-fit:cover;animation:heroZoom 20s ease-in-out infinite alternate}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(115deg,rgba(10,22,40,.78) 0%,rgba(10,22,40,.32) 60%,transparent 100%)}
.hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 80px;max-width:720px;color:#fff}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 16px;border-radius:22px;margin-bottom:22px;width:fit-content;animation:fadeUp .6s .05s both}
.hero-badge::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--brand);flex-shrink:0}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(38px,5.5vw,66px);font-weight:800;line-height:1.08;margin-bottom:20px;text-shadow:0 2px 20px rgba(0,0,0,.22);animation:fadeUp .6s .15s both}
.hero-title span{color:#F9C96E;font-style:italic}
.hero-desc{font-size:17px;line-height:1.75;color:rgba(255,255,255,.85);margin-bottom:34px;font-weight:300;animation:fadeUp .6s .25s both;max-width:520px}
.hero-btns{display:flex;gap:13px;flex-wrap:wrap;animation:fadeUp .6s .35s both}
.hero-dots{position:absolute;bottom:32px;left:80px;display:flex;gap:8px;z-index:10}
.hero-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.4);border:none;cursor:pointer;transition:all .3s}
.hero-dot.active{background:#fff;width:26px;border-radius:4px}
.hero-scroll{position:absolute;bottom:32px;right:40px;display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(255,255,255,.6);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;animation:float 2.5s ease-in-out infinite}
.hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(255,255,255,.6),transparent)}

/* ── SEARCH BAR ───────────────────────────────────────────── */
.searchbar-wrap{background:#fff;padding:0 28px;margin-top:-56px;position:relative;z-index:50}
.searchbar-inner{max-width:1120px;margin:auto}
.searchbar{background:#fff;border-radius:18px;box-shadow:0 16px 56px rgba(0,0,0,.13);display:flex;align-items:flex-end;padding:22px 26px;gap:14px;flex-wrap:wrap;border:1px solid var(--border)}
.sf{flex:1;min-width:140px;display:flex;flex-direction:column;gap:6px}
.sf label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--light)}
.sf select,.sf input{padding:10px 13px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;color:#333;background:#fafafa;outline:none;transition:border .2s,box-shadow .2s}
.sf select:focus,.sf input:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(242,103,37,.12);background:#fff}
.search-go{padding:11px 28px;background:var(--brand);color:#fff;border:none;border-radius:var(--radius-sm);font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;box-shadow:0 3px 12px var(--brand-glow)}
.search-go:hover{background:var(--brand-deep);transform:translateY(-1px)}

/* ── STATS ────────────────────────────────────────────────── */
.statsbar{background:var(--navy);padding:22px 28px}
.statsbar-inner{max-width:1200px;margin:auto;display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px}
.stat{text-align:center;padding:4px 16px;position:relative}
.stat:not(:last-child)::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);height:32px;width:1px;background:rgba(255,255,255,.1)}
.stat-num{font-family:'Playfair Display',serif;font-size:28px;font-weight:800;color:#F9C96E;line-height:1;animation:countUp .6s ease both}
.stat-label{font-size:12px;color:rgba(255,255,255,.5);margin-top:5px;text-transform:uppercase;letter-spacing:1px}

/* ── SECTIONS ─────────────────────────────────────────────── */
.section{padding:80px 28px}
.section-alt{background:var(--warm)}
.section-dark{background:var(--navy)}
.container{max-width:1200px;margin:auto}
.section-header{text-align:center;margin-bottom:52px}
.eyebrow{display:inline-block;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:var(--brand);margin-bottom:12px}
.section-title{font-family:'Playfair Display',serif;font-size:clamp(26px,4vw,42px);font-weight:800;color:var(--navy);line-height:1.15;margin-bottom:14px}
.section-title span{color:var(--brand);font-style:italic}
.section-desc{font-size:16px;color:var(--muted);max-width:580px;margin:0 auto;line-height:1.8}

/* ── ABOUT BLOCK ──────────────────────────────────────────── */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.about-images{position:relative;padding-bottom:32px;padding-right:24px}
.about-img-main{width:100%;height:420px;object-fit:cover;border-radius:var(--radius)}
.about-img-secondary{position:absolute;bottom:0;right:0;width:190px;height:150px;object-fit:cover;border-radius:12px;border:5px solid #fff;box-shadow:var(--shadow-lg)}
.about-stamp{position:absolute;top:20px;left:20px;background:var(--brand);color:#fff;padding:14px 18px;border-radius:14px;text-align:center;box-shadow:0 6px 20px var(--brand-glow)}
.about-stamp-num{font-family:'Playfair Display',serif;font-size:24px;font-weight:800;line-height:1}
.about-stamp-text{font-size:11px;line-height:1.35;margin-top:4px;opacity:.9}
.about-content{max-width:520px}
.about-title{font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,36px);font-weight:700;color:var(--navy);margin:12px 0 18px;line-height:1.25}
.about-text{font-size:15px;line-height:1.8;color:var(--muted);margin-bottom:26px}
.about-feats{display:flex;flex-direction:column;gap:13px;margin-bottom:30px}
.about-feat{display:flex;align-items:center;gap:11px}
.feat-dot{width:8px;height:8px;border-radius:50%;background:var(--brand);flex-shrink:0}
.feat-text{font-size:14px;font-weight:500;color:#444}

/* ── SERVICES ICONS ───────────────────────────────────────── */
.svc-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:18px}
.svc-card{width:125px;text-align:center;padding:24px 14px;border-radius:16px;background:#fff;box-shadow:var(--shadow);transition:all .25s;cursor:pointer;border:2px solid transparent}
.svc-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-md);border-color:var(--brand);background:var(--brand-light)}
.svc-card:hover .svc-emoji{animation:float .6s ease}
.svc-emoji{font-size:40px;margin-bottom:11px;display:block}
.svc-name{font-size:13px;font-weight:600;color:#333}

/* ── EXPERIENCE BOARD ─────────────────────────────────────── */
.exp-board{display:grid;grid-template-columns:1fr 390px;gap:22px;align-items:start}
.exp-featured{position:relative;border-radius:var(--radius);overflow:hidden;height:510px}
.exp-featured>img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.exp-featured:hover>img{transform:scale(1.04)}
.exp-featured-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,.88) 0%,rgba(10,22,40,.12) 55%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:30px;color:#fff}
.exp-tag{display:inline-block;background:var(--brand);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 13px;border-radius:20px;margin-bottom:12px;width:fit-content}
.exp-featured-overlay h3{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin-bottom:10px;line-height:1.2}
.exp-featured-overlay p{font-size:14px;opacity:.82;line-height:1.65;margin-bottom:18px}
.exp-meta{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:20px;font-size:13px;opacity:.9}
.exp-meta strong{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;opacity:1}

.exp-list{display:flex;flex-direction:column;gap:7px;max-height:510px;overflow-y:auto;padding-right:3px;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.exp-list::-webkit-scrollbar{width:4px}
.exp-list::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.exp-row{display:flex;align-items:center;gap:11px;padding:11px 13px;border:1.5px solid var(--border);border-radius:11px;background:#fff;cursor:pointer;text-align:left;transition:all .2s;width:100%}
.exp-row img{width:52px;height:42px;border-radius:8px;object-fit:cover;flex-shrink:0}
.exp-row-info{flex:1;display:flex;flex-direction:column;gap:2px;overflow:hidden}
.exp-row-info em{font-size:9.5px;color:var(--brand);font-style:normal;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.exp-row-info strong{font-size:13px;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.exp-row-info small{font-size:11px;color:var(--muted)}
.exp-row b{font-size:13px;font-weight:700;color:var(--brand-deep);white-space:nowrap}
.exp-row.active,.exp-row:hover{border-color:var(--brand);background:var(--brand-light);transform:translateX(4px)}

/* ── DESTINATIONS GRID ────────────────────────────────────── */
.dest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.dest-card{position:relative;border-radius:var(--radius);overflow:hidden;height:200px;cursor:pointer}
.dest-card img{width:100%;height:100%;object-fit:cover;transition:transform .45s ease}
.dest-card:hover img{transform:scale(1.09)}
.dest-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,.72) 0%,transparent 55%);transition:opacity .3s}
.dest-card:hover .dest-overlay{background:linear-gradient(to top,rgba(10,22,40,.82) 0%,rgba(10,22,40,.2) 60%,transparent 100%)}
.dest-name{position:absolute;bottom:16px;left:16px;color:#fff;font-family:'Playfair Display',serif;font-size:19px;font-weight:700;text-shadow:0 1px 8px rgba(0,0,0,.4)}
.dest-arrow{position:absolute;bottom:16px;right:16px;color:#fff;font-size:18px;opacity:0;transform:translateX(-8px);transition:all .3s}
.dest-card:hover .dest-arrow{opacity:1;transform:translateX(0)}

/* ── TIMELINE ─────────────────────────────────────────────── */
.timeline{max-width:700px;margin:0 auto}
.tl-item{display:flex;gap:22px;padding:22px 0 22px 30px;border-left:2px solid var(--brand);position:relative}
.tl-item::before{content:'';position:absolute;left:-8px;top:28px;width:14px;height:14px;border-radius:50%;background:var(--brand);box-shadow:0 0 0 3px rgba(242,103,37,.2)}
.tl-day{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--brand);white-space:nowrap;min-width:52px;margin-top:2px}
.tl-text{font-size:15px;color:#444;line-height:1.7}

/* ── WHY US ───────────────────────────────────────────────── */
.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.why-feats{display:flex;flex-direction:column;gap:26px}
.why-item{display:flex;gap:18px;align-items:flex-start;padding:18px;border-radius:var(--radius);transition:background .2s,box-shadow .2s}
.why-item:hover{background:#fff;box-shadow:var(--shadow)}
.why-icon-wrap{width:50px;height:50px;background:var(--brand-light);border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:23px;flex-shrink:0;transition:transform .25s}
.why-item:hover .why-icon-wrap{transform:scale(1.1);background:var(--brand);filter:saturate(1.2)}
.why-text h4{font-size:16px;font-weight:700;color:var(--navy);margin-bottom:5px}
.why-text p{font-size:14px;color:var(--muted);line-height:1.65}
.why-visual{position:relative}
.why-visual img{width:100%;height:440px;object-fit:cover;border-radius:var(--radius);display:block}
.why-card{position:absolute;bottom:24px;left:20px;right:20px;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);border-radius:14px;padding:20px 22px;box-shadow:var(--shadow-lg)}
.why-card-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--brand);margin-bottom:7px}
.why-stars{color:var(--brand);font-size:16px;margin-bottom:7px;letter-spacing:2px}
.why-review{font-size:13.5px;color:#444;line-height:1.65;font-style:italic;margin-bottom:7px}
.why-author{font-size:12px;color:var(--muted)}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.chip{background:var(--brand-light);color:var(--brand-deep);padding:7px 17px;border-radius:999px;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;border:1px solid transparent}
.chip:hover{background:var(--brand);color:#fff;border-color:var(--brand);transform:translateY(-2px)}

/* ── TESTIMONIALS ─────────────────────────────────────────── */
.testi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px}
.testi-card{background:#fff;border-radius:var(--radius);padding:30px 26px;box-shadow:var(--shadow);position:relative;transition:all .28s;border-bottom:3px solid transparent}
.testi-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-md);border-bottom-color:var(--brand)}
.testi-quote{font-family:'Playfair Display',serif;font-size:72px;color:#F9C96E;position:absolute;top:-4px;left:22px;line-height:1;opacity:.7;pointer-events:none}
.testi-stars{color:var(--brand);font-size:15px;margin-bottom:14px;padding-top:32px;letter-spacing:3px}
.testi-text{font-size:14.5px;color:var(--muted);line-height:1.75;margin-bottom:20px;font-style:italic}
.testi-foot{display:flex;align-items:center;gap:13px;border-top:1px solid #f0e8df;padding-top:16px}
.testi-av{width:38px;height:38px;border-radius:50%;background:var(--navy);color:#F9C96E;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.testi-name{font-size:14px;font-weight:700;color:var(--navy)}
.testi-from{font-size:12px;color:var(--light)}

/* ── CTA BAND ─────────────────────────────────────────────── */
.cta-band{background:linear-gradient(120deg,var(--brand-deep) 0%,var(--brand) 60%,#ff9e50 100%);padding:60px 28px;position:relative;overflow:hidden}
.cta-band::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.cta-inner{max-width:1200px;margin:auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:28px;position:relative}
.cta-title{font-family:'Playfair Display',serif;font-size:clamp(22px,3.5vw,34px);font-weight:800;color:#fff;margin-bottom:9px;line-height:1.2}
.cta-desc{font-size:16px;color:rgba(255,255,255,.85);line-height:1.7;max-width:480px}
.cta-actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.cta-phone{color:#fff;font-size:20px;font-weight:700;transition:opacity .2s;display:flex;align-items:center;gap:8px}
.cta-phone:hover{opacity:.8}

/* ── FOOTER ───────────────────────────────────────────────── */
.footer{background:var(--navy);color:rgba(255,255,255,.55);padding-top:0;position:relative;overflow:hidden}
.footer::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--brand),#ff9e50,var(--brand));background-size:200% 100%;animation:borderRun 4s linear infinite}
.footer-top{padding:64px 28px 48px}
.footer-grid{max-width:1200px;margin:auto;display:grid;grid-template-columns:2.2fr 1fr 1fr 1.2fr;gap:44px}
.footer-brand{max-width:300px}
.footer-logo{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.footer-logo-icon{width:42px;height:42px;background:linear-gradient(135deg,var(--brand),#ff9f57);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px}
.footer-logo-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#fff;line-height:1.2}
.footer-logo-sub{font-size:10px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1px}
.footer-about{font-size:13.5px;line-height:1.8;color:rgba(255,255,255,.42);margin-bottom:22px}
.footer-socials{display:flex;gap:9px}
.footer-social{width:36px;height:36px;border-radius:9px;border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.45);font-size:13px;font-weight:700;transition:all .22s;text-decoration:none}
.footer-social:hover{background:var(--brand);border-color:var(--brand);color:#fff;transform:translateY(-2px)}
.footer-col-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2.2px;color:#F9C96E;margin-bottom:18px;display:flex;align-items:center;gap:8px}
.footer-col-title::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07)}
.footer-links{display:flex;flex-direction:column;gap:10px}
.footer-links a{color:rgba(255,255,255,.42);font-size:13.5px;transition:all .2s;display:flex;align-items:center;gap:6px}
.footer-links a::before{content:'›';color:var(--brand);opacity:0;transform:translateX(-6px);transition:all .2s;font-size:16px}
.footer-links a:hover{color:rgba(255,255,255,.85);padding-left:6px}
.footer-links a:hover::before{opacity:1;transform:translateX(0)}
.footer-contact-item{display:flex;gap:12px;margin-bottom:13px;align-items:flex-start}
.fci-icon{font-size:15px;margin-top:1px;flex-shrink:0}
.fci-text{color:rgba(255,255,255,.42);font-size:13.5px;line-height:1.55}
.fci-text a{color:rgba(255,255,255,.42);transition:color .2s}
.fci-text a:hover{color:#F9C96E}
.footer-badge-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
.footer-badge{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:600;color:rgba(255,255,255,.5);display:flex;align-items:center;gap:6px}

.footer-mid{background:rgba(0,0,0,.18);padding:24px 28px;border-top:1px solid rgba(255,255,255,.06)}
.footer-mid-inner{max-width:1200px;margin:auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px}
.footer-newsletter{display:flex;gap:0;border-radius:9px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.2)}
.footer-newsletter input{padding:10px 16px;border:none;background:rgba(255,255,255,.09);color:#fff;font-size:14px;outline:none;min-width:220px}
.footer-newsletter input::placeholder{color:rgba(255,255,255,.3)}
.footer-newsletter button{padding:10px 20px;background:var(--brand);color:#fff;border:none;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;white-space:nowrap}
.footer-newsletter button:hover{background:var(--brand-deep)}

.footer-bottom{background:rgba(0,0,0,.28);padding:16px 28px}
.footer-bottom-inner{max-width:1200px;margin:auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;font-size:12px;color:rgba(255,255,255,.28)}
.footer-bottom a{color:rgba(255,255,255,.28);transition:color .2s;margin-left:16px}
.footer-bottom a:hover{color:rgba(255,255,255,.65)}

/* ── WHATSAPP FLOAT ───────────────────────────────────────── */
.wa-float{position:fixed;bottom:30px;right:30px;z-index:999;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
.wa-btn{width:58px;height:58px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(37,211,102,.45);animation:pulse 2s infinite;transition:transform .22s}
.wa-btn:hover{transform:scale(1.12);animation:none}
.wa-btn svg{width:30px;height:30px}
.wa-label{background:var(--navy);color:#fff;font-size:12px;font-weight:600;padding:6px 13px;border-radius:20px;opacity:0;transform:translateY(4px);transition:all .2s;white-space:nowrap;pointer-events:none}
.wa-float:hover .wa-label{opacity:1;transform:translateY(0)}

/* ── MODAL ────────────────────────────────────────────────── */
.modal-bg{position:fixed;inset:0;background:rgba(10,22,40,.6);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:500;padding:20px;animation:scaleIn .2s ease}
.modal{background:#fff;border-radius:20px;padding:36px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 28px 80px rgba(0,0,0,.28)}
.modal-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px}
.modal-header h3{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);line-height:1.25}
.modal-close{width:34px;height:34px;border-radius:50%;background:#f5f5f5;border:none;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
.modal-close:hover{background:#ebebeb}

/* ── FORM ─────────────────────────────────────────────────── */
.fgrid{display:flex;flex-direction:column;gap:16px}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.flabel{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#333}
.finput{padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:var(--radius-sm);font-size:14px;background:#fafafa;transition:border .2s,box-shadow .2s;outline:none}
.finput:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(242,103,37,.12);background:#fff}
textarea.finput{resize:vertical;min-height:88px}
.form-status-ok{padding:11px 14px;background:#e8f5e9;color:#2e7d32;border-radius:var(--radius-sm);font-size:13px;text-align:center}
.form-note{font-size:11.5px;color:var(--light);text-align:center;margin-top:3px;line-height:1.5}

/* ── CONTACT PAGE ─────────────────────────────────────────── */
.contact-hero{position:relative;min-height:55vh;display:flex;align-items:flex-end;background:url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80') center/cover no-repeat}
.contact-hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.78),rgba(242,103,37,.4))}
.contact-hero-content{position:relative;z-index:2;padding:56px 64px;color:#fff;max-width:760px}
.contact-hero-content h1{font-family:'Playfair Display',serif;font-size:clamp(30px,4.5vw,52px);font-weight:800;margin:12px 0 16px;line-height:1.12}
.contact-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:52px;align-items:start}
.contact-info h2{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--navy);margin-bottom:12px}
.contact-intro{font-size:15px;color:var(--muted);line-height:1.75;margin-bottom:28px}
.ci-item{display:flex;gap:15px;padding:14px 16px;background:#fff;border-radius:13px;box-shadow:var(--shadow);margin-bottom:12px;transition:all .22s}
.ci-item:hover{transform:translateX(5px);box-shadow:0 6px 24px rgba(242,103,37,.13)}
.ci-icon{font-size:22px;flex-shrink:0}
.ci-title{font-size:14px;font-weight:700;color:var(--brand);margin-bottom:3px}
.ci-text{font-size:13px;color:var(--muted);line-height:1.5}
.ci-text a{color:var(--brand);transition:opacity .2s}
.ci-text a:hover{opacity:.75}
.soc-row{margin-top:22px}
.soc-row h4{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:12px}
.soc-icons{display:flex;gap:10px}
.soc-icon{width:40px;height:40px;border-radius:50%;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;transition:all .2s;text-decoration:none}
.soc-icon:hover{transform:scale(1.12);background:var(--brand-deep)}
.form-card{background:#fff;padding:34px;border-radius:18px;box-shadow:var(--shadow-md)}
.form-card h2{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--navy);margin-bottom:24px}
.map-wrap{border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.map-wrap iframe{display:block}

/* ── ABOUT PAGE ───────────────────────────────────────────── */
.about-page-hero{position:relative;height:58vh;min-height:400px;overflow:hidden}
.about-page-hero img{width:100%;height:100%;object-fit:cover}
.about-hero-overlay{position:absolute;inset:0;background:linear-gradient(140deg,rgba(10,22,40,.82),rgba(242,103,37,.35))}
.about-hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:52px 64px;color:#fff;max-width:800px}
.about-hero-content h1{font-family:'Playfair Display',serif;font-size:clamp(28px,4.5vw,54px);font-weight:800;margin:12px 0 16px;line-height:1.1}
.about-hero-content p{font-size:17px;opacity:.87;line-height:1.75;max-width:580px}
.about-intro-grid{display:grid;grid-template-columns:1fr 300px;gap:52px;align-items:start}
.about-intro-copy h2{font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,34px);font-weight:700;color:var(--navy);margin:12px 0 18px}
.about-intro-copy p{font-size:15px;color:var(--muted);line-height:1.8}
.about-panel{background:var(--navy);border-radius:var(--radius);padding:30px 26px;color:#fff}
.about-panel h3{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#F9C96E;margin-bottom:12px}
.about-panel strong{font-family:'Playfair Display',serif;font-size:24px;display:block;margin-bottom:12px}
.about-panel p{font-size:14px;color:rgba(255,255,255,.62);line-height:1.65}
.about-svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.about-svc-card{background:#fff;border-radius:var(--radius);padding:28px 24px;box-shadow:var(--shadow);border-top:3px solid var(--brand);transition:transform .22s,box-shadow .22s}
.about-svc-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-md)}
.about-svc-num{font-size:12px;font-weight:700;color:var(--brand);text-transform:uppercase;letter-spacing:1px}
.about-svc-card h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);margin:10px 0 12px}
.about-svc-card p{font-size:14px;color:var(--muted);line-height:1.65}
.about-svc-card a{color:var(--brand)}
.about-vision-head h2{font-family:'Playfair Display',serif;font-size:clamp(22px,3.5vw,36px);font-weight:700;color:var(--navy);margin:12px 0 18px}
.about-vision-head p{font-size:15px;color:var(--muted);line-height:1.8;max-width:660px}
.about-values{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:42px}
.about-val{background:#fff;border-radius:var(--radius);padding:26px 22px;box-shadow:var(--shadow)}
.about-val h3{font-family:'Playfair Display',serif;font-size:19px;color:var(--navy);margin-bottom:10px}
.about-val p{font-size:14px;color:var(--muted);line-height:1.65}
.about-hlights{display:flex;flex-wrap:wrap;gap:13px;justify-content:center}
.about-hl{background:var(--navy);color:#F9C96E;padding:11px 22px;border-radius:999px;font-size:14px;font-weight:500;transition:transform .2s}
.about-hl:hover{transform:translateY(-2px)}

/* ── DEST PAGE ────────────────────────────────────────────── */
.dest-hero-page{position:relative;height:58vh;min-height:380px;overflow:hidden}
.dest-hero-page img{width:100%;height:100%;object-fit:cover}
.dest-hero-overlay{position:absolute;inset:0;background:linear-gradient(140deg,rgba(10,22,40,.8),rgba(242,103,37,.3))}
.dest-hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:52px 64px;color:#fff;max-width:820px}
.dest-hero-content h1{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,58px);font-weight:800;margin:10px 0 16px;line-height:1.08}
.dest-hero-content p{font-size:17px;opacity:.87;line-height:1.75;max-width:580px}
.tours-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:22px}
.tour-card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:all .25s}
.tour-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.tour-card-img{width:100%;height:190px;object-fit:cover;display:block;transition:transform .4s}
.tour-card:hover .tour-card-img{transform:scale(1.05)}
.tour-card-body{padding:18px 20px 22px}
.tour-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--brand);margin-bottom:8px}
.tour-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--navy);margin-bottom:8px}
.tour-meta{font-size:13px;color:var(--muted);margin-bottom:16px}
.tour-footer{display:flex;justify-content:space-between;align-items:center}
.tour-from{font-size:11px;color:var(--light);text-transform:uppercase;letter-spacing:1px}
.tour-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:var(--navy)}

/* ── EXPERT CARDS ─────────────────────────────────────────── */
.experts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.expert-card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:all .28s}
.expert-card:hover{transform:translateY(-8px);box-shadow:var(--shadow-lg)}
.expert-img-wrap{position:relative}
.expert-img{width:100%;height:260px;object-fit:cover;object-position:top;display:block;transition:transform .4s}
.expert-card:hover .expert-img{transform:scale(1.04)}
.expert-badge-pill{position:absolute;bottom:14px;left:14px;background:var(--brand);color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:5px 13px;border-radius:20px}
.expert-body{padding:22px 24px}
.expert-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);margin-bottom:5px}
.expert-role{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--brand);margin-bottom:12px}
.expert-desc{font-size:14px;color:var(--muted);line-height:1.75}

/* ── VISA CONSULTATION PAGE ───────────────────────────────── */
.visa-hero{position:relative;min-height:60vh;display:flex;align-items:flex-end;background:url('https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1600&q=80') center/cover no-repeat}
.visa-hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.88),rgba(242,103,37,.35))}
.visa-hero-content{position:relative;z-index:2;padding:60px 64px;color:#fff;max-width:800px}
.visa-hero-content h1{font-family:'Playfair Display',serif;font-size:clamp(28px,4.5vw,52px);font-weight:800;margin:12px 0 16px;line-height:1.12}
.visa-types-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px}
.visa-type-card{background:#fff;border-radius:var(--radius);padding:28px 26px;box-shadow:var(--shadow);transition:all .25s;border-top:4px solid var(--brand);position:relative;overflow:hidden}
.visa-type-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--brand),#ff9e50);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.visa-type-card:hover::after{transform:scaleX(1)}
.visa-type-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-md)}
.visa-type-icon{font-size:36px;margin-bottom:14px}
.visa-type-name{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:var(--navy);margin-bottom:8px}
.visa-type-duration{font-size:12px;font-weight:700;color:var(--brand);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
.visa-type-desc{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:16px}
.visa-type-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:var(--navy)}
.visa-type-note{font-size:11px;color:var(--light);margin-top:4px}
.charges-table{width:100%;border-collapse:collapse;background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.charges-table th{background:var(--navy);color:#F9C96E;padding:14px 18px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
.charges-table td{padding:13px 18px;border-bottom:1px solid var(--border);font-size:14px;color:#333}
.charges-table tr:last-child td{border-bottom:none}
.charges-table tr:hover td{background:var(--brand-light)}
.charges-table .price-cell{font-weight:700;color:var(--brand-deep);font-family:'Playfair Display',serif;font-size:16px}
.visa-docs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.visa-doc-item{background:#fff;border-radius:11px;padding:16px 18px;box-shadow:var(--shadow);display:flex;align-items:center;gap:13px;transition:all .2s}
.visa-doc-item:hover{transform:translateX(5px);border-left:3px solid var(--brand)}
.visa-doc-icon{font-size:24px;flex-shrink:0}
.visa-doc-text{font-size:14px;font-weight:500;color:var(--navy)}
.visa-process-steps{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:18px}
.visa-step{background:#fff;border-radius:var(--radius);padding:24px 20px;box-shadow:var(--shadow);text-align:center;transition:all .25s}
.visa-step:hover{transform:translateY(-5px);box-shadow:var(--shadow-md)}
.visa-step-num{width:48px;height:48px;background:var(--brand);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:20px;font-weight:800;margin:0 auto 14px}
.visa-step-title{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:8px}
.visa-step-desc{font-size:13px;color:var(--muted);line-height:1.65}
.visa-enquire-banner{background:linear-gradient(120deg,var(--navy) 0%,var(--navy-mid) 100%);border-radius:var(--radius);padding:36px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:22px}
.visa-enquire-banner h3{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;color:#fff;margin-bottom:8px}
.visa-enquire-banner p{color:rgba(255,255,255,.7);font-size:15px;max-width:480px}
.btn-wa{background:#25D366;color:#fff;font-weight:700;border-radius:999px;padding:13px 28px;font-size:15px;display:inline-flex;align-items:center;gap:9px;cursor:pointer;transition:all .22s;border:none}
.btn-wa:hover{background:#1da851;transform:translateY(-2px);box-shadow:0 6px 20px rgba(37,211,102,.4)}
.disclaimer-note{background:var(--brand-light);border-left:4px solid var(--brand);border-radius:0 9px 9px 0;padding:14px 18px;font-size:13px;color:var(--brand-deep);line-height:1.65}

/* ── RESPONSIVE ───────────────────────────────────────────── */
@media(max-width:1100px){
  .exp-board{grid-template-columns:1fr}
  .exp-list{max-height:260px;flex-direction:row;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden}
  .exp-row{flex-shrink:0;width:240px}
  .exp-featured{height:380px}
  .why-grid{grid-template-columns:1fr;gap:36px}
  .about-grid{grid-template-columns:1fr;gap:36px}
  .about-img-secondary{display:none}
  .about-intro-grid{grid-template-columns:1fr}
  .about-svc-grid{grid-template-columns:1fr 1fr}
  .about-values{grid-template-columns:1fr 1fr}
  .contact-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr;gap:32px}
  .experts-grid{grid-template-columns:1fr 1fr}
  .visa-enquire-banner{flex-direction:column}
}
@media(max-width:768px){
  .nav{display:none}
  .hamburger{display:flex}
  .hero-content{padding:0 28px;max-width:100%}
  .hero-title{font-size:34px}
  .hero-dots{left:28px}
  .hero-scroll{display:none}
  .searchbar{flex-direction:column}
  .sf{width:100%}
  .statsbar-inner{justify-content:center}
  .stat:not(:last-child)::after{display:none}
  .section{padding:56px 20px}
  .cta-inner{flex-direction:column;text-align:center}
  .cta-actions{justify-content:center}
  .about-svc-grid{grid-template-columns:1fr}
  .about-values{grid-template-columns:1fr}
  .contact-hero-content{padding:36px 24px}
  .about-hero-content{padding:36px 24px}
  .dest-hero-content{padding:36px 24px}
  .footer-grid{grid-template-columns:1fr}
  .footer-mid-inner{flex-direction:column;align-items:flex-start}
  .footer-newsletter{width:100%}
  .footer-newsletter input{flex:1}
  .footer-bottom-inner{flex-direction:column;text-align:center}
  .frow{grid-template-columns:1fr}
  .experts-grid{grid-template-columns:1fr}
   .visa-hero-content{padding:36px 24px}
}

/* ═══════════════════════════════════════════════════════════════
   DARK MODE
   ═══════════════════════════════════════════════════════════════ */
html.dark{--brand:#F26725;--brand-deep:#8f3d05;--brand-glow:rgba(242,103,37,.35);--brand-light:#2a1f15;--navy:#E8ECF0;--navy-mid:#d1d8e0;--navy-soft:#b8c3d0;--navy-deep:#0A1628;--warm:#1a2332;--warm-alt:#243447;--muted:#aaa;--border:#2a3a4a;--bg:#0d1520;--card:#132035;--surface:#1a2a3f}
html.dark body{background:var(--bg);color:var(--navy)}
html.dark .header{background:var(--navy-deep)}
html.dark .header.scrolled{background:rgba(10,22,40,.98)}
html.dark .nav-item{color:#ccc}
html.dark .nav-item:hover,html.dark .nav-item-wrap:hover .nav-item{color:var(--brand);background:var(--brand-light)}
html.dark .dropdown{background:var(--card);border-color:var(--border)}
html.dark .dropdown a{color:var(--navy-mid)}
html.dark .dropdown a:hover{background:var(--brand-light);color:var(--brand)}
html.dark .theme-toggle{color:var(--navy);border-color:var(--border)}
html.dark .theme-toggle:hover{background:var(--brand-light);border-color:var(--brand)}
html.dark .hamburger span{background:var(--navy)}
html.dark .mobile-menu,.mobile-menu a{background:var(--navy-deep);color:var(--navy)}
html.dark .mobile-menu a:hover{background:var(--brand-light);color:var(--brand)}
html.dark .mob-section{color:var(--muted)}
html.dark .hero-slide::after{background:linear-gradient(to top,rgba(13,21,32,.85),rgba(13,21,32,.35),transparent)}
html.dark .section-title{color:var(--navy)}
html.dark .section-desc{color:var(--muted)}
html.dark .card,.exp-card,.why-card,.testi-card,.visa-card,.price-card,.highlight-card{background:var(--card);border-color:var(--border)}
html.dark .card h3,.exp-card h3,.why-card h4,.testi-card h4,.visa-card h3{color:var(--navy)}
html.dark .card p,.why-card p,.testi-text,.visa-card p{color:var(--muted)}
html.dark .footer{background:var(--navy-deep)}
html.dark .footer-about,.footer-bottom{color:rgba(255,255,255,.42)}
html.dark .footer-social{color:rgba(255,255,255,.45);border-color:rgba(255,255,255,.12)}
html.dark .form-card,.contact-info,.contact-form{background:var(--card);border-color:var(--border)}
html.dark .finput{background:var(--bg);border-color:var(--border);color:var(--navy)}
html.dark .finput:focus{border-color:var(--brand)}
html.dark .topbar{background:var(--navy-deep)}
html.dark .wa-label{background:var(--navy-deep)}
}
`;

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const WHATSAPP = "971313342532";

const HERO_SLIDES = [
  { img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80", badge:"Award Winning Consultancy", title:<>Discover <span>Gulf</span> & Beyond</>, desc:"Expert travel consulting for UAE, Qatar, Saudi Arabia and all Gulf adventures, holiday packages, and visa services." },
  { img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600&q=80", badge:"Desert Experiences", title:<>Arabian <span>Desert</span> Safaris</>, desc:"Golden dunes, camel rides, and starlit camps — let us craft the perfect desert escape just for you." },
  { img:"https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1600&q=80", badge:"Luxury Yachts & Cruises", title:<>Sail the <span>Arabian</span> Gulf</>, desc:"Private yacht rentals, dhow cruises, and dinner cruises with spectacular Gulf skylines as your backdrop." },
];

const EXPERIENCES = [
  { title:"Premium Desert Safari", tag:"Bestseller", location:"Lahbab Desert", duration:"6 hrs", price:"AED 149", img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=75", summary:"Dune bashing, camel ride, live BBQ dinner, fire show, tanoura dance and hotel transfers included." },
  { title:"Burj Khalifa At The Top", tag:"Icon", location:"Downtown Dubai", duration:"2 hrs", price:"AED 179", img:"https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=75", summary:"Timed entry support, Dubai Mall pickup options and fountain-view add-ons." },
  { title:"Palm Jumeirah & Atlantis", tag:"Photo Route", location:"Palm Jumeirah", duration:"4 hrs", price:"AED 169", img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&q=75", summary:"Palm viewpoints, Atlantis, The Pointe, Bluewaters and premium hotel pickup." },
  { title:"Dubai Luxury Superyacht", tag:"Luxury", location:"Dubai Marina", duration:"2–4 hrs", price:"AED 899", img:"https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=75", summary:"Shared or private superyacht sailing with Burj Al Arab, Palm and Atlantis views." },
  { title:"Dubai Aladdin Tour", tag:"Heritage", location:"Al Fahidi + Deira", duration:"4 hrs", price:"AED 129", img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&q=75", summary:"Souks, Creek abra ride, Old Dubai lanes, storytelling and local tastings." },
  { title:"Museum of the Future", tag:"Future", location:"Sheikh Zayed Road", duration:"2 hrs", price:"AED 159", img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=75", summary:"Ticket planning for Dubai's iconic museum with transfers included." },
  { title:"Dubai Frame", tag:"Landmark", location:"Zabeel Park", duration:"90 min", price:"AED 69", img:"https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=75", summary:"Old-and-new Dubai viewpoint with optional city tour pairing." },
  { title:"Aquaventure Waterpark", tag:"Family Fun", location:"Atlantis The Palm", duration:"Full day", price:"AED 349", img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&q=75", summary:"Waterpark tickets with private transfers and comprehensive family support." },
  { title:"Marina Dhow Cruise Dinner", tag:"Dinner", location:"Dubai Marina", duration:"2 hrs", price:"AED 189", img:"https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=75", summary:"Evening dhow cruise with live buffet dinner, tanoura show and marina views." },
  { title:"Hot Air Balloon Dubai", tag:"Adventure", location:"Dubai Desert", duration:"4 hrs", price:"AED 799", img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=75", summary:"Sunrise balloon flight over the desert with falcon show and gourmet breakfast." },
];

const DESTINATIONS = [
  { name:"Dubai",     img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=75", path:"/dubai" },
  { name:"Abu Dhabi", img:"https://images.unsplash.com/photo-1610199423203-71c7b0f45e1b?w=500&q=80", path:"/abu-dhabi" },
  { name:"Doha",      img:"https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=500&q=80", path:"/doha" },
  { name:"Riyadh",    img:"https://images.unsplash.com/photo-1567438954810-5dc60acd2f5f?w=500&q=80", path:"/riyadh" },
  { name:"Muscat",    img:"https://images.unsplash.com/photo-1590056406796-ef7e5a751a4c?w=500&q=80", path:"/muscat" },
  { name:"Kuwait",    img:"https://images.unsplash.com/photo-1610082378986-18e95d7b2096?w=500&q=80", path:"/kuwait" },
  { name:"Bahrain",   img:"https://images.unsplash.com/photo-1609813768225-4d21d513d26d?w=500&q=80", path:"/bahrain" },
];

const SERVICES = [
  {emoji:"🏜️",name:"Desert Safari"},{emoji:"⛵",name:"Yacht Rental"},
  {emoji:"🚁",name:"Helicopter Tour"},{emoji:"🛳️",name:"Dhow Cruise"},
  {emoji:"🎈",name:"Hot Air Balloon"},{emoji:"🏙️",name:"City Tours"},
  {emoji:"🏖️",name:"Beach Picnic"},{emoji:"🛂",name:"UAE Visa"},
];

const WHY_ITEMS = [
  {icon:"🌍",title:"Local Expertise",desc:"Based in Dubai with deep, first-hand knowledge of every Gulf destination and activity."},
  {icon:"💰",title:"Best Price Guarantee",desc:"Competitive, transparent pricing — no hidden costs, no surprises when you travel."},
  {icon:"🛡️",title:"Trusted & Licensed",desc:"Fully licensed tour operator with 5+ years of excellence and 15,000+ happy travellers."},
  {icon:"📞",title:"24/7 WhatsApp Support",desc:"Round-the-clock support from booking to travel day — always just a message away."},
];

const TESTIMONIALS = [
  {stars:"★★★★★",text:"Desert safari pickup was on time and the team explained every option clearly before we paid. Absolutely amazing experience!",name:"Aarav Sharma",initials:"AS",from:"Mumbai, India"},
  {stars:"★★★★★",text:"They planned Burj Khalifa, Dubai Frame and Old Dubai in one relaxed day. Highly recommend for families — so easy!",name:"Priya Nair",initials:"PN",from:"Kochi, India"},
  {stars:"★★★★★",text:"The yacht booking was smooth, no last minute confusion, and WhatsApp support was instant. Will book again.",name:"Rohan Mehta",initials:"RM",from:"Delhi, India"},
];

const ITINERARY = [
  ["Day 1","Arrival & private airport transfer, Burj Khalifa sunset viewing, Dubai Fountain show at night"],
  ["Day 2","Morning desert safari, camel ride, sandboarding, BBQ camp dinner & live shows"],
  ["Day 3","Old Dubai souks, Creek abra crossing, Dubai Frame, Marina Dhow Cruise dinner"],
  ["Day 4","Abu Dhabi day trip OR Palm Jumeirah beach day + optional Aquaventure Waterpark"],
];

const CHIPS = ["Visa Help","Airport Transfers","Hotel Booking","Private Guides","Group Tours","Honeymoon Plans","Family Plans"];

const BUDGET_OPTS = ["Flexible","Under AED 500","AED 500–1,500","AED 1,500–5,000","Luxury / Private"];
const BUDGET_RANGES = ["Under AED 500","AED 500–1,000","AED 1,000–2,000","AED 2,000–5,000","Above AED 5,000","Flexible"];
const CONTACT_SVCS = ["Desert Safari","Yacht Rental","City Tours","Burj Khalifa","Dubai Frame","Museum of the Future","Dhow Cruise","Aquaventure","Hot Air Balloon","Helicopter Tour","Family Trip","Honeymoon Package","Custom Quote"];

const INIT_LEAD = {name:"",phone:"",email:"",dateFrom:"",dateTo:"",guests:"2 Persons",packageName:"Custom Quote",budget:"Flexible",message:""};

const ABOUT_VALS = [
  ["Clarity","Simple advice before booking, clear inclusions, and zero confusing travel jargon."],
  ["Care","Trips are planned around families, first-time visitors, business travellers, and groups."],
  ["Local Reach","Dubai tours, UAE visa guidance, airport transfers, hotels, and attraction access in one place."],
];
const ABOUT_HLS = ["UAE visa consultancy and document guidance","Dubai tours, safaris, yachts and landmark experiences","Custom itineraries for families, couples and corporate groups","Fast WhatsApp support from enquiry to travel day"];

const DESTS_DATA = {
  dubai:{name:"Dubai",country:"United Arab Emirates",flag:"🇦🇪",img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80",desc:"The city of gold — a breathtaking blend of futuristic skylines, golden desert dunes, luxury yachts, and authentic Arabian heritage.",tours:[{name:"Premium Desert Safari",tag:"Bestseller",location:"Lahbab Desert",duration:"6 hrs",price:"AED 149",img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=75"},{name:"Burj Khalifa At The Top",tag:"Icon",location:"Downtown",duration:"2 hrs",price:"AED 179",img:"https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500&q=75"},{name:"Luxury Superyacht",tag:"Luxury",location:"Dubai Marina",duration:"2–4 hrs",price:"AED 899",img:"https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=500&q=75"}]},
  "abu-dhabi":{name:"Abu Dhabi",country:"United Arab Emirates",flag:"🇦🇪",img:"https://images.unsplash.com/photo-1610199423203-71c7b0f45e1b?w=1400&q=80",desc:"The UAE capital — home to the majestic Sheikh Zayed Grand Mosque, Yas Island's thrills, and rich cultural heritage.",tours:[{name:"Grand Mosque Tour",tag:"Heritage",location:"Abu Dhabi",duration:"3 hrs",price:"AED 99",img:"https://images.unsplash.com/photo-1610199423203-71c7b0f45e1b?w=500&q=75"},{name:"Yas Island Day",tag:"Thrill",location:"Yas Island",duration:"Full day",price:"AED 399",img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=75"},{name:"Abu Dhabi City Tour",tag:"Sightseeing",location:"Abu Dhabi",duration:"8 hrs",price:"AED 199",img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=500&q=75"}]},
  doha:{name:"Doha",country:"Qatar",flag:"🇶🇦",img:"https://images.unsplash.com/photo-1580674684081-827b1f2c0c70?w=1400&q=80",desc:"Pearl of the Arabian Peninsula — stunning Corniche, Souq Waqif, Museum of Islamic Art, and modern marvels.",tours:[{name:"Doha City Tour",tag:"Culture",location:"Doha",duration:"6 hrs",price:"QAR 149",img:"https://images.unsplash.com/photo-1580674684081-827b1f2c0c70?w=500&q=75"},{name:"Souq Waqif Experience",tag:"Heritage",location:"Old Doha",duration:"3 hrs",price:"QAR 99",img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=500&q=75"},{name:"Qatar Desert Safari",tag:"Adventure",location:"Inland Sea",duration:"8 hrs",price:"QAR 249",img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=75"}]},
  riyadh:{name:"Riyadh",country:"Saudi Arabia",flag:"🇸🇦",img:"https://images.unsplash.com/photo-1591604466107-96bdca0954e3?w=1400&q=80",desc:"Saudi Arabia's thriving capital — ancient heritage meets a bold futuristic vision, from the Edge of the World to DIRIYAH.",tours:[{name:"Edge of World",tag:"Adventure",location:"Riyadh Outskirts",duration:"10 hrs",price:"SAR 249",img:"https://images.unsplash.com/photo-1591604466107-96bdca0954e3?w=500&q=75"},{name:"Riyadh City Tour",tag:"Sightseeing",location:"Riyadh",duration:"6 hrs",price:"SAR 149",img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=75"},{name:"DIRIYAH Heritage",tag:"Heritage",location:"DIRIYAH",duration:"4 hrs",price:"SAR 99",img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=500&q=75"}]},
  muscat:{name:"Muscat",country:"Oman",flag:"🇴🇲",img:"https://images.unsplash.com/photo-1590056406796-ef7e5a751a4c?w=1400&q=80",desc:"Oman's serene capital — whitewashed mosques, dramatic mountain wadis, ancient forts, and unspoilt coastlines.",tours:[{name:"Muscat City Tour",tag:"Sightseeing",location:"Muscat",duration:"7 hrs",price:"OMR 35",img:"https://images.unsplash.com/photo-1590056406796-ef7e5a751a4c?w=500&q=75"},{name:"Wahiba Sands Safari",tag:"Desert",location:"Wahiba",duration:"Full day",price:"OMR 65",img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=75"},{name:"Wadi Shab Hike",tag:"Nature",location:"Sur",duration:"8 hrs",price:"OMR 45",img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=500&q=75"}]},
  kuwait:{name:"Kuwait",country:"Kuwait",flag:"🇰🇼",img:"https://images.unsplash.com/photo-1610082378986-18e95d7b2096?w=1400&q=80",desc:"A hidden Gulf gem — iconic Kuwait Towers, vibrant Souq Al-Mubarakiya, and a rich history waiting to be explored.",tours:[{name:"Kuwait City Tour",tag:"Sightseeing",location:"Kuwait City",duration:"5 hrs",price:"KWD 29",img:"https://images.unsplash.com/photo-1610082378986-18e95d7b2096?w=500&q=75"},{name:"Kuwait Heritage Walk",tag:"Culture",location:"Old Kuwait",duration:"3 hrs",price:"KWD 19",img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=500&q=75"},{name:"Desert Day Trip",tag:"Adventure",location:"Kuwait Desert",duration:"6 hrs",price:"KWD 39",img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=75"}]},
  bahrain:{name:"Bahrain",country:"Bahrain",flag:"🇧🇭",img:"https://images.unsplash.com/photo-1609813768225-4d21d513d26d?w=1400&q=80",desc:"Island Kingdom of the Gulf — F1 circuit, ancient Bahrain Fort, pearl diving heritage, and modern luxury.",tours:[{name:"Bahrain City Tour",tag:"Sightseeing",location:"Manama",duration:"5 hrs",price:"BHD 19",img:"https://images.unsplash.com/photo-1609813768225-4d21d513d26d?w=500&q=75"},{name:"Bahrain Fort & Museum",tag:"Heritage",location:"Bahrain Fort",duration:"3 hrs",price:"BHD 12",img:"https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=500&q=75"},{name:"Pearl Diving Experience",tag:"Culture",location:"Manama Bay",duration:"4 hrs",price:"BHD 29",img:"https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=500&q=75"}]},
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function buildWA(d) {
  const dr = (d.dateFrom||d.dateTo)?`${d.dateFrom||"Flexible"} → ${d.dateTo||"Flexible"}`:"Flexible";
  const lines = ["Hi Gulf Apex! I want to enquire.",`Package: ${d.packageName}`,`Name: ${d.name||"Not provided"}`,`Date: ${dr}`,`Guests: ${d.guests}`,d.phone?`Phone: ${d.phone}`:null,d.email?`Email: ${d.email}`:null,`Budget: ${d.budget}`,d.message?`Message: ${d.message}`:null].filter(Boolean).join("\n");
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`;
}

/* ═══════════════════════════════════════════════════════════════
   STYLE INJECTOR
═══════════════════════════════════════════════════════════════ */
function StyleInjector() {
  useEffect(() => {
    const id = "gac-v2";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL TO TOP
═══════════════════════════════════════════════════════════════ */
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   ENQUIRY MODAL
═══════════════════════════════════════════════════════════════ */
function Modal({ lead, setLead, onClose }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const s = (f, v) => setLead(p => ({ ...p, [f]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!lead.name || !lead.phone) { setStatus("Please enter your name and phone number."); return; }
    setBusy(true);
    setTimeout(() => {
      saveToFirebase("enquiries", { ...lead, source: "modal" });
      window.open(buildWA(lead), "_blank", "noopener,noreferrer");
      setStatus("Opening WhatsApp…");
      setBusy(false);
      setTimeout(onClose, 900);
    }, 360);
  };

  return (
    <div className="modal-bg" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Enquire — {lead.packageName}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="fgrid" onSubmit={submit}>
          <div className="frow">
            <label className="flabel">Full Name *<input required className="finput" placeholder="Your name" value={lead.name} onChange={e=>s("name",e.target.value)}/></label>
            <label className="flabel">Phone *<input required className="finput" type="tel" placeholder="+971…" value={lead.phone} onChange={e=>s("phone",e.target.value)}/></label>
          </div>
          <label className="flabel">Email<input className="finput" type="email" placeholder="you@email.com" value={lead.email} onChange={e=>s("email",e.target.value)}/></label>
          <div className="frow">
            <label className="flabel">Travel From<input className="finput" type="date" value={lead.dateFrom} onChange={e=>s("dateFrom",e.target.value)}/></label>
            <label className="flabel">Travel To<input className="finput" type="date" value={lead.dateTo} onChange={e=>s("dateTo",e.target.value)}/></label>
          </div>
          <div className="frow">
            <label className="flabel">Guests<select className="finput" value={lead.guests} onChange={e=>s("guests",e.target.value)}>{["1 Person","2 Persons","3–5 Persons","6–10 Persons","10+ Persons"].map(g=><option key={g}>{g}</option>)}</select></label>
            <label className="flabel">Budget<select className="finput" value={lead.budget} onChange={e=>s("budget",e.target.value)}>{BUDGET_OPTS.map(b=><option key={b}>{b}</option>)}</select></label>
          </div>
          <label className="flabel">Experience<select className="finput" value={lead.packageName} onChange={e=>s("packageName",e.target.value)}><option>Custom Quote</option>{EXPERIENCES.map(ex=><option key={ex.title}>{ex.title}</option>)}</select></label>
          <label className="flabel">Message<textarea className="finput" rows="3" placeholder="Hotel, pickup area, special requests…" value={lead.message} onChange={e=>s("message",e.target.value)}/></label>
          {status && <p className="form-status-ok">{status}</p>}
          <button className="btn btn-primary full" type="submit" disabled={busy}>{busy?"Opening WhatsApp…":"📲 Enquire via WhatsApp"}</button>
          <p className="form-note">* Required. You'll be contacted via WhatsApp or phone.</p>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {label:"Home",to:"/"},
  {label:"Destinations",sub:[{label:"Dubai",to:"/dubai"},{label:"Abu Dhabi",to:"/abu-dhabi"},{label:"Doha",to:"/doha"},{label:"Riyadh",to:"/riyadh"},{label:"Muscat",to:"/muscat"},{label:"Kuwait",to:"/kuwait"},{label:"Bahrain",to:"/bahrain"}]},
  {label:"Services",sub:[{label:"UAE Visa Services",to:"/services/visa"},{label:"Holiday Packages",to:"/services/packages"},{label:"Airport Transfers",to:"/services/transfers"}]},
  {label:"Visa Consultation",to:"/visa-consultation"},
  {label:"About",to:"/about"},
  {label:"Contact",to:"/contact"},
];

function Header() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("gac-theme") === "dark");
  const loc = useLocation();
  useEffect(() => { setOpen(false); setDd(null); }, [loc.pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("gac-theme", dark ? "dark" : "light");
  }, [dark]);

  return (<>
    <div className="topbar">
      <div className="topbar-inner">
        <span>📞 <a href="tel:+971313342532">+971 313 342 532</a> &nbsp;|&nbsp; 📧 <a href="mailto:info@gulfapexconsultant.com">info@gulfapexconsultant.com</a></span>
        <div className="topbar-right"><span>🇦🇪 Dubai, UAE</span><span>🇮🇳 India</span></div>
      </div>
    </div>
    <header className={`header${scrolled?" scrolled":""}`}>
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">GA</div>
          <div><div className="logo-name">Gulf Apex Consultant</div><div className="logo-sub">Travel &amp; Tourism Experts</div></div>
        </Link>
        <nav className="nav">
          {NAV_ITEMS.map(item => item.sub ? (
            <div key={item.label} className="nav-item-wrap" onMouseEnter={()=>setDd(item.label)} onMouseLeave={()=>setDd(null)}>
              <div className="nav-item">
                {item.label}<span className="nav-caret">▾</span>
              </div>
              {dd===item.label && <div className="dropdown">{item.sub.map(s=><Link key={s.label} to={s.to}>{s.label}</Link>)}</div>}
            </div>
          ) : (
            <NavLink key={item.label} to={item.to} end={item.to==="/"} className={({isActive})=>`nav-item${isActive?" active":""}`}>{item.label}</NavLink>
          ))}
          <Link to="/contact" className="nav-item nav-cta">Enquire Now</Link>
        </nav>
        <button className="theme-toggle" onClick={()=>setDark(v=>!v)} aria-label="Toggle theme">
          {dark ? (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>) : (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>)}
        </button>
        <button className={`hamburger${open?" open":""}`} onClick={()=>setOpen(v=>!v)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {NAV_ITEMS.map(item => item.sub ? (
            <div key={item.label}>
              <div className="mob-section">{item.label}</div>
              {item.sub.map(s=><Link key={s.label} to={s.to} className="mob-link sub" onClick={()=>setOpen(false)}>{s.label}</Link>)}
            </div>
          ) : (
            <Link key={item.label} to={item.to} className="mob-link" onClick={()=>setOpen(false)}>{item.label}</Link>
          ))}
          <Link to="/contact" className="mob-link cta" onClick={()=>setOpen(false)}>Enquire Now</Link>
        </div>
      )}
    </header>
  </>);
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">GA</div>
              <div><div className="footer-logo-name">Gulf Apex Consultant</div><div className="footer-logo-sub">Travel &amp; Tourism Experts</div></div>
            </div>
            <p className="footer-about">A premier travel consultancy based in Dubai — desert safaris, yacht rentals, city tours, holiday packages, and hassle-free Gulf visa services. Built around the way you want to move.</p>
            <div className="footer-socials">
              {[["f","Facebook"],["ig","Instagram"],["wa","WhatsApp"],["in","LinkedIn"],["yt","YouTube"]].map(([l,a])=>(
                <a key={l} href="#" className="footer-social" aria-label={a} style={l==="wa"?{background:"#25D366",borderColor:"#25D366",color:"#fff"}:l==="in"?{background:"#0077B5",borderColor:"#0077B5",color:"#fff"}:{}}>{l}</a>
              ))}
            </div>
            <div className="footer-badge-row" style={{marginTop:22}}>
              {["✅ Licensed Operator","⭐ 4.9 Rated","📍 Dubai Based"].map(b=><div key={b} className="footer-badge">{b}</div>)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-col-title">Services</div>
            <div className="footer-links">
              {["Desert Safari","Yacht Rental","City Tours","Holiday Packages","UAE Visa","Hot Air Balloon","Dhow Cruise","Helicopter Tour","Visa Consultation"].map(l=>(
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <div className="footer-col-title">Destinations</div>
            <div className="footer-links">
              {[["Dubai","/dubai"],["Abu Dhabi","/abu-dhabi"],["Doha","/doha"],["Riyadh","/riyadh"],["Muscat","/muscat"],["Kuwait","/kuwait"],["Bahrain","/bahrain"]].map(([l,p])=>(
                <Link key={l} to={p}>{l}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact Us</div>
            {[
              ["📍","Office 301, Business Bay, Dubai, UAE"],
              ["📞",<a href="tel:+971313342532">+971 313 342 532</a>],
              ["✉️",<a href="mailto:info@gulfapexconsultant.com">info@gulfapexconsultant.com</a>],
              ["🕐","Mon–Sat: 9 AM – 8 PM\nSun: 10 AM – 6 PM"],
              ["👤","Gulf Apex Consultant L.L.C.\nTravel & Visa Experts, Dubai"],
            ].map(([icon,text],i)=>(
              <div key={i} className="footer-contact-item">
                <span className="fci-icon">{icon}</span>
                <span className="fci-text" style={{whiteSpace:"pre-line"}}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="footer-mid">
        <div className="footer-mid-inner">
          <div>
            <div style={{color:"#F9C96E",fontWeight:700,fontSize:14,marginBottom:4}}>📬 Get Exclusive Travel Deals</div>
            <div style={{color:"rgba(255,255,255,.42)",fontSize:13}}>Subscribe for Gulf travel tips, exclusive offers and visa updates.</div>
          </div>
          <div className="footer-newsletter">
            <input type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/>
            <button onClick={()=>{if(email){alert("Subscribed! We'll be in touch soon.");setEmail("");}}}>Subscribe →</button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2025 Gulf Apex Consultant L.L.C. All rights reserved.</span>
          <div>
            <Link to="/about">About</Link>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WHATSAPP FLOAT
═══════════════════════════════════════════════════════════════ */
function WAFloat() {
  return (
    <div className="wa-float">
      <div className="wa-label">Chat on WhatsApp</div>
      <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Gulf Apex! I want to enquire about a trip.")}`} target="_blank" rel="noopener noreferrer" className="wa-btn" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" fill="white"><path d="M16 3.5A12.4 12.4 0 0 0 5.3 22.2L4 28l5.9-1.5A12.4 12.4 0 1 0 16 3.5Zm0 22.6c-2 0-3.9-.6-5.5-1.6l-.4-.2-3.2.8.8-3.1-.2-.4A10.1 10.1 0 1 1 16 26.1Zm5.8-7.5c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.4.3-.7.1a8.3 8.3 0 0 1-4.1-3.6c-.2-.3 0-.5.1-.7l.5-.6c.1-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.3 4.8.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.5Z"/></svg>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTA BAND (shared)
═══════════════════════════════════════════════════════════════ */
function CTABand({title, desc, onEnquire}) {
  return (
    <div className="cta-band">
      <div className="cta-inner">
        <div className="anim-left"><h2 className="cta-title">{title}</h2><p className="cta-desc">{desc}</p></div>
        <div className="cta-actions anim-right d2">
          <a href="tel:+971313342532" className="cta-phone">📞 +971 313 342 532</a>
          <button className="btn btn-white" onClick={onEnquire}>Enquire Now</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: HOME
═══════════════════════════════════════════════════════════════ */
function HomePage() {
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState(false);
  const [lead, setLead] = useState(INIT_LEAD);
  const [activeExp, setActiveExp] = useState(EXPERIENCES[0].title);
  const [search, setSearch] = useState({destination:"",tourType:"",date:"",guests:"2 Persons"});
  const timer = useRef(null);
  const nav = useNavigate();

  const exp = useMemo(()=>EXPERIENCES.find(e=>e.title===activeExp)||EXPERIENCES[0],[activeExp]);

  useEffect(()=>{
    timer.current = setInterval(()=>setSlide(s=>(s+1)%HERO_SLIDES.length),5200);
    return ()=>clearInterval(timer.current);
  },[]);

  const goSlide = i => { clearInterval(timer.current); setSlide(i); timer.current = setInterval(()=>setSlide(s=>(s+1)%HERO_SLIDES.length),5200); };

  const open = (pkg="Custom Quote") => {
    setLead(c=>({...c,packageName:pkg,message:pkg!=="Custom Quote"?`I want details for ${pkg}.`:c.message}));
    setModal(true);
  };

  const doSearch = () => {
    const msg = `Looking for ${search.tourType||"a trip"} to ${search.destination||"Dubai"}${search.date?` around ${search.date}`:""}. Guests: ${search.guests}.`;
    setLead(c=>({...c,packageName:search.tourType||"Custom Quote",message:msg}));
    setModal(true);
  };

  return (<main>
    {/* HERO */}
    <section className="hero">
      <div style={{position:"relative",width:"100%",height:"100%"}}>
        {HERO_SLIDES.map((s,i)=>(
          <div key={i} className={`hero-slide${i===slide?" active":""}`}>
            <img src={s.img} alt="Hero"/>
            <div className="hero-overlay"/>
            <div className="hero-content">
              <div className="hero-badge">{s.badge}</div>
              <h1 className="hero-title">{s.title}</h1>
              <p className="hero-desc">{s.desc}</p>
              <div className="hero-btns">
                <button className="btn btn-primary" onClick={()=>open()}>Explore Tours</button>
                <a href="tel:+971313342532" className="btn btn-ghost">📞 Call Us</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {HERO_SLIDES.map((_,i)=><button key={i} className={`hero-dot${i===slide?" active":""}`} onClick={()=>goSlide(i)}/>)}
      </div>
      <div className="hero-scroll"><div className="hero-scroll-line"/><span>Scroll</span></div>
    </section>

    {/* SEARCH */}
    <div className="searchbar-wrap">
      <div className="searchbar-inner">
        <div className="searchbar">
          <div className="sf"><label>Destination</label><select value={search.destination} onChange={e=>setSearch({...search,destination:e.target.value})}><option value="">Select Destination</option>{["Dubai","Abu Dhabi","Sharjah","Doha","Riyadh","Muscat","Kuwait","Bahrain"].map(d=><option key={d}>{d}</option>)}</select></div>
          <div className="sf"><label>Tour Type</label><select value={search.tourType} onChange={e=>setSearch({...search,tourType:e.target.value})}><option value="">All Activities</option>{["Desert Safari","Yacht Rental","City Tour","Holiday Package","Visa Service"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="sf"><label>Travel Date</label><input type="date" className="" value={search.date} onChange={e=>setSearch({...search,date:e.target.value})}/></div>
          <div className="sf"><label>Guests</label><select value={search.guests} onChange={e=>setSearch({...search,guests:e.target.value})}>{["1 Person","2 Persons","3–5 Persons","6–10 Persons","10+ Persons"].map(g=><option key={g}>{g}</option>)}</select></div>
          <button className="search-go" onClick={doSearch}>🔍 Search</button>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="statsbar">
      <div className="statsbar-inner">
        {[["15,000+","Happy Travellers"],["4.9 / 5","Average Rating"],["50+","Destinations"],["5 Years","Of Excellence"],["10 min","Avg Reply Time"]].map(([n,l])=>(
          <div className="stat" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
    </div>

    {/* ABOUT */}
    <section className="section">
      <div className="container">
        <div className="about-grid">
          <div className="about-images anim-left">
            <img className="about-img-main" src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" alt="Dubai skyline"/>
            <img className="about-img-secondary" src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=75" alt="Desert safari"/>
            <div className="about-stamp"><div className="about-stamp-num">5★</div><div className="about-stamp-text">Certified<br/>Agency</div></div>
          </div>
          <div className="about-content anim-right d2">
            <span className="eyebrow">About Gulf Apex Consultant</span>
            <h2 className="about-title">Award Winning Travel Consultancy in Dubai</h2>
            <p className="about-text">Gulf Apex Consultant helps travellers understand the Gulf before they book — what to visit, how to move, which documents matter, and who to contact when plans change. From Gulf desert adventures to seamless visa services, every trip is built around you.</p>
            <div className="about-feats">
              {["Expert Travel Consultants","Hassle-Free Visa Services","24/7 WhatsApp Support","Best Price Guarantee"].map(f=>(
                <div className="about-feat" key={f}><div className="feat-dot"/><div className="feat-text">{f}</div></div>
              ))}
            </div>
            <Link to="/about" className="btn btn-primary">Meet Our Experts →</Link>
          </div>
        </div>
      </div>
    </section>

    {/* SERVICES */}
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">What We Offer</span>
          <h2 className="section-title">Explore Our <span>Services</span></h2>
          <p className="section-desc">From thrilling desert safaris to luxury yacht rentals — every Gulf experience covered.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s,i)=>(
            <div className={`svc-card anim-scale d${(i%6)+1}`} key={i} onClick={()=>open(s.name)}>
              <span className="svc-emoji">{s.emoji}</span>
              <div className="svc-name">{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* EXPERIENCES */}
    <section className="section" id="experiences">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Top Experiences</span>
          <h2 className="section-title">Book Dubai &amp; <span>Gulf Escapes</span></h2>
          <p className="section-desc">Handpicked tours for the very best Gulf experiences at the best prices. Hover to preview.</p>
        </div>
        <div className="exp-board">
          <article className="exp-featured">
            <img src={exp.img} alt={exp.title}/>
            <div className="exp-featured-overlay">
              <span className="exp-tag">{exp.tag}</span>
              <h3>{exp.title}</h3>
              <p>{exp.summary}</p>
              <div className="exp-meta"><strong>{exp.price}</strong><span>📍 {exp.location}</span><span>⏱ {exp.duration}</span></div>
              <button className="btn btn-primary" onClick={()=>open(exp.title)}>Book This Experience</button>
            </div>
          </article>
          <div className="exp-list">
            {EXPERIENCES.map(ex=>(
              <button key={ex.title} className={`exp-row${ex.title===activeExp?" active":""}`} onClick={()=>setActiveExp(ex.title)} onMouseEnter={()=>setActiveExp(ex.title)} type="button">
                <img src={ex.img} alt=""/>
                <div className="exp-row-info"><em>{ex.tag}</em><strong>{ex.title}</strong><small>{ex.location} · {ex.duration}</small></div>
                <b>{ex.price}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* DESTINATIONS */}
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Top Destinations</span>
          <h2 className="section-title">Explore <span>Gulf Destinations</span></h2>
          <p className="section-desc">Choose from our most loved Gulf destinations and let us craft the perfect trip.</p>
        </div>
        <div className="dest-grid">
          {DESTINATIONS.map(d=>(
            <div key={d.name} className="dest-card" onClick={()=>nav(d.path)}>
              <img src={d.img} alt={d.name} loading="lazy"/>
              <div className="dest-overlay"/>
              <div className="dest-name">{d.name}</div>
              <div className="dest-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ITINERARY */}
    <section className="section" style={{background:"#fff8ef"}}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Ready-Made Starting Point</span>
          <h2 className="section-title">4-Day <span>Dubai Itinerary</span></h2>
          <p className="section-desc">Not sure where to start? Use our most popular itinerary as a base — we'll customise it for you.</p>
        </div>
        <div className="timeline">
          {ITINERARY.map(([day,text])=>(
            <div className="tl-item anim-left" key={day}><div className="tl-day">{day}</div><p className="tl-text">{text}</p></div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:36}}>
          <button className="btn btn-primary" onClick={()=>open("Custom Quote")}>Customise This Itinerary</button>
        </div>
      </div>
    </section>

    {/* WHY US */}
    <section className="section section-alt">
      <div className="container">
        <div className="why-grid">
          <div>
            <span className="eyebrow">Why Gulf Apex</span>
            <h2 className="section-title" style={{textAlign:"left",marginBottom:32}}>Your Trusted Local <span>Tour Operator</span></h2>
            <div className="why-feats">
              {WHY_ITEMS.map((w,i)=>(
                <div className={`why-item anim-left d${i+1}`} key={w.title}>
                  <div className="why-icon-wrap">{w.icon}</div>
                  <div className="why-text"><h4>{w.title}</h4><p>{w.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="chips">
              {CHIPS.map(c=><span key={c} className="chip">{c}</span>)}
            </div>
          </div>
          <div className="why-visual anim-right">
            <img src="https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80" alt="Dubai"/>
            <div className="why-card">
              <div className="why-card-label">What our clients say</div>
              <div className="why-stars">★★★★★</div>
              <div className="why-review">"Gulf Apex made our dream Dubai trip a reality. Absolutely flawless from start to finish!"</div>
              <div className="why-author">— Emily Watson, Australia</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Happy Travellers</span>
          <h2 className="section-title">What Our <span>Clients Say</span></h2>
          <p className="section-desc">Over 15,000 happy customers — here's what some of them have to say.</p>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i)=>(
            <div className={`testi-card anim-up d${i+1}`} key={t.name}>
              <div className="testi-quote">"</div>
              <div className="testi-stars">{t.stars}</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-foot">
                <div className="testi-av">{t.initials}</div>
                <div><div className="testi-name">{t.name}</div><div className="testi-from">{t.from}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTABand title="Ready to Start Your Gulf Adventure?" desc="Talk to our experts and let us design a trip that perfectly matches your dreams and budget." onEnquire={()=>open()}/>

    {modal && <Modal lead={lead} setLead={setLead} onClose={()=>setModal(false)}/>}
  </main>);
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: ABOUT
═══════════════════════════════════════════════════════════════ */
const EXPERTS = [
  {
    name:"Ravi Kapoor",
    role:"Head of Visa Services",
    img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    desc:"10+ years of UAE visa expertise. Ravi handles all visa applications, document verification and compliance for clients from India and across South Asia.",
    badge:"Visa Expert"
  },
  {
    name:"Sunita Menon",
    role:"Senior Travel Consultant",
    img:"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    desc:"Specialises in crafting bespoke itineraries for families, honeymooners and corporate groups travelling to the Gulf region.",
    badge:"Travel Specialist"
  },
  {
    name:"Khalid Al Rashid",
    role:"Destination Expert — Gulf",
    img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    desc:"Born and raised in Dubai, Khalid has insider knowledge of every corner of the UAE, Qatar, Oman, and Saudi Arabia.",
    badge:"Local Expert"
  },
];

function AboutPage() {
  return (<main>
    <section className="about-page-hero">
      <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1800&q=82" alt="Dubai skyline"/>
      <div className="about-hero-overlay"/>
      <div className="about-hero-content">
        <span className="eyebrow" style={{color:"#F9C96E"}}>About Gulf Apex Consultant</span>
        <h1>Travel &amp; visa consultancy built for seamless Gulf experiences.</h1>
        <p>Gulf Apex Consultant helps travellers plan, book and execute unforgettable Gulf journeys — from visa guidance to on-ground support.</p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="about-intro-grid">
          <div className="anim-left">
            <span className="eyebrow">Who We Are</span>
            <div className="about-intro-copy">
              <h2>Dubai-based travel consultants with visa guidance at the center.</h2>
              <p>We combine destination planning with practical visa consultancy, so customers can move from enquiry to itinerary with less uncertainty. The work is straightforward: listen, verify requirements, recommend the right experience, and stay reachable.</p>
            </div>
          </div>
          <div className="about-panel anim-right d2">
            <h3>Gulf Apex Consultant</h3>
            <strong>Dubai, UAE | Est. 2019</strong>
            <p>A team of passionate travel and visa experts serving travellers from India to the Gulf, with offices in Dubai and partner networks across the region.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Our People</span>
          <h2 className="section-title">Meet Our <span>Experts</span></h2>
          <p className="section-desc">Our team brings together deep Gulf expertise, visa knowledge and travel passion — all in one place.</p>
        </div>
        <div className="experts-grid">
          {EXPERTS.map((ex,i)=>(
            <div className={`expert-card anim-up d${i+1}`} key={ex.name}>
              <div className="expert-img-wrap">
                <img src={ex.img} alt={ex.name} className="expert-img"/>
                <div className="expert-badge-pill">{ex.badge}</div>
              </div>
              <div className="expert-body">
                <h3 className="expert-name">{ex.name}</h3>
                <div className="expert-role">{ex.role}</div>
                <p className="expert-desc">{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Our Expertise</span>
          <h2 className="section-title">What We <span>Specialise In</span></h2>
        </div>
        <div className="about-svc-grid">
          <div className="about-svc-card anim-up d1"><div className="about-svc-num">01</div><h3>Visa Consultation</h3><p>UAE visa guidance, document checklist support, application-readiness review and practical travel-date advice before customers commit to a package.</p></div>
          <div className="about-svc-card anim-up d2"><div className="about-svc-num">02</div><h3>Travel Planning</h3><p>Dubai activity planning across desert safari, Burj Khalifa, Dubai Frame, Museum of the Future, yachts, Palm Jumeirah, beach days and Old Dubai routes.</p></div>
          <div className="about-svc-card anim-up d3"><div className="about-svc-num">03</div><h3>Group &amp; Corporate</h3><p>Tailored packages for families, corporate retreats, school groups and MICE travel — end-to-end management from flights to on-ground logistics.</p></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="about-vision-head anim-up">
          <span className="eyebrow">Company Vision</span>
          <h2>Make Gulf travel easier to trust, understand, and book.</h2>
          <p>Our vision is to become a reliable Dubai-based consultancy where travellers can handle visa questions, tour planning and on-ground support without jumping between disconnected providers.</p>
        </div>
        <div className="about-values">
          {ABOUT_VALS.map(([t,p],i)=>(
            <div className={`about-val anim-up d${i+1}`} key={t}><h3>{t}</h3><p>{p}</p></div>
          ))}
        </div>
      </div>
    </section>

    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Our Commitment</span>
          <h2 className="section-title">What You <span>Can Expect</span></h2>
        </div>
        <div className="about-hlights">
          {ABOUT_HLS.map(h=><div className="about-hl" key={h}>{h}</div>)}
        </div>
      </div>
    </section>

    <CTABand title="Ready to Plan Your Dubai Trip?" desc="Speak with our experts for a personalised itinerary, visa guidance and on-ground support." onEnquire={()=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Gulf Apex! I'd like to plan a trip.")}`, "_blank", "noopener,noreferrer")}/>
  </main>);
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: CONTACT
═══════════════════════════════════════════════════════════════ */
function ContactPage() {
  const [fd, setFd] = useState({name:"",email:"",phone:"",service:"",budget:"Flexible",dateFrom:"",dateTo:"",guests:"2 Persons",message:""});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const s = (f,v) => setFd(p=>({...p,[f]:v}));

  const submit = e => {
    e.preventDefault();
    if (!fd.name||!fd.phone){setStatus("Please fill in your name and phone number.");return;}
    setBusy(true);
    const msg = `Hi Gulf Apex! I want to enquire about ${fd.service||"Dubai trips"}.\nName: ${fd.name}\nPhone: ${fd.phone}\nEmail: ${fd.email||"N/A"}\nDate: ${fd.dateFrom||"Flexible"} to ${fd.dateTo||"Flexible"}\nGuests: ${fd.guests}\nBudget: ${fd.budget}\nMessage: ${fd.message||"N/A"}`;
    setTimeout(()=>{
      saveToFirebase("contact_enquiries", { ...fd, source: "contact_page" });
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      setStatus("Opening WhatsApp…");
      setBusy(false);
      setTimeout(()=>setStatus(""),3200);
    },380);
  };

  return (<div>
    <section className="contact-hero">
      <div className="contact-hero-overlay"/>
      <div className="contact-hero-content">
        <span className="eyebrow" style={{color:"#F9C96E"}}>Get in Touch</span>
        <h1>Let's Plan Your Next Journey</h1>
        <p style={{fontSize:17,opacity:.88,lineHeight:1.75,maxWidth:560}}>Reach out to our travel advisors for a custom itinerary, visa support or instant booking assistance.</p>
      </div>
    </section>

    <section className="section section-alt">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info anim-left">
            <h2>Contact Information</h2>
            <p className="contact-intro">Gulf Apex Consultant is ready to help you book the perfect Gulf escape. Fill out the form and we'll get back to you via WhatsApp or phone.</p>
            {[["📍","Office Address","Office 301, Business Bay, Dubai, UAE"],["📞","Phone",<a href="tel:+971313342532">+971 313 342 532</a>],["✉️","Email",<a href="mailto:info@gulfapexconsultant.com">info@gulfapexconsultant.com</a>],["🕒","Working Hours","Mon–Sat: 9 AM – 8 PM\nSunday: 10 AM – 6 PM"],["🏢","Company","Gulf Apex Consultant L.L.C.\nDubai-based Travel & Visa Experts"]].map(([icon,title,val],i)=>(
              <div className="ci-item" key={i}>
                <div className="ci-icon">{icon}</div>
                <div><div className="ci-title">{title}</div><div className="ci-text" style={{whiteSpace:"pre-line"}}>{val}</div></div>
              </div>
            ))}
            <div className="soc-row">
              <h4>Follow Us</h4>
              <div className="soc-icons">
                {[["f","Facebook"],["ig","Instagram"],["wa","WhatsApp"],["in","LinkedIn"]].map(([l,a])=><a key={l} href="#" className="soc-icon" aria-label={a} style={l==="wa"?{background:"#25D366",borderColor:"#25D366",color:"#fff"}:l==="in"?{background:"#0077B5",borderColor:"#0077B5",color:"#fff"}:{}}>{l}</a>)}
              </div>
            </div>
          </div>

          <div className="form-card anim-right d2">
            <h2>Send an Enquiry</h2>
            <form className="fgrid" onSubmit={submit}>
              <div className="frow">
                <label className="flabel">Full Name *<input required className="finput" placeholder="Your name" value={fd.name} onChange={e=>s("name",e.target.value)}/></label>
                <label className="flabel">Phone Number *<input required className="finput" type="tel" placeholder="+971..." value={fd.phone} onChange={e=>s("phone",e.target.value)}/></label>
              </div>
              <label className="flabel">Email Address<input className="finput" type="email" placeholder="you@email.com" value={fd.email} onChange={e=>s("email",e.target.value)}/></label>
              <label className="flabel">Service Interest<select className="finput" value={fd.service} onChange={e=>s("service",e.target.value)}><option value="">Select a service</option>{CONTACT_SVCS.map(sv=><option key={sv}>{sv}</option>)}</select></label>
              <div className="frow">
                <label className="flabel">From Date<input className="finput" type="date" value={fd.dateFrom} onChange={e=>s("dateFrom",e.target.value)}/></label>
                <label className="flabel">To Date<input className="finput" type="date" value={fd.dateTo} onChange={e=>s("dateTo",e.target.value)}/></label>
              </div>
              <div className="frow">
                <label className="flabel">Number of Guests<select className="finput" value={fd.guests} onChange={e=>s("guests",e.target.value)}>{["1 Person","2 Persons","3–5 Persons","6–10 Persons","10+ Persons"].map(g=><option key={g}>{g}</option>)}</select></label>
                <label className="flabel">Budget Range<select className="finput" value={fd.budget} onChange={e=>s("budget",e.target.value)}>{BUDGET_RANGES.map(b=><option key={b}>{b}</option>)}</select></label>
              </div>
              <label className="flabel">Message<textarea className="finput" rows="4" placeholder="Tell us what you'd like to plan, special requirements, preferred activities…" value={fd.message} onChange={e=>s("message",e.target.value)}/></label>
              {status&&<p className="form-status-ok">{status}</p>}
              <button className="btn btn-primary full" type="submit" disabled={busy}>{busy?"Opening WhatsApp…":"📲 Submit Enquiry via WhatsApp"}</button>
              <p className="form-note">* Required fields. By submitting, you agree to be contacted via WhatsApp or phone.</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Visit Our Office</span>
          <h2 className="section-title">Find Us in <span>Business Bay</span></h2>
          <p className="section-desc">Located in the heart of Dubai's business district, easily accessible from all major areas.</p>
        </div>
        <div className="map-wrap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.5!2d55.2708!3d25.1984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sBusiness+Bay%2C+Dubai!2sAE!5e0!3m2!1sen!2sae!4v1655903382!5m2!1sen!2sae" width="100%" height="430" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location"/>
        </div>
      </div>
    </section>

    <CTABand title="Prefer to Call Directly?" desc="Speak with our team for instant assistance with your Dubai travel plans." onEnquire={()=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Gulf Apex! I want to enquire.")}`, "_blank", "noopener,noreferrer")}/>
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: DESTINATION (generic)
═══════════════════════════════════════════════════════════════ */
function DestPage({name,country,flag,img,desc,tours}) {
  const [modal, setModal] = useState(false);
  const [lead, setLead] = useState({...INIT_LEAD, packageName:`${name} Tour`, message:`I want to enquire about a ${name} tour.`});
  const open = pkg => { setLead(l=>({...l,packageName:pkg,message:`I want details for ${pkg}.`})); setModal(true); };

  return (<main>
    <section className="dest-hero-page">
      <img src={img} alt={name}/>
      <div className="dest-hero-overlay"/>
      <div className="dest-hero-content">
        <span className="eyebrow" style={{color:"#F9C96E"}}>{flag} {country}</span>
        <h1>{name}</h1>
        <p>{desc}</p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Popular Experiences</span>
          <h2 className="section-title">Best Tours in <span>{name}</span></h2>
          <p className="section-desc">Handpicked experiences to make the most of your time in {name}.</p>
        </div>
        <div className="tours-grid">
          {tours.map((t,i)=>(
            <div className={`tour-card anim-up d${(i%3)+1}`} key={i}>
              <img className="tour-card-img" src={t.img} alt={t.name}/>
              <div className="tour-card-body">
                <div className="tour-tag">{t.tag}</div>
                <div className="tour-name">{t.name}</div>
                <div className="tour-meta">⏱ {t.duration} &nbsp;·&nbsp; 📍 {t.location}</div>
                <div className="tour-footer">
                  <div><div className="tour-from">From</div><div className="tour-price">{t.price}</div></div>
                  <button className="btn btn-primary" style={{padding:"9px 18px",fontSize:13}} onClick={()=>open(t.name)}>Enquire</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTABand title={`Plan Your ${name} Trip Today`} desc="Let our Gulf experts craft the perfect personalised itinerary for your adventure." onEnquire={()=>setModal(true)}/>
    {modal && <Modal lead={lead} setLead={setLead} onClose={()=>setModal(false)}/>}
  </main>);
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: VISA CONSULTATION
═══════════════════════════════════════════════════════════════ */
const VISA_TYPES = [
  { icon:"🗓️", name:"30-Day Tourist Visa", duration:"30 Days", desc:"Perfect for short holidays and business visits. Single entry, extendable to 60 days.", price:"₹4,500", note:"Approx. charges, service fee not included" },
  { icon:"📅", name:"60-Day Tourist Visa", duration:"60 Days", desc:"Best for extended stays, family visits or long trips across the UAE.", price:"₹7,000", note:"Approx. charges, service fee not included" },
  { icon:"🔁", name:"Multi-Entry Visa (1 Year)", duration:"180 Days / Year", desc:"Ideal for frequent travellers. Multiple entries, stay up to 90 days at a time.", price:"₹12,000", note:"Approx. charges, service fee not included" },
  { icon:"💼", name:"Business Visa", duration:"30–60 Days", desc:"For business meetings, conferences, exhibitions. Requires employer letter.", price:"₹6,000", note:"Approx. charges, service fee not included" },
  { icon:"👨‍👩‍👧", name:"Family / Dependent Visa", duration:"30–90 Days", desc:"Travel with family — spouse, children. Group pricing available.", price:"₹3,800/person", note:"Min. 2 persons. Approx. charges." },
  { icon:"🏫", name:"Transit Visa (96 Hours)", duration:"96 Hours", desc:"Short layover visa for connecting flights via UAE. Express processing.", price:"₹1,800", note:"For transit through UAE airports" },
];

const VISA_CHARGES_TABLE = [
  ["30-Day Single Entry Tourist Visa", "Up to 30 days", "₹3,000–₹4,500", "5–7 working days"],
  ["60-Day Single Entry Tourist Visa", "Up to 60 days", "₹5,500–₹7,000", "5–7 working days"],
  ["Multi-Entry Visa (1 Year)", "90 days/stay", "₹10,000–₹12,000", "7–10 working days"],
  ["Business Visa (30 Day)", "Up to 30 days", "₹4,500–₹6,000", "5–7 working days"],
  ["Transit Visa (96 Hrs)", "96 hours", "₹1,500–₹1,800", "2–3 working days"],
  ["Family Visa (per person)", "30–90 days", "₹3,500–₹4,500", "5–7 working days"],
  ["Express Processing (add-on)", "Any visa", "+₹1,500–₹2,000", "2–3 working days"],
];

const VISA_DOCS = [
  { icon:"📷", text:"Passport size photo (white background, recent)" },
  { icon:"📘", text:"Passport copy (min. 6 months validity)" },
  { icon:"✈️", text:"Confirmed return flight ticket" },
  { icon:"🏨", text:"Hotel booking / accommodation proof" },
  { icon:"💳", text:"Bank statement (last 3 months)" },
  { icon:"📋", text:"Application form (filled & signed)" },
  { icon:"📄", text:"Travel insurance (recommended)" },
  { icon:"💼", text:"Employment letter / business proof (for business visa)" },
];

const VISA_STEPS = [
  { num:"01", title:"Share Documents", desc:"Send us scanned copies of your passport, photo and travel details via WhatsApp." },
  { num:"02", title:"We Review & Advise", desc:"Our visa experts check eligibility, validity and recommend the right visa type." },
  { num:"03", title:"Application Submitted", desc:"We submit your application to the UAE immigration authority on your behalf." },
  { num:"04", title:"Visa Approved", desc:"Typically within 5–7 working days. Express options available at extra cost." },
  { num:"05", title:"Receive e-Visa", desc:"Your visa is emailed directly to you — ready to travel!" },
];

function VisaConsultationPage() {
  const [form, setForm] = useState({ name:"", phone:"", email:"", visaType:"30-Day Tourist Visa", travelDate:"", passengers:"1 Person", message:"" });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const s = (f,v) => setForm(p=>({...p,[f]:v}));

  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.phone) { setStatus("Please enter your name and phone."); return; }
    setBusy(true);
    const msg = `Hi Gulf Apex! I need UAE Visa Consultation.\nVisa Type: ${form.visaType}\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email||"N/A"}\nTravel Date: ${form.travelDate||"Flexible"}\nPassengers: ${form.passengers}\nMessage: ${form.message||"N/A"}`;
    setTimeout(()=>{
      saveToFirebase("visa_enquiries", { ...form, source: "visa_page" });
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      setStatus("✅ Opening WhatsApp — our team will assist you shortly!");
      setBusy(false);
    }, 360);
  };

  return (<main>
    <section className="visa-hero">
      <div className="visa-hero-overlay"/>
      <div className="visa-hero-content">
        <span className="eyebrow" style={{color:"#F9C96E"}}>🛂 UAE Visa Services</span>
        <h1>India to UAE Visa Consultation — Fast, Reliable &amp; Hassle-Free</h1>
        <p style={{fontSize:17,opacity:.88,lineHeight:1.75,maxWidth:580}}>Expert UAE visa assistance for Indian passport holders. Tourist, business, multi-entry and family visas — all processed from Dubai by our certified team.</p>
      </div>
    </section>

    {/* VISA TYPES */}
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Visa Options</span>
          <h2 className="section-title">Choose Your <span>UAE Visa Type</span></h2>
          <p className="section-desc">We process all major UAE visa categories for Indian passport holders. Prices are indicative — contact us for exact current charges.</p>
        </div>
        <div className="visa-types-grid">
          {VISA_TYPES.map((v,i)=>(
            <div className={`visa-type-card anim-up d${(i%3)+1}`} key={v.name}>
              <div className="visa-type-icon">{v.icon}</div>
              <div className="visa-type-name">{v.name}</div>
              <div className="visa-type-duration">⏱ {v.duration}</div>
              <p className="visa-type-desc">{v.desc}</p>
              <div className="visa-type-price">{v.price}</div>
              <div className="visa-type-note">{v.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CHARGES TABLE */}
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Transparent Pricing</span>
          <h2 className="section-title">Visa Charges — <span>India to UAE</span></h2>
          <p className="section-desc">Below are approximate charges for UAE visas from India (in INR). Actual charges may vary based on current immigration fees. Enquire for exact quote.</p>
        </div>
        <div style={{overflowX:"auto",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,.09)"}}>
          <table className="charges-table">
            <thead>
              <tr>
                <th>Visa Type</th>
                <th>Stay Duration</th>
                <th>Approx. Charges (INR)</th>
                <th>Processing Time</th>
              </tr>
            </thead>
            <tbody>
              {VISA_CHARGES_TABLE.map(([type,stay,price,time])=>(
                <tr key={type}>
                  <td><strong>{type}</strong></td>
                  <td>{stay}</td>
                  <td className="price-cell">{price}</td>
                  <td>{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="disclaimer-note" style={{marginTop:20}}>
          <strong>⚠️ Important:</strong> Charges listed are approximate and subject to change as per UAE immigration authority. Our service fee is additional. <strong>For exact, up-to-date charges — enquire via WhatsApp below.</strong>
        </div>

        {/* WhatsApp CTA for charges */}
        <div className="visa-enquire-banner" style={{marginTop:32}}>
          <div>
            <h3>Get Exact Visa Charges in Minutes</h3>
            <p>Send us a WhatsApp message with your passport details and travel dates — we'll send you a full cost breakdown instantly.</p>
          </div>
          <button className="btn-wa" onClick={()=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Gulf Apex! I want to know the exact UAE visa charges for Indian passport.")}`, "_blank", "noopener,noreferrer")}>
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Enquire on WhatsApp
          </button>
        </div>
      </div>
    </section>

    {/* DOCUMENTS REQUIRED */}
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Checklist</span>
          <h2 className="section-title">Documents <span>Required</span></h2>
          <p className="section-desc">Make sure you have these ready before applying. Our team will guide you through every step.</p>
        </div>
        <div className="visa-docs-grid">
          {VISA_DOCS.map((d,i)=>(
            <div className={`visa-doc-item anim-up d${(i%4)+1}`} key={d.text}>
              <span className="visa-doc-icon">{d.icon}</span>
              <span className="visa-doc-text">{d.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* PROCESS */}
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">How It Works</span>
          <h2 className="section-title">Our Visa <span>Process</span></h2>
          <p className="section-desc">Simple, transparent and fast — from document submission to e-visa delivery in your inbox.</p>
        </div>
        <div className="visa-process-steps">
          {VISA_STEPS.map((step,i)=>(
            <div className={`visa-step anim-up d${(i%5)+1}`} key={step.num}>
              <div className="visa-step-num">{step.num}</div>
              <div className="visa-step-title">{step.title}</div>
              <p className="visa-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ENQUIRY FORM */}
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Get Started</span>
          <h2 className="section-title">Apply for Your <span>UAE Visa</span></h2>
          <p className="section-desc">Fill in your details and our visa team will contact you within 2 hours on WhatsApp.</p>
        </div>
        <div style={{maxWidth:660,margin:"0 auto"}}>
          <div className="form-card">
            <form className="fgrid" onSubmit={submit}>
              <div className="frow">
                <label className="flabel">Full Name *<input required className="finput" placeholder="Your name" value={form.name} onChange={e=>s("name",e.target.value)}/></label>
                <label className="flabel">Phone / WhatsApp *<input required className="finput" type="tel" placeholder="+91 98765..." value={form.phone} onChange={e=>s("phone",e.target.value)}/></label>
              </div>
              <label className="flabel">Email Address<input className="finput" type="email" placeholder="you@email.com" value={form.email} onChange={e=>s("email",e.target.value)}/></label>
              <label className="flabel">Visa Type Required<select className="finput" value={form.visaType} onChange={e=>s("visaType",e.target.value)}>{VISA_TYPES.map(v=><option key={v.name}>{v.name}</option>)}</select></label>
              <div className="frow">
                <label className="flabel">Travel Date<input className="finput" type="date" value={form.travelDate} onChange={e=>s("travelDate",e.target.value)}/></label>
                <label className="flabel">No. of Passengers<select className="finput" value={form.passengers} onChange={e=>s("passengers",e.target.value)}>{["1 Person","2 Persons","3–5 Persons","6–10 Persons","10+ Persons"].map(g=><option key={g}>{g}</option>)}</select></label>
              </div>
              <label className="flabel">Message / Special Requirements<textarea className="finput" rows="3" placeholder="Any questions about the visa process, document queries…" value={form.message} onChange={e=>s("message",e.target.value)}/></label>
              {status && <p className="form-status-ok">{status}</p>}
              <button className="btn-wa" type="submit" disabled={busy} style={{justifyContent:"center",width:"100%",fontSize:16,padding:"14px 28px"}}>
                <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {busy ? "Opening WhatsApp…" : "📲 Submit Visa Enquiry via WhatsApp"}
              </button>
              <p className="form-note">* Required. You'll receive a response within 2 hours on WhatsApp.</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <CTABand title="Need Urgent Visa Processing?" desc="Call us directly or WhatsApp for same-day consultation and express visa processing options." onEnquire={()=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Gulf Apex! I need urgent UAE visa processing.")}`, "_blank", "noopener,noreferrer")}/>
  </main>);
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  return (<>
    <StyleInjector/>
    <ScrollTop/>
    <Header/>
    <Routes>
      <Route path="/"                    element={<HomePage/>}/>
      <Route path="/about"               element={<AboutPage/>}/>
      <Route path="/contact"             element={<ContactPage/>}/>
      <Route path="/visa-consultation"   element={<VisaConsultationPage/>}/>
      {Object.entries(DESTS_DATA).map(([slug,data])=>(
        <Route key={slug} path={`/${slug}`} element={<DestPage {...data}/>}/>
      ))}
      <Route path="*" element={<HomePage/>}/>
    </Routes>
    <Footer/>
    <WAFloat/>
  </>);
}
