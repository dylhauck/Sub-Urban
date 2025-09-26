// auth.js  — ES Module
// Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

/* ---------- Your Firebase config ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyA8UG7du46d8w76VrSNrEgg7WgD7S6YX_0",
  authDomain: "sub-urban-5366e.firebaseapp.com",
  projectId: "sub-urban-5366e",
  storageBucket: "sub-urban-5366e.firebasestorage.app",
  messagingSenderId: "472762801459",
  appId: "1:472762801459:web:ff3687891c59dfaef3f246",
  measurementId: "G-5PG1HV20ED"
};

/* ---------- Initialize ---------- */
export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

/* ---------- Helpers ---------- */
function byId(id){ return document.getElementById(id); }
function setMsg(el, text, kind=""){ if(!el) return; el.textContent = text || ""; el.className = kind; }
function goHome(){ window.location.href = "index.html"; }

/* ---------- Dropdown login/logout handling & guards ---------- */
function wireAccountUI(user){
  const loginLink = byId("authAction");
  const loginLinkMobile = byId("authActionMobile");

  // Update label
  [loginLink, loginLinkMobile].forEach(link=>{
    if (!link) return;
    link.textContent = user ? "Log out" : "Log in";
    link.onclick = (e)=>{
      if (user){ // log out inline
        e.preventDefault();
        signOut(auth).catch(console.error);
      } // if logged out, default link goes to login.html
    };
  });

  // Guard account links if logged out
  const protectedLinks = document.querySelectorAll('[data-acct]');
  protectedLinks.forEach(a=>{
    a.addEventListener('click', (e)=>{
      if (!auth.currentUser){
        // send to login page if not authenticated
        e.preventDefault();
        window.location.href = "login.html";
      }
    });
  });
}

/* ---------- Auth form bindings (if present on the page) ---------- */
function wireLoginForm(){
  const form = byId("loginForm");
  if (!form) return;
  const emailEl = byId("loginEmail");
  const passEl  = byId("loginPassword");
  const msgEl   = byId("loginMsg");
  const forgot  = byId("forgotPasswordBtn");

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    setMsg(msgEl, "Signing in…");
    try{
      await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
      setMsg(msgEl, "Signed in.", "success");
      goHome();
    }catch(err){
      console.error(err);
      setMsg(msgEl, friendlyAuthError(err), "error");
    }
  });

  if (forgot){
    forgot.addEventListener("click", async ()=>{
      const email = (emailEl?.value || "").trim();
      if (!email){ setMsg(msgEl, "Enter your email above first.", "error"); return; }
      try{
        await sendPasswordResetEmail(auth, email);
        setMsg(msgEl, "Password reset email sent.", "success");
      }catch(err){
        console.error(err);
        setMsg(msgEl, friendlyAuthError(err), "error");
      }
    });
  }
}

function wireSignupForm(){
  const form = byId("signupForm");
  if (!form) return;
  const emailEl = byId("signupEmail");
  const passEl  = byId("signupPassword");
  const tosEl   = byId("acceptTos");
  const msgEl   = byId("authMsg");
  const strengthEl = byId("passwordStrength");

  // simple strength hint
  passEl?.addEventListener("input", ()=>{
    const v = passEl.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const labels = ["—","Weak","Okay","Good","Strong"];
    if (strengthEl) strengthEl.textContent = `Password strength: ${labels[score]}`;
  });

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if (tosEl && !tosEl.checked){
      setMsg(msgEl, "Please accept the Terms & Privacy.", "error");
      return;
    }
    setMsg(msgEl, "Creating account…");
    try{
      const cred = await createUserWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
      // Create user doc so Firestore rules allow subsequent writes
      const userRef = doc(db, "users", cred.user.uid);
      const existing = await getDoc(userRef);
      if (!existing.exists()){
        await setDoc(userRef, {
          email: cred.user.email || emailEl.value.trim(),
          createdAt: Date.now()
        }, { merge: true });
      }
      setMsg(msgEl, "Account created.", "success");
      goHome();
    }catch(err){
      console.error(err);
      setMsg(msgEl, friendlyAuthError(err), "error");
    }
  });
}

/* ---------- Error messages ---------- */
function friendlyAuthError(err){
  const code = err?.code || "";
  if (code.includes("invalid-email")) return "That email looks invalid.";
  if (code.includes("user-not-found")) return "No account found for that email.";
  if (code.includes("wrong-password")) return "Incorrect password.";
  if (code.includes("email-already-in-use")) return "An account already exists for that email.";
  if (code.includes("weak-password")) return "Password should be at least 6–8 characters.";
  if (code.includes("network-request-failed")) return "Network error, please try again.";
  return "Something went wrong. Please try again.";
}

/* ---------- Auth state listener ---------- */
onAuthStateChanged(auth, (user)=>{
  wireAccountUI(user);
  // (Optional) you could show a greeting, etc.
});

/* ---------- Auto-bind forms on load ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  wireLoginForm();
  wireSignupForm();
});
