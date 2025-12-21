// script.js — mobile drawer + ALL dropdown menus (.menu) using event delegation
// Works across pages (GitHub Pages + local) and does NOT rely on specific IDs.

(() => {
  window.__SUBURBAN_NAV__ = true; // quick sanity flag you can check in console

  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- Mobile drawer ---------- */
  function wireDrawer() {
    const menuBtn = $("#menuBtn");
    const drawer = $("#drawer");
    if (!menuBtn || !drawer) return;

    const onEsc = (e) => { if (e.key === "Escape") close(); };
    const onOutside = (e) => {
      if (!drawer.contains(e.target) && e.target !== menuBtn) close();
    };

    function open() {
      drawer.style.display = "flex";
      menuBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");

      document.addEventListener("keydown", onEsc);
      setTimeout(() => document.addEventListener("click", onOutside), 0);

      // close when any link clicked
      drawer.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", close, { once: true })
      );
    }

    function close() {
      drawer.style.display = "none";
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");

      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onOutside);
    }

    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
  }

  /* ---------- Dropdown menus (.menu) ---------- */
  function closeAllMenus(exceptWrap = null) {
    document.querySelectorAll(".menu.open").forEach((wrap) => {
      if (exceptWrap && wrap === exceptWrap) return;
      wrap.classList.remove("open");
      const btn = wrap.querySelector(".menu-trigger");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function wireMenus() {
    // Close on outside click
    document.addEventListener("click", (e) => {
      const clickedWrap = e.target.closest(".menu");
      if (!clickedWrap) closeAllMenus(null);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMenus(null);
    });

    // Toggle on trigger click (works for account + sets + any future dropdown)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-trigger");
      if (!btn) return;

      const wrap = btn.closest(".menu");
      const list = wrap?.querySelector(".menu-list");
      if (!wrap || !list) return;

      e.preventDefault();
      e.stopPropagation();

      const isOpen = wrap.classList.contains("open");

      // close others, then toggle this
      closeAllMenus(wrap);
      if (isOpen) {
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        wrap.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        // ensure dropdown is above everything
        list.style.zIndex = list.style.zIndex || "9999";
      }
    });

    // Close when clicking an item inside a dropdown
    document.addEventListener("click", (e) => {
      const insideMenuItem = e.target.closest(".menu-list a, .menu-list button");
      if (!insideMenuItem) return;

      const wrap = insideMenuItem.closest(".menu");
      if (!wrap) return;

      wrap.classList.remove("open");
      const btn = wrap.querySelector(".menu-trigger");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- Init ---------- */
  function init() {
    wireDrawer();
    wireMenus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
