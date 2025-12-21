// script.js — drawer + dropdowns (Sets + My Account) using event delegation
(function () {
  // Guard so it can't wire twice if the script is accidentally included twice
  if (window._SUBURBAN_NAV_WIRED) return;
  window._SUBURBAN_NAV_WIRED = true;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function closeAllMenus(exceptWrap = null) {
    $$(".menu.open").forEach(wrap => {
      if (exceptWrap && wrap === exceptWrap) return;
      wrap.classList.remove("open");
      const btn = wrap.querySelector(".menu-trigger");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function toggleMenuByButton(btn) {
    const wrap = btn.closest(".menu");
    if (!wrap) return;

    const isOpen = wrap.classList.contains("open");
    closeAllMenus(wrap);

    wrap.classList.toggle("open", !isOpen);
    btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
  }

  function wireDrawer() {
    const menuBtn = $("#menuBtn");
    const drawer = $("#drawer");
    if (!menuBtn || !drawer) return;

    const open = () => {
      drawer.style.display = "flex";
      menuBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      drawer.style.display = "none";
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
    };

    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });

    document.addEventListener("click", (e) => {
      if (!drawer.contains(e.target) && e.target !== menuBtn) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Delegated click handler for dropdowns (works on every page)
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("#acctMenuBtn, #setsMenuBtn, .menu-trigger");
      if (btn) {
        // Only handle buttons that live inside a .menu wrapper
        if (!btn.closest(".menu")) return;
        e.preventDefault();
        e.stopPropagation();
        toggleMenuByButton(btn);
        return;
      }

      // Click outside any menu => close
      if (!e.target.closest(".menu")) closeAllMenus();
    },
    true // capture phase so nothing else can block it
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllMenus();
  });

  document.addEventListener("DOMContentLoaded", () => {
    wireDrawer();

    // Safety: ensure menus start closed
    closeAllMenus();

    // Expose quick debug you can run in console
    window._SUBURBAN_NAV__ = {
      wired: true,
      closeAll: () => closeAllMenus(),
      toggleAccount: () => {
        const btn = $("#acctMenuBtn");
        if (btn) toggleMenuByButton(btn);
      },
      toggleSets: () => {
        const btn = $("#setsMenuBtn");
        if (btn) toggleMenuByButton(btn);
      },
    };
  });
})();

const contactForm = document.getElementById('.contact-form');
const successMsg = document.getElementById('contactSuccess');

if (contactForm && successMsg) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const sendBtn = document.getElementById('sendBtn');

    successMsg.hidden = false;

    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = 'Message sent';
      sendBtn.style.opacity = '0.6';
      sendBtn.style.cursor = 'not-allowed';
    }

    contactForm.reset();
  });
}
