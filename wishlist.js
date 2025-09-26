// wishlist.js — renders the logged-in user's wishlist as product cards,
// supports live updates and removing items.

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, onSnapshot, updateDoc, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth();             // uses app initialized in auth.js
const db   = getFirestore();

// Minimal product catalog (IDs must match data-product values used on buttons)
const CATALOG = {
  "prod-iridescent-slip": {
    title: "Iridescent Slip Dress",
    price: 98,
    image: "https://images.unsplash.com/photo-1531907700752-62799b2a3e3b?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  },
  "prod-holo-dress": {
    title: "Holographic Panel Dress",
    price: 120,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  },
  "prod-teal-blouse": {
    title: "Teal Satin Blouse",
    price: 62,
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  },
  "prod-metallic-midi": {
    title: "Metallic Midi Skirt",
    price: 74,
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  },
  "prod-metallic-jacket": {
    title: "Quilted Metallic Jacket",
    price: 132,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  },
  "prod-tonal-knit": {
    title: "Tonal Knit Dress",
    price: 96,
    image: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  },
  "prod-tech-fleece": {
    title: "Tech Fleece Set",
    price: 86,
    image: "https://images.unsplash.com/photo-1542897646-1f27e1b3802a?q=80&w=1200&auto=format&fit=crop",
    href: "product.html"
  }
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop";
const $ = (s) => document.querySelector(s);
const wishGrid = $("#wishGrid");
const empty    = $("#emptyState");
const hint     = $("#wishHint");

// Render helper with image fallback
function cardHTML(pid, uid){
  const p = CATALOG[pid] || {
    title: "Saved item",
    price: null,
    image: PLACEHOLDER,
    href: "product.html"
  };
  const price = p.price !== null ? `$${p.price}` : "—";
  return `
    <article class="card">
      <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
      <div class="card-body">
        <h3>${p.title}</h3>
        <p class="price">${price}</p>
        <div class="card-actions">
          <a class="btn outline" href="${p.href}">View details</a>
          <button class="btn ghost remove-btn" type="button" data-product="${pid}" data-uid="${uid}">Remove</button>
        </div>
      </div>
    </article>
  `;
}

function bindRemove(uid){
  document.querySelectorAll(".remove-btn").forEach(btn=>{
    btn.onclick = async () => {
      const pid = btn.dataset.product;
      await updateDoc(doc(db, "users", uid), { wishlist: arrayRemove(pid) });
    };
  });
}

function showEmpty(isEmpty){
  if(isEmpty){
    empty.classList.remove("hidden");
  }else{
    empty.classList.add("hidden");
  }
}

// Entry
onAuthStateChanged(auth, (user) => {
  if (!user){
    hint.textContent = "Please sign in to view your wishlist.";
    wishGrid.innerHTML = "";
    showEmpty(true);
    return;
  }

  hint.textContent = "These are your saved items.";
  const uref = doc(db, "users", user.uid);

  // Live updates
  onSnapshot(uref, (snap) => {
    const data = snap.data() || {};
    const list = Array.isArray(data.wishlist) ? data.wishlist : [];
    if (!list.length){
      wishGrid.innerHTML = "";
      showEmpty(true);
      return;
    }
    wishGrid.innerHTML = list.map(pid => cardHTML(pid, user.uid)).join("");
    showEmpty(false);
    bindRemove(user.uid);
  });
});
