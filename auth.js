// auth.js — Firebase auth + header wiring + redirects
// Load as: <script type="module" src="auth.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ----- Your Firebase config -----
const firebaseConfig = {
  apiKey: "AIzaSyA8UG7du46d8w76VrSNrEgg7WgD7S6YX_0",
  authDomain: "sub-urban-5366e.firebaseapp.com",
  projectId: "sub-urban-5366e",
  storageBucket: "sub-urban-5366e.firebasestorage.app",
  messagingSenderId: "472762801459",
  appId: "1:472762801459:web:ff3687891c59dfaef3f246",
  measurementId: "G-5PG1HV20ED"
};

// Init
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Small helpers
const $ = (sel, root = document) => root.querySelector(sel);
const setText = (el, msg) => { if (el) el.textContent = msg; };
const disable = (el, on) => { if (el) el.disabled = !!on; };

// ===== Header auth UI (Log in / Log out) =====
function wireHeaderAuth(user) {
  const authAction = $("#authAction");
  const authActionMobile = $("#authActionMobile");

  const setLoggedOut = (el) => {
    if (!el) return;
    el.textContent = "Log in";
    el.setAttribute("href", "login.html");
    el.onclick = null; // remove logout handler if any
  };

  const setLoggedIn = (el) => {
    if (!el) return;
    el.textContent = "Log out";
    el.setAttribute("href", "#");
    el.onclick = (e) => {
      e.preventDefault();
      signOut(auth).then(() => {
        // After logout go to home
        window.location.href = "index.html";
      }).catch(console.error);
    };
  };

  if (user) {
    setLoggedIn(authAction);
    setLoggedIn(authActionMobile);
  } else {
    setLoggedOut(authAction);
    setLoggedOut(authActionMobile);
  }

  // Protect account-only links when logged out
  const guardLink = (a) => {
    if (!a) return;
    a.addEventListener("click", (e) => {
      if (!auth.currentUser) {
        // Send to login if not signed in
        e.preventDefault();
        window.location.href = "login.html";
      }
    });
  };
  guardLink(document.querySelector('a[data-acct="account"]'));
  guardLink(document.querySelector('a[data-acct="orders"]'));
  guardLink(document.querySelector('a[data-acct="wishlist"]'));

  // Simple dropdown open/close behavior (if present)
  const menuWrap = document.querySelector(".account-menu");
  const btn = $("#acctMenuBtn");
  const list = $("#acctMenu");
  if (menuWrap && btn && list) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const open = menuWrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const onDocClick = (ev) => {
          if (!menuWrap.contains(ev.target)) {
            menuWrap.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
            document.removeEventListener("click", onDocClick);
          }
        };
        setTimeout(() => document.addEventListener("click", onDocClick), 0);
      }
    });
  }
}

// ===== Sign In form =====
function wireSignIn() {
  const form = $("#signInForm");
  if (!form) return; // not on login page
  const emailEl = $("#signin-email");
  const passEl  = $("#signin-password");
  const msgEl   = $("#signinMsg");
  const submit  = form.querySelector('[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setText(msgEl, "");
    disable(submit, true);

    const email = emailEl?.value.trim() || "";
    const pass  = passEl?.value || "";

    if (!email || !pass) {
      setText(msgEl, "Please enter your email and password.");
      disable(submit, false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // Important: redirect after success
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      // Friendly messages
      let m = "Couldn't sign in. Please check your email and password.";
      if (err.code === "auth/invalid-email") m = "That email address looks invalid.";
      if (err.code === "auth/user-not-found") m = "No account found with that email.";
      if (err.code === "auth/wrong-password") m = "Incorrect password.";
      if (err.code === "auth/too-many-requests") m = "Too many attempts. Try again in a minute.";
      setText(msgEl, m);
    } finally {
      disable(submit, false);
    }
  });
}

// ===== Create Account form =====
function wireCreateAccount() {
  const form = $("#createForm");
  if (!form) return;

  const nameEl   = $("#create-name");
  const emailEl  = $("#create-email");
  const passEl   = $("#create-password");
  const pass2El  = $("#create-password2");
  const tosEl    = $("#create-tos");
  const msgEl    = $("#createMsg");
  const submit   = form.querySelector('[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setText(msgEl, "");
    disable(submit, true);

    const name  = nameEl?.value.trim() || "";
    const email = emailEl?.value.trim() || "";
    const pass  = passEl?.value || "";
    const pass2 = pass2El?.value || "";
    const tos   = !!(tosEl && tosEl.checked);

    if (!email || !pass) {
      setText(msgEl, "Email and password are required.");
      disable(submit, false);
      return;
    }
    if (pass !== pass2) {
      setText(msgEl, "Passwords do not match.");
      disable(submit, false);
      return;
    }
    if (!tos) {
      setText(msgEl, "Please accept the Terms & Privacy to continue.");
      disable(submit, false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      // After account creation, send to home
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      let m = "Couldn't create your account.";
      if (err.code === "auth/email-already-in-use") m = "That email is already in use.";
      if (err.code === "auth/invalid-email") m = "That email address looks invalid.";
      if (err.code === "auth/weak-password") m = "Password should be at least 6 characters.";
      setText(msgEl, m);
    } finally {
      disable(submit, false);
    }
  });
}

// ===== Observe auth state (for header + guards) =====
onAuthStateChanged(auth, (user) => {
  wireHeaderAuth(user);
});

// Wire page-specific forms
document.addEventListener("DOMContentLoaded", () => {
  wireSignIn();
  wireCreateAccount();
});
