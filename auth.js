// auth.js — matches your login.html IDs + extra logging
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// --- Firebase config (yours) ---
const firebaseConfig = {
  apiKey: "AIzaSyA8UG7du46d8w76VrSNrEgg7WgD7S6YX_0",
  authDomain: "sub-urban-5366e.firebaseapp.com",
  projectId: "sub-urban-5366e",
  storageBucket: "sub-urban-5366e.firebasestorage.app",
  messagingSenderId: "472762801459",
  appId: "1:472762801459:web:ff3687891c59dfaef3f246",
  measurementId: "G-5PG1HV20ED"
};

console.log('[auth] initializing app');
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log('[auth] init complete');

const $ = (s, r=document) => r.querySelector(s);
const setText = (el, msg) => { if (el) el.textContent = msg; };
const disable = (el, on=true) => { if (el) el.disabled = !!on; };

// Header log in/out + guards + dropdown
function wireHeaderAuth(user) {
  const authAction = $("#authAction");
  const authActionMobile = $("#authActionMobile");

  const setLoggedOut = (el) => {
    if (!el) return;
    el.textContent = "Log in";
    el.setAttribute("href", "login.html");
    el.onclick = null;
  };
  const setLoggedIn = (el) => {
    if (!el) return;
    el.textContent = "Log out";
    el.setAttribute("href", "#");
    el.onclick = (e) => {
      e.preventDefault();
      signOut(auth).then(()=> window.location.href = "index.html").catch(console.error);
    };
  };

  if (user) { setLoggedIn(authAction); setLoggedIn(authActionMobile); }
  else      { setLoggedOut(authAction); setLoggedOut(authActionMobile); }

  ["account","orders","wishlist"].forEach(key=>{
    document.querySelectorAll(`a[data-acct="${key}"]`).forEach(a=>{
      a.addEventListener("click", (e)=>{
        if (!auth.currentUser) { e.preventDefault(); window.location.href = "login.html"; }
      });
    });
  });

  const menuWrap = document.querySelector(".account-menu");
  const btn = $("#acctMenuBtn");
  if (menuWrap && btn) {
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      const open = menuWrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const close = (ev)=>{
          if (!menuWrap.contains(ev.target)) {
            menuWrap.classList.remove("open");
            btn.setAttribute("aria-expanded","false");
            document.removeEventListener("click", close);
          }
        };
        setTimeout(()=> document.addEventListener("click", close), 0);
      }
    });
  }
}

// Login page wiring
function wireLoginPage() {
  const emailEl   = $("#loginEmail");
  const passEl    = $("#loginPassword");
  const loginBtn  = $("#loginBtn");
  const forgotBtn = $("#forgotBtn");

  const regEmailEl = $("#regEmail");
  const regPassEl  = $("#regPassword");
  const regBtn     = $("#registerBtn");
  const tos        = $("#tos");

  const msg = $("#authMsg");

  if (!emailEl || !passEl || !loginBtn) {
    console.log('[auth] login inputs/buttons not found on this page (ok if not login.html)');
  } else {
    console.log('[auth] login UI present');
  }

  [emailEl, passEl, regEmailEl, regPassEl].forEach(inp=>{
    if (!inp) return;
    inp.addEventListener("keydown", (e)=>{
      if (e.key === "Enter") {
        if (e.target === regEmailEl || e.target === regPassEl) regBtn?.click();
        else loginBtn?.click();
      }
    });
  });

  if (loginBtn) {
    loginBtn.addEventListener("click", async ()=>{
      setText(msg, "");
      disable(loginBtn, true);
      const email = emailEl?.value.trim();
      const pass  = passEl?.value || "";
      console.log('[auth] signIn click', { hasEmail: !!email, hasPass: !!pass });
      if (!email || !pass) {
        setText(msg, "Please enter your email and password.");
        disable(loginBtn, false);
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        console.log('[auth] signIn success -> redirect');
        window.location.href = "index.html";
      } catch (err) {
        console.error('[auth] signIn error', err);
        let m = "Couldn't sign in. Please check your email and password.";
        if (err.code === "auth/invalid-email") m = "That email address looks invalid.";
        if (err.code === "auth/user-not-found") m = "No account found with that email.";
        if (err.code === "auth/wrong-password") m = "Incorrect password.";
        if (err.code === "auth/too-many-requests") m = "Too many attempts. Try again shortly.";
        setText(msg, m);
      } finally {
        disable(loginBtn, false);
      }
    });
  }

  if (forgotBtn) {
    forgotBtn.addEventListener("click", async ()=>{
      setText(msg, "");
      const email = (emailEl?.value || regEmailEl?.value || "").trim();
      if (!email) { setText(msg, "Enter your email first, then tap Forgot?"); return; }
      try {
        await sendPasswordResetEmail(auth, email);
        setText(msg, "Password reset email sent. Check your inbox.");
      } catch (err) {
        console.error('[auth] reset error', err);
        let m = "Couldn't send reset email.";
        if (err.code === "auth/invalid-email") m = "That email address looks invalid.";
        if (err.code === "auth/user-not-found") m = "No account found with that email.";
        setText(msg, m);
      }
    });
  }

  if (regBtn) {
    regBtn.addEventListener("click", async ()=>{
      setText(msg, "");
      disable(regBtn, true);
      const email = regEmailEl?.value.trim();
      const pass  = regPassEl?.value || "";
      const accepted = !!(tos && tos.checked);
      console.log('[auth] register click', { hasEmail: !!email, hasPass: !!pass, accepted });
      if (!email || !pass) {
        setText(msg, "Email and password are required.");
        disable(regBtn, false);
        return;
      }
      if (!accepted) {
        setText(msg, "Please accept the Terms & Privacy to continue.");
        disable(regBtn, false);
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        console.log('[auth] register success -> redirect');
        window.location.href = "index.html";
      } catch (err) {
        console.error('[auth] register error', err);
        let m = "Couldn't create your account.";
        if (err.code === "auth/email-already-in-use") m = "That email is already in use.";
        if (err.code === "auth/invalid-email") m = "That email address looks invalid.";
        if (err.code === "auth/weak-password") m = "Password should be at least 6 characters.";
        setText(msg, m);
      } finally {
        disable(regBtn, false);
      }
    });
  }
}

// Observe auth state for header
onAuthStateChanged(auth, (user)=> {
  console.log('[auth] state:', user ? 'signed-in' : 'signed-out');
  wireHeaderAuth(user);
});

// Init per page
document.addEventListener("DOMContentLoaded", ()=>{
  console.log('[auth] DOM ready, wiring login page (if present)');
  wireLoginPage();
});
