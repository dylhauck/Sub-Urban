// script.js — site-wide UI bits (drawer, footer year, toasts, images, PDP gallery, account dropdown)

// ----- Mobile drawer -----
const menuBtn = document.getElementById('menuBtn');
const drawer  = document.getElementById('drawer');
menuBtn?.addEventListener('click', () => {
  const open = drawer?.style.display === 'flex';
  if (!drawer) return;
  drawer.style.display = open ? 'none' : 'flex';
  menuBtn.setAttribute('aria-expanded', String(!open));
  drawer.setAttribute('aria-hidden', String(open));
});

// Close drawer when clicking outside (mobile)
document.addEventListener('click', (e)=>{
  if (!drawer || !menuBtn) return;
  const isInside = drawer.contains(e.target) || e.target === menuBtn;
  if (!isInside && drawer.style.display === 'flex'){
    drawer.style.display = 'none';
    menuBtn.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
  }
});

// ----- Footer year -----
document.getElementById('year')?.append(new Date().getFullYear());

// ----- Toast helper -----
function showToast(msg='Added to bag'){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.style.opacity = 1;
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(()=>{ t.style.opacity = 0; t.style.transform = 'translateX(-50%) translateY(20px)' }, 1600);
}
document.getElementById('addToBag')?.addEventListener('click', e => { e.preventDefault(); showToast(); });

// ----- Size guide modal (PDP) -----
document.getElementById('sizeGuideBtn')?.addEventListener('click', () => {
  document.getElementById('sizeGuide')?.showModal();
});

// ----- Universal image fallback -----
const PLACEHOLDER = 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop';
document.querySelectorAll('img').forEach(img=>{
  img.onerror = () => { if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER; };
});

// ----- PDP color/size → gallery (only runs on product.html safely) -----
const images = {
  'soft-pink': { default: [
    'https://images.unsplash.com/photo-1520974735194-98f3c7a4bafc?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531910961019-5f9b8778f3b9?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop'
  ]},
  'rose-gold': { default: [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551041101-dc05d4f8c927?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508856080171-0f4f66f78e4e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop'
  ]},
  'violet': { default: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520974735194-98f3c7a4bafc?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542897646-1f27e1b3802a?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531907700752-62799b2a3e3b?q=80&w=1600&auto=format&fit=crop'
  ]},
  'teal': { default: [
    'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542897646-1f27e1b3802a?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1600&auto=format&fit=crop'
  ]},
  'silver': { default: [
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542897646-1f27e1b3802a?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520974735194-98f3c7a4bafc?q=80&w=1600&auto=format&fit=crop'
  ]}
};

let currentColor = 'violet';
let currentSize  = 'XS';

const colorWrap = document.getElementById('colorSwatches');
const sizeWrap  = document.getElementById('sizes');
const mainImage = document.getElementById('mainImage');
const thumbsEl  = document.getElementById('thumbs');

colorWrap?.addEventListener('click', (e) => {
  const btn = e.target.closest('.swatch');
  if(!btn) return;
  currentColor = btn.dataset.key;
  updateGallery();
});
sizeWrap?.addEventListener('change', (e) => {
  if(e.target.name === 'size'){ currentSize = e.target.value; updateGallery(false); }
});

function bindThumbClicks(){
  document.querySelectorAll('.thumb').forEach(b=>{
    b.onclick = () => { mainImage.src = b.dataset.src; };
  });
}
function updateGallery(scrollTop=true){
  if(!mainImage || !thumbsEl) return;
  const list = images[currentColor] || images['violet'];
  const set  = (list[currentSize] && list[currentSize].length) ? list[currentSize] : list.default;
  thumbsEl.innerHTML = set.slice(0,6).map(url =>
    `<button class="thumb" aria-label="alt image" data-src="${url}">
       <img src="${url.replace('w=1600','w=400')}" alt="">
     </button>`
  ).join('');
  mainImage.src = set[0];
  bindThumbClicks();
  if(scrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Init safely (only runs on PDP if elements exist)
if(mainImage){ updateGallery(false); }

// ----- Account dropdown open/close (desktop) -----
const acctBtn  = document.getElementById('acctMenuBtn');
const acctMenu = document.querySelector('.account-menu');
document.addEventListener('click', (e)=>{
  if (!acctBtn || !acctMenu) return;
  const open = acctMenu.classList.contains('open');
  if (e.target === acctBtn){
    acctMenu.classList.toggle('open');
    acctBtn.setAttribute('aria-expanded', String(!open));
  } else if (!acctMenu.contains(e.target)){
    acctMenu.classList.remove('open');
    acctBtn.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape' && acctMenu?.classList.contains('open')){
    acctMenu.classList.remove('open');
    acctBtn?.setAttribute('aria-expanded', 'false');
  }
});
