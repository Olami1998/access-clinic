const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
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
  let open = false;
  if (weekday === "Sat") {
    open = day >= 15 && day <= 21 && minutes >= 10 * 60 && minutes < 14 * 60;
  } else if (schedule[weekday]) {
    open = minutes >= schedule[weekday][0] && minutes < schedule[weekday][1];
  }
  status.textContent = open ? "Open now · Eastern time" : "Closed now · Eastern time";
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
      lines.push(`${key}: ${String(value).trim()}`);
    }
    const subject = encodeURIComponent(form.getAttribute("data-subject") || "Website message");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    const note = form.querySelector(".form-note");
    if (note) note.hidden = false;
  });
}
