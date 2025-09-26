// Mobile drawer
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
menuBtn?.addEventListener('click', () => {
  const open = drawer.style.display === 'flex';
  drawer.style.display = open ? 'none' : 'flex';
  menuBtn.setAttribute('aria-expanded', String(!open));
  drawer.setAttribute('aria-hidden', String(open));
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Demo toast (wire this to add-to-cart if you add e-commerce)
function showToast(msg='Added to bag'){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = 1;
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(()=>{
    t.style.opacity = 0;
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 1600);
}
// Example: document.querySelectorAll('.card .primary').forEach(b=>b.addEventListener('click', e=>{ e.preventDefault(); showToast(); }));
