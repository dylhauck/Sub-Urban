// script.js — nav drawer + dropdowns (defensive, page-agnostic)

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function wireDrawer() {
    const menuBtn = $("#menuBtn");
    const drawer  = $("#drawer");
    if (!menuBtn || !drawer) return;

    const open = () => {
      drawer.style.display = "flex";
      menuBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", onEsc);
      // close when any link clicked
      $$("#drawer a").forEach(a => a.addEventListener("click", close, { once: true }));
      // close on outside click (mobile full width, but keep it consistent)
      setTimeout(() => document.addEventListener("click", onOutside), 0);
    };
    const close = () => {
      drawer.style.display = "none";
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onOutside);
    };
    const onEsc = (e) => { if (e.key === "Escape") close(); };
    const onOutside = (e) => { if (!drawer.contains(e.target) && e.target !== menuBtn) close(); };

    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
      e.stopPropagation();
    });
  }

  // Generic dropdown wiring (used for My Account + Sets)
  function wireDropdown({ wrapSel, btnSel, listSel, closeOnClickSel }) {
    const wrap = $(wrapSel);   // <div class="menu ...">
    const btn  = $(btnSel);    // <button ...>
    const list = $(listSel);   // <div class="menu-list ...">

    if (!wrap || !btn || !list) return;

    // Ensure the menu renders above content
    list.style.zIndex = list.style.zIndex || "60";

    const open = () => {
      // Close any other open dropdowns first
      $$(".menu.open").forEach(m => { if (m !== wrap) m.classList.remove("open"); });

      wrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      document.addEventListener("click", onOutside);
      document.addEventListener("keydown", onEsc);
    };

    const close = () => {
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", onOutside);
      document.removeEventListener("keydown", onEsc);
    };

    const onOutside = (e) => { if (!wrap.contains(e.target)) close(); };
    const onEsc = (e) => { if (e.key === "Escape") close(); };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = wrap.classList.contains("open");
      isOpen ? close() : open();
    });

    // Keyboard support: open on Enter/Space when focused
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const isOpen = wrap.classList.contains("open");
        isOpen ? close() : open();
      }
    });

    // Optional: close when clicking a menu item
    if (closeOnClickSel) {
      $$(closeOnClickSel).forEach(el => el.addEventListener("click", () => close()));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireDrawer();

    // My Account dropdown (existing)
    wireDropdown({
      wrapSel: ".account-menu",
      btnSel: "#acctMenuBtn",
      listSel: "#acctMenu",
      closeOnClickSel: "#acctMenu a, #acctMenu .menu-link-btn"
    });

    // Sets dropdown (new)
    wireDropdown({
      wrapSel: ".sets-menu",
      btnSel: "#setsMenuBtn",
      listSel: "#setsMenu",
      closeOnClickSel: "#setsMenu a"
    });
  });
})();
