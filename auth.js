// auth.js (ES modules so we can import Firebase directly)
// 1) Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, sendEmailVerification, signOut, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// 2) Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA8UG7du46d8w76VrSNrEgg7WgD7S6YX_0",
    authDomain: "sub-urban-5366e.firebaseapp.com",
    projectId: "sub-urban-5366e",
    storageBucket: "sub-urban-5366e.firebasestorage.app",
    messagingSenderId: "472762801459",
    appId: "1:472762801459:web:ff3687891c59dfaef3f246",
    measurementId: "G-5PG1HV20ED"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Small helpers
const $ = (sel) => document.querySelector(sel);
const msg = (el, text) => { if(el){ el.textContent = text; }};

// Password strength (very simple visual)
function strengthLabel(pw){
  let s=0;
  if(pw.length>=8) s++;
  if(/[A-Z]/.test(pw)) s++;
  if(/[0-9]/.test(pw)) s++;
  if(/[^A-Za-z0-9]/.test(pw)) s++;
  return ["Weak","Okay","Good","Strong"][Math.max(0,s-1)];
}

// Wire signup
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
    }catch(err){
      msg($("#authMsg"), err.message);
    }
  });
}

// Wire login
const loginForm = $("#loginForm");
if (loginForm){
  loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = $("#loginEmail").value.trim();
    const pass  = $("#loginPassword").value;
    try{
      await signInWithEmailAndPassword(auth, email, pass);
      location.href = "account.html";
    }catch(err){
      msg($("#authMsg"), err.message);
    }
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

// Account page guard + actions
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
