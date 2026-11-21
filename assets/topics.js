/* Hover/focus descriptions for the six topic cards. */
(function () {
  "use strict";

  var popover = document.getElementById("topic-popover");
  if (!popover) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-topic]"));
  if (!cards.length) return;

  var titleEl = popover.querySelector(".topic-popover__title");
  var textEl = popover.querySelector(".topic-popover__text");
  var linkEl = popover.querySelector(".topic-popover__link");
  var linkLabelEl = popover.querySelector(".topic-popover__link-label");
  var hideTimer = null;
  var current = null;

  function position(card) {
    var rect = card.getBoundingClientRect();
    var width = popover.offsetWidth;
    var height = popover.offsetHeight;
    var left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(12, Math.min(window.innerWidth - width - 12, left));
    var top = rect.bottom + 12;
    if (top + height > window.innerHeight - 12 && rect.top - height - 12 > 12) {
      top = rect.top - height - 12;
    }
    top = Math.max(12, Math.min(window.innerHeight - height - 12, top));
    popover.style.left = Math.round(left) + "px";
    popover.style.top = Math.round(top) + "px";
  }

  function fill(card) {
    titleEl.textContent = card.getAttribute("data-title") || "";
    textEl.textContent = card.getAttribute("data-text") || "";
    linkEl.href = card.getAttribute("data-link") || "#";
    linkLabelEl.textContent = card.getAttribute("data-link-label") || "Selected reading";
  }

  function show(card) {
    window.clearTimeout(hideTimer);
    current = card;
    fill(card);
    popover.hidden = false;
    popover.setAttribute("aria-hidden", "false");
    position(card);
    window.requestAnimationFrame(function () {
      popover.classList.add("is-visible");
    });
  }

  function hide() {
    popover.classList.remove("is-visible");
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(function () {
      if (popover.classList.contains("is-visible")) return;
      popover.hidden = true;
      popover.setAttribute("aria-hidden", "true");
      current = null;
    }, 170);
  }

  function scheduleHide() {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, 180);
  }

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () { show(card); });
    card.addEventListener("mouseleave", scheduleHide);
    card.addEventListener("focusin", function () { show(card); });
    card.addEventListener("focusout", scheduleHide);
  });

  popover.addEventListener("mouseenter", function () { window.clearTimeout(hideTimer); });
  popover.addEventListener("mouseleave", scheduleHide);

  window.addEventListener("scroll", function () {
    if (!popover.hidden) hide();
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (!popover.hidden && current) position(current);
  });
})();
