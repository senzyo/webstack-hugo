(function () {
  "use strict";

  var sidebar = document.querySelector(".sidebar-menu");
  var mainMenu = document.querySelector(".main-menu");
  var sidebarInner = document.querySelector(".sidebar-menu-inner");
  var scrollIndicator = null;

  function isCollapsed() {
    return sidebar && sidebar.classList.contains("collapsed");
  }

  function clearSubMenuStyles() {
    if (!mainMenu) return;
    mainMenu.querySelectorAll(".has-submenu").forEach(function (li) {
      li.classList.remove("expanded");
      var ul = li.querySelector(":scope > ul");
      if (ul) {
        ul.style.display = "";
        ul.style.height = "";
        ul.style.overflow = "";
        ul.style.transition = "";
        ul.style.top = "";
      }
    });
  }

  function expandSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("collapsed");
    if (sidebarInner) sidebarInner.style.overflowY = "auto";
    if (mainMenu) {
      mainMenu.querySelectorAll(".has-submenu").forEach(function (li) {
        var ul = li.querySelector(":scope > ul");
        if (ul) {
          ul.style.top = "";
          ul.style.display = "";
        }
      });
    }
    updateScrollIndicator();
  }

  function collapseSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("collapsed");
    if (sidebarInner) sidebarInner.style.overflowY = "";
    clearSubMenuStyles();
    updateScrollIndicator();
  }

  function setupMainMenu() {
    if (!mainMenu) return;
    var items = mainMenu.querySelectorAll("li");
    items.forEach(function (li) {
      var ul = li.querySelector(":scope > ul");
      if (ul) {
        li.classList.add("has-submenu");
        var a = li.querySelector(":scope > a");
        if (a) {
          a.addEventListener("click", function (e) {
            e.preventDefault();
            if (li.classList.contains("expanded")) {
              collapseItem(li);
            } else {
              expandItem(li);
            }
          });
        }
        li.addEventListener("mouseenter", function () {
          if (isCollapsed()) {
            ul.style.display = "";
            positionFlyout(ul, li);
          }
        });
        li.addEventListener("mouseleave", function () {
          if (isCollapsed()) {
            ul.style.top = "";
          }
        });
        li.addEventListener("focusin", function () {
          if (isCollapsed()) {
            positionFlyout(ul, li);
          }
        });
      }
    });
  }

  function expandItem(li) {
    if (isCollapsed()) return;
    var ul = li.querySelector(":scope > ul");
    if (!ul) return;

    if (sidebar && sidebar.classList.contains("toggle-others")) {
      var siblings = li.parentNode.querySelectorAll(
        ":scope > .has-submenu.expanded",
      );
      siblings.forEach(function (s) {
        if (s !== li) collapseItem(s);
      });
    }

    li.classList.add("expanded");
    ul.style.display = "block";
    var targetHeight = ul.scrollHeight;
    ul.style.height = "0";
    ul.style.overflow = "hidden";
    ul.style.transition = "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    requestAnimationFrame(function () {
      ul.style.height = targetHeight + "px";
    });
    ul.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "height") return;
      ul.style.height = "";
      ul.style.overflow = "";
      ul.style.transition = "";
      ul.removeEventListener("transitionend", handler);
    });
  }

  function collapseItem(li) {
    var ul = li.querySelector(":scope > ul");
    if (!ul) return;
    li.classList.remove("expanded");
    ul.style.overflow = "hidden";
    ul.style.transition = "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    ul.style.height = ul.scrollHeight + "px";
    requestAnimationFrame(function () {
      ul.style.height = "0";
    });
    ul.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "height") return;
      ul.style.display = "none";
      ul.style.height = "";
      ul.style.overflow = "";
      ul.style.transition = "";
      ul.removeEventListener("transitionend", handler);
    });
  }

  function positionFlyout(ul, li) {
    var top = li.getBoundingClientRect().top;
    var flyoutHeight = ul.offsetHeight;
    if (flyoutHeight > 0) {
      var maxTop = window.innerHeight - flyoutHeight - 8;
      if (top > maxTop) top = Math.max(0, maxTop);
    }
    ul.style.top = top + "px";
  }

  // sidebar toggle (collapse/expand)
  var sidebarToggle = document.querySelector(
    '.top-nav-menu .desktop-only a[data-action="toggle-sidebar"]',
  );
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function (e) {
      e.preventDefault();
      if (isCollapsed()) {
        expandSidebar();
      } else {
        collapseSidebar();
      }
    });
  }

  // mobile menu toggle
  var mobileToggle = document.querySelector(
    'a[data-action="toggle-mobile-menu"]',
  );
  if (mobileToggle) {
    mobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      mainMenu.classList.toggle("menu-open");
    });
  }

  // smooth scroll
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a.scroll-link");
    if (!link) return;
    e.preventDefault();
    var target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    var offset = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: offset, behavior: "smooth" });

    // highlight active menu item + close mobile menu
    if (mainMenu) {
      mainMenu.querySelectorAll("li.active").forEach(function (li) {
        li.classList.remove("active");
      });
      var parentLi = link.closest("li");
      if (parentLi) parentLi.classList.add("active");
      // collapsed desktop: retract the flyout immediately after a click,
      // otherwise :focus-within / :hover keep it open
      if (isCollapsed()) {
        var topLi = link.closest(".main-menu > li");
        var flyout = topLi && topLi.querySelector(":scope > ul");
        if (flyout) flyout.style.display = "none";
        link.blur();
      }
      mainMenu.classList.remove("menu-open");
    }
  });

  // blur external links after click (prevents :focus-visible residue on touch)
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[target="_blank"]');
    if (a) a.blur();
  });

  // go to top
  var goTop = document.querySelector('a[rel="go-top"]');
  if (goTop) {
    goTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // go to bottom
  var goBottom = document.querySelector('a[rel="go-bottom"]');
  if (goBottom) {
    goBottom.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  // theme toggle
  var themeToggle = document.querySelector('a[rel="theme-toggle"]');
  if (themeToggle) {
    var themeIcon = themeToggle.querySelector("i.icon");
    var setThemeIcon = function (isDark) {
      if (!themeIcon) return;
      themeIcon.className = isDark
        ? "fa-solid fa-sun icon"
        : "fa-solid fa-moon icon";
    };
    setThemeIcon(document.body.classList.contains("black"));
    var applyTheme = function () {
      var isDark = document.body.classList.contains("black");
      if (isDark) {
        document.body.classList.remove("black");
        localStorage.setItem("theme", "light");
        setThemeIcon(false);
      } else {
        document.body.classList.add("black");
        localStorage.setItem("theme", "dark");
        setThemeIcon(true);
      }
    };
    themeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        applyTheme();
        return;
      }
      if (!document.startViewTransition) {
        document.body.classList.add("theme-transition");
        applyTheme();
        setTimeout(function () {
          document.body.classList.remove("theme-transition");
        }, 400);
        return;
      }
      var rect = themeToggle.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      var root = document.documentElement;
      root.style.setProperty("--vt-x", x + "px");
      root.style.setProperty("--vt-y", y + "px");
      root.style.setProperty("--vt-r", maxRadius + "px");
      document.startViewTransition(applyTheme).finished.finally(function () {
        root.style.removeProperty("--vt-x");
        root.style.removeProperty("--vt-y");
        root.style.removeProperty("--vt-r");
      });
    });
  }

  // auto collapse/expand sidebar across mobile / narrow-desktop / wide-desktop zones
  function getZone(width) {
    if (width < 768) return "mobile";
    if (width < 1024) return "narrow-desktop";
    return "wide-desktop";
  }

  var lastZone = null;
  window.addEventListener("resize", function () {
    var zone = getZone(window.innerWidth);
    if (zone === lastZone) return;
    lastZone = zone;
    if (zone === "narrow-desktop") {
      collapseSidebar();
    } else if (zone === "wide-desktop") {
      expandSidebar();
    } else {
      if (isCollapsed()) expandSidebar();
    }
  });

  // search engine selection + form submit
  var searchInputs = document.querySelectorAll(
    '#search-list input[type="radio"]',
  );
  var searchForm = document.getElementById("super-search-fm");
  var searchText = document.getElementById("search-text");
  var searchGroups = document.querySelectorAll(".search-type");

  if (searchInputs.length && searchForm) {
    var defaultEngine = localStorage.getItem("searchType");

    function saveEngine(val) {
      try {
        localStorage.setItem("searchType", val);
      } catch (e) {}
    }

    function setEngine() {
      var engVal = defaultEngine || (searchInputs[0] && searchInputs[0].value);
      for (var i = 0; i < searchInputs.length; i++) {
        if (searchInputs[i].value === engVal) {
          searchInputs[i].checked = true;
          break;
        }
      }
      if (
        !document.querySelector("#search-list input:checked") &&
        searchInputs[0]
      ) {
        searchInputs[0].checked = true;
      }
    }

    function updateActive(radio) {
      for (var i = 0; i < searchGroups.length; i++) {
        searchGroups[i].classList.remove("search-type-active");
      }
      radio.closest(".search-type").classList.add("search-type-active");
    }

    function onEngineChange(e) {
      var radio = e.target;
      saveEngine(radio.value);
      updateActive(radio);
      searchText.focus();
    }

    for (var i = 0; i < searchInputs.length; i++) {
      searchInputs[i].addEventListener("change", onEngineChange);
    }

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!searchText.value.trim()) {
        searchText.focus();
        return;
      }
      var checked = document.querySelector(
        '#search-list input[type="radio"]:checked',
      );
      var url =
        (checked ? checked.value : "") + encodeURIComponent(searchText.value);
      window.open(url, "_blank");
      searchText.value = "";
    });

    setEngine();
  }

  init();

  function init() {
    setupMainMenu();
    if (sidebarInner) {
      sidebarInner.style.overflowY = "auto";
    }
    setupScrollIndicator();
    requestAnimationFrame(function () {
      var zone = getZone(window.innerWidth);
      lastZone = zone;
      if (zone === "narrow-desktop" && !isCollapsed()) {
        collapseSidebar();
      }
    });
  }

  function setupScrollIndicator() {
    if (!sidebar || !sidebarInner) return;
    scrollIndicator = document.createElement("div");
    scrollIndicator.className = "sidebar-scroll-indicator";
    scrollIndicator.style.display = "none";
    sidebar.appendChild(scrollIndicator);
    sidebarInner.addEventListener("scroll", updateScrollIndicator);
    window.addEventListener("resize", updateScrollIndicator);
  }

  function updateScrollIndicator() {
    if (!scrollIndicator || !sidebarInner) return;
    var sh = sidebarInner.scrollHeight;
    var ch = sidebarInner.clientHeight;
    if (sh <= ch) {
      scrollIndicator.style.display = "none";
      return;
    }
    scrollIndicator.style.display = "";
    var h = (ch / sh) * ch;
    scrollIndicator.style.height = Math.max(h, 20) + "px";
    scrollIndicator.style.top = (sidebarInner.scrollTop / sh) * ch + "px";
  }
})();
