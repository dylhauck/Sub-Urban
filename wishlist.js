// wishlist.js — render/manage wishlist stored in localStorage
// Uses the same key as index.html and product.html
const WL_KEY = 'wishlist_local';

/* ---------- Helpers ---------- */
function readWishlist() {
  try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); }
  catch { return []; }
}
function writeWishlist(items) {
  try { localStorage.setItem(WL_KEY, JSON.stringify(items)); }
  catch {}
}
function currency(v) { return `$${Number(v).toFixed(0)}`; }

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

/* ---------- Rendering ---------- */
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
          <button class="btn ghost remove-wl" data-index="${idx}" type="button">Remove</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  root.appendChild(grid);
}

/* ---------- Events ---------- */
// Remove a single item
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-wl');
  if (!btn) return;

  const idx = Number(btn.getAttribute('data-index'));
  const items = readWishlist();
  if (Number.isInteger(idx) && idx >= 0 && idx < items.length) {
    items.splice(idx, 1);
    writeWishlist(items);
    renderWishlist();
    toast('Removed from wishlist');
  }
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  // If wishlistEmpty placeholder exists from HTML, remove it when items are present
  try {
    const arr = readWishlist();
    if (arr.length > 0) {
      document.getElementById('wishlistEmpty')?.remove();
    }
  } catch {}
  renderWishlist();
});
