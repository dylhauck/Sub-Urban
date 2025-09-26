// auth.js — Firebase Auth + Wishlist sync (works on all pages)

// 1) Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, sendEmailVerification, signOut, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 2) Your Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA8UG7du46d8w76VrSNrEgg7WgD7S6YX_0",
    authDomain: "sub-urban-5366e.firebaseapp.com",
    projectId: "sub-urban-5366e",
    storageBucket: "sub-urban-5366e.firebasestorage.app",
    messagingSenderId: "472762801459",
    appId: "1:472762801459:web:ff3687891c59dfaef3f246",
    measurementId: "G-5PG1HV20ED"
  };

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
setPersistence(auth, browserLocalPersistence);

// Helpers
const $   = (sel) => document.querySelector(sel);
const msg = (el, text) => { if (el) el.textContent = text; };

// Password strength (signup page)
function strengthLabel(pw){
  let s = 0;
  if(pw.length>=8) s++;
  if(/[A-Z]/.test(pw)) s++;
  if(/[0-9]/.test(pw)) s++;
  if(/[^A-Za-z0-9]/.test(pw)) s++;
  return ["Weak","Okay","Good","Strong"][Math.max(0,s-1)];
}

/* ================= AUTH UI (login.html) ================= */
const signupForm = $("#signupForm");
if (signupForm){
  const pw = $("#signupPassword");
  const strength = $("#strength b");
  pw.addEventListener("input", ()=> strength.textContent = strengthLabel(pw.value));

  signupForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = $("#signupEmail").value.trim();
    const pass  = pw.value;
    if (!$("#tos").checked) { msg($("#authMsg"), "Please accept Terms & Privacy."); return; }
    try{
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(cred.user);
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

/* ================= ACCOUNT PAGE (account.html) ================= */
if (location.pathname.endsWith("account.html")){
  onAuthStateChanged(auth, (user)=>{
    if(!user){ location.replace("login.html"); return; }
    $("#displayEmail").textContent = user.email || "Member";
  });

  $("#signOutBtn")?.addEventListener("click", async ()=>{
    await signOut(auth);
    location.href = "login.html";
  });
  $("#sendVerify")?.addEventListener("click", async ()=>{
    if(auth.currentUser){ await sendEmailVerification(auth.currentUser); msg($("#acctMsg"), "Verification email sent."); }
  });
}

/* ================= WISHLIST — LIVE SYNC & TOGGLE (all pages) ================= */
/*
  Behavior:
  - If signed in, we listen to /users/{uid} and keep ALL .wishlist-btn labels in sync:
      present in wishlist  -> "✓ Wishlisted"
      absent               -> "♡ Wishlist"
  - Clicking toggles arrayUnion/arrayRemove.
  - If not signed in, clicking sends the user to login.html (optional).
*/

function setButtonState(btn, isSaved){
  btn.textContent = isSaved ? "✓ Wishlisted" : "♡ Wishlist";
}

onAuthStateChanged(auth, async (user) => {
  const buttons = document.querySelectorAll(".wishlist-btn");
  if (!buttons.length) return; // no wishlist buttons on this page

  if (!user){
    // Not signed in: show default label, clicking brings to login
    buttons.forEach(btn => {
      setButtonState(btn, false);
      btn.onclick = () => { location.href = "login.html"; };
    });
    return;
  }

  const uref = doc(db, "users", user.uid);

  // Live listener keeps UI in sync across tabs/pages
  onSnapshot(uref, (snap) => {
    const list = snap.exists() && Array.isArray(snap.data().wishlist) ? snap.data().wishlist : [];
    buttons.forEach(btn => {
      const pid = btn.dataset.product;
      setButtonState(btn, list.includes(pid));
    });
  });

  // Toggle logic on click
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
      // label updates via onSnapshot
    };
  });
});
