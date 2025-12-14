// wishlist.js — render/manage wishlist stored in localStorage
const WL_KEY = 'wishlist_local';

/* ---------- Storage helpers (with in-memory fallback) ---------- */
let __memWL = [];
function readWishlist() {
try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); }
catch { return __memWL.slice(); }
}
function writeWishlist(items) {
try { localStorage.setItem(WL_KEY, JSON.stringify(items)); }
catch { __memWL = items.slice(); }
}
function currency(v) { return `$${Number(v).toFixed(0)}`; }

/* ---------- Toast ---------- */
function toast(msg) {
const t = document.createElement('div');
t.className = 'toast';
t.textContent = msg;
document.body.appendChild(t);
requestAnimationFrame(() => {
  t.style.opacity = 1;
  t.style.transform = 'translateX(-50%)';
});
setTimeout(() => { t.style.opacity = 0; }, 1400);
setTimeout(() => { t.remove(); }, 1800);
}

/* ---------- Wishlist core (id-based) ---------- */
function normalizeId(id) {
return (id || '').toString().trim();
}

function wishlistIdsSet(items = readWishlist()) {
const s = new Set();
for (const it of items) {
  if (it && it.id) s.add(String(it.id));
}
return s;
}

function isWishlisted(productId) {
const id = normalizeId(productId);
if (!id) return false;
return wishlistIdsSet().has(id);
}

/**
* Try to build a usable wishlist item from DOM context.
* Falls back gracefully if some fields aren't available.
*/
function buildItemFromDOM(productId, btn) {
const id = normalizeId(productId);
const card = btn?.closest('.card') || null;

// Title
const title =
  card?.querySelector('h3')?.textContent?.trim() ||
  card?.querySelector('h3 a')?.textContent?.trim() ||
  id;

// Price (strip non-numeric)
let price = null;
const priceText = card?.querySelector('.price')?.textContent || '';
const priceNum = Number(String(priceText).replace(/[^0-9.]/g, ''));
if (!Number.isNaN(priceNum) && priceText) price = priceNum;

// Image
const image =
  card?.querySelector('img')?.getAttribute('src') ||
  '';

return {
  id,
  title,
  price: (price ?? 0),
  image,
  ts: Date.now()
};
}

function addWishlistItem(item) {
const items = readWishlist();
const id = normalizeId(item?.id);
if (!id) return { ok: false, reason: 'missing_id' };

// de-dupe by id
if (!items.find(x => String(x.id) === id)) {
  items.push(item);
  writeWishlist(items);
}
return { ok: true };
}

function removeWishlistById(productId) {
const id = normalizeId(productId);
if (!id) return { ok: false, reason: 'missing_id' };

const items = readWishlist();
const next = items.filter(x => String(x.id) !== id);
writeWishlist(next);
return { ok: true };
}

function toggleWishlist(productId, btn) {
const id = normalizeId(productId);
if (!id) return { wished: false, ok: false };

const wished = isWishlisted(id);
if (wished) {
  removeWishlistById(id);
  return { wished: false, ok: true };
} else {
  const item = buildItemFromDOM(id, btn);
  addWishlistItem(item);
  return { wished: true, ok: true };
}
}

/* ---------- Button UI syncing (heart red when wished) ---------- */
function setWishlistButtonState(btn, wished) {
if (!btn) return;

// Keep your base button styling as PRIMARY (per your note)
btn.classList.add('btn', 'primary');
btn.classList.remove('ghost'); // just in case older markup exists

btn.classList.toggle('wished', wished);
btn.setAttribute('aria-pressed', wished ? 'true' : 'false');

// Render heart + text; make only the heart red when wished
const heart = wished ? '❤' : '♡';
const heartColor = wished ? '#e11d48' : ''; // red-600-ish
btn.innerHTML = `<span class="wl-heart" style="color:${heartColor};">${heart}</span> Wishlist`;
}

function syncWishlistButtons(scope = document) {
const items = readWishlist();
const ids = wishlistIdsSet(items);
scope.querySelectorAll('.add-to-wishlist[data-product-id]').forEach((btn) => {
  const id = normalizeId(btn.getAttribute('data-product-id'));
  setWishlistButtonState(btn, ids.has(id));
});
}

/* ---------- Render (wishlist page) ---------- */
function renderWishlist() {
const root = document.getElementById('wishlistRoot');
if (!root) return;

const items = readWishlist();
root.innerHTML = '';

if (!items.length) {
  root.innerHTML = `
    <div class="empty">
      <strong>No items yet</strong>
      <p class="muted">Save items you love from the <a href="index.html#collection">collection</a>.</p>
    </div>`;
  return;
}

const grid = document.createElement('section');
grid.className = 'grid';

items.forEach((it, idx) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${it.image}" alt="${it.title}" />
    <div class="card-body">
      <h3>${it.title}</h3>
      <p class="price">${currency(it.price)}</p>
      <div class="card-actions">
        <a class="btn outline" href="product.html">View details</a>
        <button class="btn ghost remove-wl" data-index="${idx}" data-product-id="${it.id}" type="button">Remove</button>
      </div>
    </div>
  `;
  grid.appendChild(card);
});

root.appendChild(grid);
}

/* ---------- Events ---------- */

// Toggle wishlist from ANY page (index/product/etc)
document.addEventListener('click', (e) => {
const btn = e.target.closest('.add-to-wishlist');
if (!btn) return;

const pid = btn.getAttribute('data-product-id');
const res = toggleWishlist(pid, btn);
if (!res.ok) return;

setWishlistButtonState(btn, res.wished);
toast(res.wished ? 'Added to wishlist' : 'Removed from wishlist');

// If we're on the wishlist page, refresh it live
if (document.getElementById('wishlistRoot')) {
  renderWishlist();
}
});

// Remove a single item on wishlist page
document.addEventListener('click', (e) => {
const btn = e.target.closest('.remove-wl');
if (!btn) return;

// Prefer id-based removal if available
const pid = btn.getAttribute('data-product-id');
if (pid) {
  removeWishlistById(pid);
} else {
  // fallback to index-based (your original behavior)
  const idx = Number(btn.getAttribute('data-index'));
  const items = readWishlist();
  if (Number.isInteger(idx) && idx >= 0 && idx < items.length) {
    items.splice(idx, 1);
    writeWishlist(items);
  }
}

renderWishlist();
syncWishlistButtons(document);
toast('Removed from wishlist');
});

// Clear all (optional hook if you add a "Clear All" button with id="clearWishlist")
document.getElementById('clearWishlist')?.addEventListener('click', () => {
writeWishlist([]);
renderWishlist();
syncWishlistButtons(document);
toast('Wishlist cleared');
});

// Initial sync + render
document.addEventListener('DOMContentLoaded', () => {
syncWishlistButtons(document);

try {
  const arr = readWishlist();
  if (arr.length > 0) {
    document.getElementById('wishlistEmpty')?.remove();
  }
} catch {}

renderWishlist();
});
