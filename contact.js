// contact.js — save contact form messages to Firestore (and prep for email)

// Reuse the initialized app from auth.js by importing the same SDK modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth();                 // uses the app initialized in auth.js
const db   = getFirestore();

const form = document.getElementById("contactForm");
const msg  = (t) => { const el = document.getElementById("contactMsg"); if (el) el.textContent = t; };

let currentUser = null;
onAuthStateChanged(auth, (u)=> { currentUser = u || null; });

form?.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const name    = (document.getElementById("name").value || "").trim();
  const email   = (document.getElementById("email").value || "").trim();
  const message = (document.getElementById("message").value || "").trim();

  if (!name || !email || !message){
    msg("Please fill out all fields.");
    return;
  }

  // Basic throttle: block accidental double submit
  submitBtn?.setAttribute("disabled", "true");
  msg("Sending…");

  try{
    await addDoc(collection(db, "contact_messages"), {
      name,
      email,
      message,
      userId: currentUser ? currentUser.uid : null,
      createdAt: serverTimestamp(),
      userAgent: navigator.userAgent
    });

    msg("Thanks! Your message has been received.");
    form.reset();
  }catch(err){
    console.error(err);
    msg("Sorry, something went wrong. Please try again.");
  }finally{
    submitBtn?.removeAttribute("disabled");
  }
});
