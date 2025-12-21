// script.js — drawer + dropdown menus (Sets + My Account), page-agnostic

(function () {
  // flag so you can confirm this file loaded
  window._SUBURBAN_NAV__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Mobile drawer ---------- */
  function wireDrawer() {
    const menuBtn = $("#menuBtn");
    const drawer = $("#drawer");
    if (!menuBtn || !drawer) return;

    const onEsc = (e) => { if (e.key === "Escape") close(); };
    const onOutside = (e) => { if (!drawer.contains(e.target) && e.target !== menuBtn) close(); };

    function open() {
      drawer.style.display = "flex";
      menuBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", onEsc);
      setTimeout(() => document.addEventListener("click", onOutside), 0);
      $$("#drawer a").forEach(a => a.addEventListener("click", close, { once: true }));
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

  /* ---------- Dropdown menus (generic: Sets + Account) ---------- */
  function wireDropdownMenus() {
    // any: <div class="menu ..."><button class="menu-trigger">...<div class="menu-list">...</div></div>
    const menus = $$(".menu");
    if (!menus.length) return;

    const closeAll = () => {
      menus.forEach((wrap) => {
        wrap.classList.remove("open");
        const btn = wrap.querySelector(".menu-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    };

    // Close when clicking outside / Esc
    document.addEventListener("click", (e) => {
      // if click is inside ANY menu, do nothing (button handler will toggle)
      if (e.target.closest(".menu")) return;
      closeAll();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });

    menus.forEach((wrap) => {
      const btn = wrap.querySelector(".menu-trigger");
      const list = wrap.querySelector(".menu-list");
      if (!btn || !list) return;

      // ensure dropdown can appear above other content
      list.style.zIndex = list.style.zIndex || "9999";

      const toggle = () => {
        const isOpen = wrap.classList.contains("open");
        closeAll();
        if (!isOpen) {
          wrap.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      };

      // Click to toggle
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      });

      // Keyboard support
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });

      // Close after choosing an item
      $$(".menu-list a, .menu-list button", wrap).forEach((el) => {
        el.addEventListener("click", () => {
          wrap.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireDrawer();
    wireDropdownMenus();
  });
})();
