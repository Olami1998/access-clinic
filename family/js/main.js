const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  const closedLabel = toggle.textContent.trim();
  const openLabel = closedLabel === "Menú" ? "Cerrar" : "Close";
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? openLabel : closedLabel;
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

const backLinks = document.querySelectorAll("[data-lang-return]");
if (backLinks.length) {
  const returns = {
    hub: "../index.html",
    family: "index.html",
    "family-services": "services.html",
    "family-about": "about.html",
    "family-patients": "patients.html",
    "family-contact": "contact.html",
    combined: "../combined/index.html",
    "combined-family": "../combined/family.html",
    "combined-about": "../combined/about.html",
  };
  const key = new URLSearchParams(location.search).get("from");
  const dest = Object.prototype.hasOwnProperty.call(returns, key) ? returns[key] : "index.html";
  backLinks.forEach((link) => {
    link.href = dest;
  });
}

const status = document.querySelector("[data-open-state]");
if (status) {
  const schedule = {
    Mon: [9 * 60, 17 * 60 + 30],
    Tue: [9 * 60, 17 * 60 + 30],
    Wed: [9 * 60, 17 * 60 + 30],
    Thu: [10 * 60, 18 * 60],
    Fri: [9 * 60, 17 * 60 + 30],
  };
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value])
  );
  const weekday = parts.weekday;
  const day = Number(parts.day);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  if (weekday && Number.isFinite(minutes)) {
    if (weekday === "Sat" && day >= 15 && day <= 21 && minutes >= 10 * 60 && minutes < 14 * 60) {
      status.textContent = "Open by appointment · Eastern time";
    } else if (schedule[weekday] && minutes >= schedule[weekday][0] && minutes < schedule[weekday][1]) {
      status.textContent = "Open now · Eastern time";
    } else {
      status.textContent = "Closed now · Eastern time";
    }
  }
}

const form = document.querySelector("form[data-email]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    let to = form.getAttribute("data-email");
    if (data.get("practice") === "family") to = "info@accessfamilyclinic.com";
    if (data.get("practice") === "behavioral") to = "info@accessbehavioralclinic.com";
    const lines = [];
    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if ((key === "Name" || key === "Message") && !text) {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) field.focus();
        return;
      }
      lines.push(`${key}: ${text}`);
    }
    const subject = encodeURIComponent(form.getAttribute("data-subject") || "Website message");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    const note = form.querySelector(".form-note");
    if (note) note.hidden = false;
  });
}
