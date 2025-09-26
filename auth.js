// auth.js — Firebase Auth + Firestore Profile + Wishlist + Account dropdown gating
// Uses your Firebase project config

// -------- Firebase SDK imports --------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, sendEmailVerification, signOut, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// -------- Your Firebase config --------
const firebaseConfig = {
  apiKey: "AIzaSyA8UG7du46d8w76VrSNrEgg7WgD7S6YX_0",
  authDomain: "sub-urban-5366e.firebaseapp.com",
  projectId: "sub-urban-5366e",
  storageBucket: "sub-urban-5366e.firebasestorage.app",
  messagingSenderId: "472762801459",
  appId: "1:472762801459:web:ff3687891c59dfaef3f246",
  measurementId: "G-5PG1HV20ED"
};

// -------- Init --------
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
setPersistence(auth, browserLocalPersistence);

// -------- Small helpers --------
const $   = (sel) => document.querySelector(sel);
const msg = (el, text) => { if (el) el.textContent = text; };

function strengthLabel(pw){
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return ["Weak","Okay","Good","Strong"][Math.max(0, s-1)];
}

/* ============================================================
   LOGIN PAGE (login.html)
   - Sign in / Forgot password
   - Create account (Terms checkbox + strength meter + email verify)
   ============================================================ */
const signupForm = $("#signupForm");
if (signupForm){
  const pw        = $("#signupPassword");
  const strengthB = $("#strength b");
  const tos       = $("#tos");
  const signupBtn = $("#signupBtn");

  // Strength meter
  pw?.addEventListener("input", () => { if (strengthB) strengthB.textContent = strengthLabel(pw.value); });

  // Terms gate
  if (tos && signupBtn){
    signupBtn.disabled = !tos.checked;
    tos.addEventListener("change", () => { signupBtn.disabled = !tos.checked; });
  }

  signupForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = $("#signupEmail").value.trim();
    const pass  = pw.value;

    if (!tos?.checked){ msg($("#authMsg"), "Please accept the Terms & Privacy."); return; }

    try{
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(cred.user);
      // create starter user doc
      await setDoc(doc(db, "users", cred.user.uid), { email, wishlist: [] }, { merge: true });
      msg($("#authMsg"), "Account created! Verification email sent. Redirecting…");
      setTimeout(()=> location.href = "account.html", 800);
    }catch(err){ msg($("#authMsg"), err.message); }
  });
}

const loginForm = $("#loginForm");
if (loginForm){
  loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = $("#loginEmail").value.trim();
    const pass  = $("#loginPassword").value;
    try{
      await signInWithEmailAndPassword(auth, email, pass);
      location.href = "account.html";
    }catch(err){ msg($("#authMsg"), err.message); }
  });

  $("#forgotBtn")?.addEventListener("click", async ()=>{
    const email = $("#loginEmail").value.trim();
    if(!email){ msg($("#authMsg"), "Enter your email first, then click Forgot."); return; }
    try{
      await sendPasswordResetEmail(auth, email);
      msg($("#authMsg"), "Password reset email sent.");
    }catch(err){ msg($("#authMsg"), err.message); }
  });
}

/* ============================================================
   ACCOUNT PAGE (account.html)
   - Guard
   - Resend verify / Sign out
   - Load & Save Sizes + Address
   ============================================================ */
if (location.pathname.endsWith("account.html")){
  onAuthStateChanged(auth, async (user)=>{
    if(!user){ location.replace("login.html"); return; }
    $("#displayEmail").textContent = user.email || "Member";

    const uref = doc(db, "users", user.uid);

    // Load profile
    try{
      const snap = await getDoc(uref);
      const data = snap.exists() ? snap.data() : {};

      // Sizes
      const defaultSize = data.defaultSize || "M";
      const sizePerType = data.sizePerType || {};
      $("#defaultSize") && ($("#defaultSize").value = defaultSize);
      $("#sizeTops") && ($("#sizeTops").value = sizePerType.tops || defaultSize);
      $("#sizeDresses") && ($("#sizeDresses").value = sizePerType.dresses || defaultSize);
      $("#sizeJackets") && ($("#sizeJackets").value = sizePerType.jackets || defaultSize);

      // Address
      const addr = (data.addresses && data.addresses.shipping) || {};
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
      setVal("shipName",   addr.fullName);
      setVal("shipPhone",  addr.phone);
      setVal("shipLine1",  addr.line1);
      setVal("shipLine2",  addr.line2);
      setVal("shipCity",   addr.city);
      setVal("shipState",  addr.state);
      setVal("shipPostal", addr.postal);
      setVal("shipCountry",addr.country || "US");
    }catch(e){ console.warn("Load user profile failed:", e); }

    // Save sizes
    $("#sizesForm")?.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const defaultSize = $("#defaultSize").value;
      const sizePerType = {
        tops:    $("#sizeTops").value,
        dresses: $("#sizeDresses").value,
        jackets: $("#sizeJackets").value
      };
      try{
        await setDoc(uref, { defaultSize, sizePerType }, { merge: true });
        msg($("#sizesMsg"), "Saved ✓");
        setTimeout(()=> msg($("#sizesMsg"), ""), 1400);
      }catch(err){ msg($("#sizesMsg"), err.message); }
    });

    // Save address
    $("#addrForm")?.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const shipping = {
        fullName: $("#shipName").value.trim(),
        phone:    $("#shipPhone").value.trim(),
        line1:    $("#shipLine1").value.trim(),
        line2:    $("#shipLine2").value.trim(),
        city:     $("#shipCity").value.trim(),
        state:    $("#shipState").value.trim(),
        postal:   $("#shipPostal").value.trim(),
        country:  $("#shipCountry").value.trim()
      };
      if(!shipping.fullName || !shipping.line1 || !shipping.city || !shipping.state || !shipping.postal || !shipping.country){
        msg($("#addrMsg"), "Please fill all required fields."); return;
      }
      try{
        await setDoc(uref, { addresses: { shipping } }, { merge: true });
        msg($("#addrMsg"), "Saved ✓");
        setTimeout(()=> msg($("#addrMsg"), ""), 1400);
      }catch(err){ msg($("#addrMsg"), err.message); }
    });
  });

  $("#signOutBtn")?.addEventListener("click", async ()=>{
    await signOut(auth);
    location.href = "login.html";
  });

  $("#sendVerify")?.addEventListener("click", async ()=>{
    if(auth.currentUser){
      await sendEmailVerification(auth.currentUser);
      msg($("#acctMsg"), "Verification email sent.");
    }
  });
}

