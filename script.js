// script.js — nav drawer + ALL dropdown menus (.menu) (page-agnostic, no ID dependency)
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- Drawer ---------------- */
  function wireDrawer() {
    const menuBtn = $("#menuBtn");
    const drawer = $("#drawer");
    if (!menuBtn || !drawer) return;

    const onEsc = (e) => { if (e.key === "Escape") close(); };
    const onOutside = (e) => {
      if (!drawer.contains(e.target) && e.target !== menuBtn) close();
    };

    const open = () => {
      drawer.style.display = "flex";
      menuBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", onEsc);
      $$("#drawer a").forEach(a => a.addEventListener("click", close, { once: true }));
      setTimeout(() => document.addEventListener("click", onOutside), 0);
    };

    const close = () => {
      drawer.style.display = "none";
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onOutside);
    };

    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
  }

  /* ---------------- Dropdown Menus (My Account, Sets, etc.) ---------------- */
  function wireMenus() {
    const menus = $$(".menu");
    if (!menus.length) return;

    const closeAll = () => {
      menus.forEach(m => {
        m.classList.remove("open");
        const btn = m.querySelector(".menu-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    };

    // Close when clicking anywhere outside any menu
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".menu")) closeAll();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });

    menus.forEach((wrap) => {
      const btn = wrap.querySelector(".menu-trigger");
      const list = wrap.querySelector(".menu-list");
      if (!btn || !list) return;

      // keep above content
      list.style.zIndex = list.style.zIndex || "60";

      const toggle = () => {
        const isOpen = wrap.classList.contains("open");
        closeAll(); // only one open at a time
        if (!isOpen) {
          wrap.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      };

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      });

      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });

      // Close when clicking a menu item
      $$(".menu-list a, .menu-list .menu-link-btn", wrap).forEach((el) => {
        el.addEventListener("click", () => {
          wrap.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireDrawer();
    wireMenus();
  });
})();
