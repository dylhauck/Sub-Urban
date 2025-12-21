// script.js — drawer + dropdowns (My Account + Sets) using event delegation
(() => {
  // simple helper
  const $ = (sel, root = document) => root.querySelector(sel);

  // mark as loaded (your check)
  window._SUBURBAN_NAV__ = true;

  // ---------- Drawer ----------
  function initDrawer() {
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
      if (drawer.style.display !== "flex") return;
      if (!drawer.contains(e.target) && e.target !== menuBtn) close();
    }, true);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // close when a drawer link is clicked
    drawer.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) close();
    });
  }

  // ---------- Dropdowns (ALL .menu dropdowns) ----------
  function closeAllMenus(exceptMenu = null) {
    document.querySelectorAll(".menu.open").forEach((m) => {
      if (exceptMenu && m === exceptMenu) return;
      m.classList.remove("open");
      const btn = m.querySelector(".menu-trigger");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function initDropdowns() {
    // Click anywhere
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".menu-trigger");
      const menu = e.target.closest(".menu");

      // clicking a trigger
      if (trigger && menu) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = menu.classList.contains("open");
        closeAllMenus(menu);
        menu.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", (!isOpen).toString());
        return;
      }

      // clicking inside an open menu item closes it
      const menuItem = e.target.closest(".menu.open .menu-list a, .menu.open .menu-list button");
      if (menuItem) {
        const openMenu = e.target.closest(".menu.open");
        if (openMenu) {
          openMenu.classList.remove("open");
          const btn = openMenu.querySelector(".menu-trigger");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
        return;
      }

      // clicking outside closes all
      closeAllMenus(null);
    });

    // Esc closes dropdowns
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMenus(null);
    });
  }

  // Init immediately (works with defer on every page)
  initDrawer();
  initDropdowns();
})();
