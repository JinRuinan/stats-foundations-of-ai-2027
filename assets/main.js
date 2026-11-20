/* ==========================================================================
   Statistical Foundations of AI — site interactions
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stillMode = /[?&](still|static)=1/.test(window.location.search);

  // Reveal animations are opt-in via JS so the page remains fully readable
  // when scripting is unavailable (or when capturing static screenshots).
  if (!stillMode && !reduceMotion) {
    document.documentElement.classList.add("js-anim");
  }

  /* ---------------------------------------------------------------------
     Header: solid background after scrolling past the top of the hero
     --------------------------------------------------------------------- */
  var header = document.getElementById("site-header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeNav();
      else openNav();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) closeNav();
    });
  }

  /* ---------------------------------------------------------------------
     Countdown to the workshop (09:00 Abu Dhabi time, 6 January 2027)
     --------------------------------------------------------------------- */
  var countdown = document.getElementById("countdown");
  var target = new Date("2027-01-06T09:00:00+04:00");

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function tick() {
    if (!countdown) return;
    var now = new Date();
    var diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      countdown.hidden = true;
      return;
    }

    var units = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };

    Object.keys(units).forEach(function (key) {
      var el = countdown.querySelector('[data-unit="' + key + '"]');
      if (!el) return;
      el.textContent = key === "days" ? String(units[key]) : pad(units[key]);
    });
  }

  if (countdown && target.getTime() > Date.now()) {
    countdown.hidden = false;
    tick();
    window.setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------
     Reveal elements as they scroll into view
     --------------------------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    // Stagger items that share a parent so groups animate in sequence.
    var groups = new Map();
    revealItems.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach(function (items) {
      items.forEach(function (el, index) {
        el.style.transitionDelay = Math.min(index * 55, 330) + "ms";
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Copy email button
     --------------------------------------------------------------------- */
  var copyButton = document.querySelector(".copy-email");

  if (copyButton) {
    var hint = copyButton.querySelector(".copy-email__hint");
    var email = copyButton.getAttribute("data-email") || "";
    var defaultHint = hint ? hint.textContent : "Copy";

    function flashHint(text) {
      if (!hint) return;
      hint.textContent = text;
      window.setTimeout(function () { hint.textContent = defaultHint; }, 1800);
    }

    copyButton.addEventListener("click", function () {
      var done = function () { flashHint("Copied"); };
      var failed = function () { flashHint(email); };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, failed);
      } else {
        var textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          done();
        } catch (error) {
          failed();
        }
        document.body.removeChild(textarea);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
