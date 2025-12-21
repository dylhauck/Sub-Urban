// script.js — nav drawer + dropdowns (Account + Sets) — page-agnostic

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

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

      // close when any link clicked
      $$("#drawer a").forEach(a => a.addEventListener("click", close, { once: true }));

      // IMPORTANT: delay outside listener so it doesn't instantly close on the same click
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
      e.stopPropagation(); // IMPORTANT
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
  }

  // Generic dropdown wiring (works for Account + Sets)
  function wireDropdown(wrapSel, btnSel, listSel) {
    const wrap = $(wrapSel);
    const btn  = $(btnSel);
    const list = $(listSel);
    if (!wrap || !btn || !list) return;

    list.style.zIndex = list.style.zIndex || "60";

    let outsideBound = false;

    const onOutside = (e) => {
      if (!wrap.contains(e.target)) close();
    };
    const onEsc = (e) => {
      if (e.key === "Escape") close();
    };

    function open() {
      wrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");

      // IMPORTANT: delay binding so the opening click can't immediately close it
      if (!outsideBound) {
        outsideBound = true;
        setTimeout(() => document.addEventListener("click", onOutside), 0);
      }
      document.addEventListener("keydown", onEsc);
    }

    function close() {
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", onOutside);
      document.removeEventListener("keydown", onEsc);
      outsideBound = false;
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // IMPORTANT
      wrap.classList.contains("open") ? close() : open();
    });

    // Prevent clicks inside the dropdown from bubbling to document and closing it
    list.addEventListener("click", (e) => e.stopPropagation());

    // Close after choosing an item
    $$(`${listSel} a, ${listSel} .menu-link-btn`).forEach(el => {
      el.addEventListener("click", () => close());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireDrawer();

    // My Account
    wireDropdown(".account-menu", "#acctMenuBtn", "#acctMenu");

    // Sets
    wireDropdown(".sets-menu", "#setsMenuBtn", "#setsMenu");
  });
})();
