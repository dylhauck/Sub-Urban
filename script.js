// script.js — nav drawer + dropdowns (defensive, page-agnostic)

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- Drawer (mobile) ---------------- */
  function wireDrawer() {
    const menuBtn = $("#menuBtn");
    const drawer = $("#drawer");
    if (!menuBtn || !drawer) return;

    const onEsc = (e) => { if (e.key === "Escape") close(); };
    const onOutside = (e) => { if (!drawer.contains(e.target) && e.target !== menuBtn) close(); };

    const open = () => {
      drawer.style.display = "flex";
      menuBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", onEsc);

      // close when any link clicked
      $$("#drawer a").forEach(a => a.addEventListener("click", close, { once: true }));

      // close on outside click
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

  /* ------------- Generic dropdown helper ------------- */
  function wireDropdown(wrapSelector, btnSelector, listSelector) {
    const wraps = document.querySelectorAll(wrapSelector);
    if (!wraps.length) return;

    wraps.forEach((wrap) => {
      const btn = wrap.querySelector(btnSelector);
      const list = wrap.querySelector(listSelector);
      if (!btn || !list) return;

      // ensure above other content
      list.style.zIndex = list.style.zIndex || "60";

      const open = () => {
        wrap.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      };

      const close = () => {
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      };

      const toggle = () => {
        wrap.classList.contains("open") ? close() : open();
      };

      // click toggle
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      });

      // keyboard toggle
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });

      // close outside
      document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) close();
      });

      // close on Esc
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });

      // close when selecting an item
      wrap.querySelectorAll("a, .menu-link-btn").forEach((el) => {
        el.addEventListener("click", () => close());
      });
    });
  }

  /* ---------------- Dropdowns ---------------- */
  function wireAccountMenu() {
    // <div class="menu account-menu"> ... <button class="menu-trigger" ...> ... <div class="menu-list" ...>
    wireDropdown(".account-menu", ".menu-trigger", ".menu-list");
  }

  function wireSetsMenu() {
    // <div class="menu sets-menu"> ... <button class="menu-trigger" ...> ... <div class="menu-list" ...>
    wireDropdown(".sets-menu", ".menu-trigger", ".menu-list");
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireDrawer();
    wireAccountMenu();
    wireSetsMenu();
  });
})();