/* ============================================================
   WISHLIST (all pages)
   - Live sync all .wishlist-btn labels via onSnapshot
   - Toggle add/remove on click
   - If signed out -> redirect to login
   ============================================================ */
function setButtonState(btn, saved){
  btn.textContent = saved ? "✓ Wishlisted" : "♡ Wishlist";
}

onAuthStateChanged(auth, async (user) => {
  const buttons = document.querySelectorAll(".wishlist-btn");
  if (!buttons.length) return;

  if (!user){
    buttons.forEach(btn => {
      setButtonState(btn, false);
      btn.onclick = () => { location.href = "login.html"; };
    });
    return;
  }

  const uref = doc(db, "users", user.uid);

  // Live sync
  onSnapshot(uref, (snap) => {
    const list = snap.exists() && Array.isArray(snap.data().wishlist) ? snap.data().wishlist : [];
    buttons.forEach(btn => {
      const pid = btn.dataset.product;
      setButtonState(btn, list.includes(pid));
    });
  });

  // Toggle
  buttons.forEach(btn => {
    btn.onclick = async () => {
      const pid = btn.dataset.product;
      const snap = await getDoc(uref);
      const list = snap.exists() && Array.isArray(snap.data().wishlist) ? snap.data().wishlist : [];
      if (list.includes(pid)){
        await updateDoc(uref, { wishlist: arrayRemove(pid) });
      } else {
        await setDoc(uref, { wishlist: arrayUnion(pid) }, { merge: true });
      }
    };
  });
});

/* ============================================================
   Account dropdown labels + gating (all pages with the dropdown)
   - Shows "Log in" if signed out, "Log out" if signed in
   - If signed out, My Account / Orders / Wishlist redirect to login
   ============================================================ */
function protectLinksWhenLoggedOut(){
  // Any link with data-acct should redirect to login if signed out
  document.querySelectorAll('[data-acct]').forEach(el=>{
    el.addEventListener('click', (ev)=>{
      ev.preventDefault();
      location.href = 'login.html';
    }, { once: true });
  });
  const mobileAuth = document.getElementById('authActionMobile');
  if (mobileAuth) mobileAuth.textContent = 'Log in';
}

onAuthStateChanged(auth, (user) => {
  const authBtn       = document.getElementById('authAction');        // dropdown button (desktop)
  const authBtnMobile = document.getElementById('authActionMobile');  // drawer link (mobile)

  if (!authBtn && !authBtnMobile) return; // page might not have dropdown; safe to skip

  if (!user){
    if (authBtn){ authBtn.textContent = 'Log in'; authBtn.onclick = () => { location.href = 'login.html'; }; }
    if (authBtnMobile){ authBtnMobile.textContent = 'Log in'; authBtnMobile.onclick = (e)=>{ e.preventDefault(); location.href='login.html'; }; }
    protectLinksWhenLoggedOut();
    return;
  }

  // Logged in: remove previous gating by cloning nodes
  document.querySelectorAll('[data-acct]').forEach(el=>{
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
  });

  if (authBtn){
    authBtn.textContent = 'Log out';
    authBtn.onclick = async () => { await signOut(auth); location.href = 'login.html'; };
  }
  if (authBtnMobile){
    authBtnMobile.textContent = 'Log out';
    authBtnMobile.onclick = async (e) => { e.preventDefault(); await signOut(auth); location.href = 'login.html'; };
  }
});
