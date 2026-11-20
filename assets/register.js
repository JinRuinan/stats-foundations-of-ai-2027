/* Registration page behaviour: deadline handling + subject personalisation. */
(function () {
  "use strict";

  var form = document.getElementById("registration-form");
  if (!form) return;

  var status = document.getElementById("reg-status");
  var closed = document.getElementById("reg-closed");

  function formatDate(date) {
    try {
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch (error) {
      return date.toISOString().slice(0, 10);
    }
  }

  function applyDeadline() {
    var raw = (form.getAttribute("data-deadline") || "").trim();
    var deadline = raw ? new Date(raw) : null;
    if (!deadline || isNaN(deadline.getTime())) {
      if (status) {
        status.textContent = "Registration is open.";
        status.classList.remove("reg-status--closed");
      }
      form.hidden = false;
      if (closed) closed.hidden = true;
      return;
    }
    var now = new Date();
    if (now.getTime() > deadline.getTime()) {
      if (status) {
        status.textContent = "Registration closed on " + formatDate(deadline) + ".";
        status.classList.add("reg-status--closed");
      }
      form.hidden = true;
      if (closed) closed.hidden = false;
    } else {
      if (status) {
        status.textContent = "Registration is open until " + formatDate(deadline) + ".";
        status.classList.remove("reg-status--closed");
      }
      form.hidden = false;
      if (closed) closed.hidden = true;
    }
  }

  applyDeadline();
  // Exposed so deadline behaviour can be tested without changing the page.
  window.__applyRegistrationDeadline = applyDeadline;

  form.addEventListener("submit", function () {
    var subject = document.getElementById("reg-subject");
    var name = document.getElementById("reg-name");
    if (subject && name && name.value.trim()) {
      subject.value = "SF-AI 2027 registration — " + name.value.trim();
    }
  });
})();
