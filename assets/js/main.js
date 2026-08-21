document.addEventListener("DOMContentLoaded", () => {
  const config = window.INERSIA_CONFIG || {};
  const whatsappNumber = String(config.whatsappNumber || "628885165117").replace(/\D/g, "");
  const email = config.email || "inersiaeducation@gmail.com";
  const instagramUrl = config.instagramUrl || "https://instagram.com/inersiaeducation";
  const landingPageUrl = config.landingPageUrl || "";

  const getUtm = () => {
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const params = new URLSearchParams(window.location.search);
    const incoming = Object.fromEntries(keys.map(key => [key, params.get(key)]).filter(([, value]) => value));
    if (Object.keys(incoming).length) sessionStorage.setItem("inersia_utm", JSON.stringify(incoming));
    try { return JSON.parse(sessionStorage.getItem("inersia_utm") || "{}"); } catch { return {}; }
  };
  const utm = getUtm();

  const track = (eventName, detail = {}) => {
    const payload = { event: eventName, ...detail };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("inersia:track", { detail: payload }));
  };
  window.INERSIA_TRACK = track;

  const buildWhatsAppUrl = message => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const addUtmRows = rows => {
    const entries = Object.entries(utm);
    if (entries.length) rows.push("", "Sumber kunjungan:", ...entries.map(([key, value]) => `${key}: ${value}`));
    return rows;
  };

  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll("[data-email]").forEach(el => {
    el.textContent = email;
    if (el.tagName === "A") el.href = `mailto:${email}`;
  });
  document.querySelectorAll("[data-hours]").forEach(el => { el.textContent = `Layanan informasi tersedia ${config.operatingHours || "24 Jam"}.`; });
  document.querySelectorAll("[data-instagram]").forEach(el => {
    el.href = instagramUrl;
    if (el.dataset.instagram === "handle") el.textContent = config.instagramHandle || "@inersiaeducation";
  });
  document.querySelectorAll("[data-lp-link]").forEach(el => {
    if (landingPageUrl && !landingPageUrl.includes("LANDING_PAGE_URL_HERE")) el.href = landingPageUrl;
  });
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => {
    const message = el.dataset.whatsappMessage || "Halo Inersia, saya ingin berkonsultasi mengenai program belajar.";
    el.href = buildWhatsAppUrl(message);
  });
  document.querySelectorAll("[data-track]").forEach(el => {
    el.addEventListener("click", () => track(el.dataset.track, {
      label: el.dataset.trackLabel || el.textContent.trim(),
      page: document.body.dataset.page || "unknown"
    }));
  });

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNav));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeNav(); });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-nav]").forEach(link => {
    if (link.dataset.nav === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll(".faq-item").forEach((item, index) => {
    const button = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!button || !panel) return;
    const panelId = panel.id || `faq-panel-${index + 1}`;
    panel.id = panelId;
    button.setAttribute("aria-controls", panelId);
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      item.classList.toggle("open", !expanded);
    });
  });

  const filters = document.querySelectorAll("[data-filter]");
  const articles = document.querySelectorAll("[data-category]");
  filters.forEach(filter => filter.addEventListener("click", () => {
    filters.forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    filter.classList.add("active");
    filter.setAttribute("aria-pressed", "true");
    const value = filter.dataset.filter;
    articles.forEach(article => { article.hidden = value !== "all" && article.dataset.category !== value; });
  }));

  const contactForm = document.querySelector("[data-whatsapp-form]");
  if (contactForm) {
    let formStarted = false;
    contactForm.addEventListener("input", () => {
      if (!formStarted) { formStarted = true; track("FormStart", { form: "consultation" }); }
    });
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const rows = addUtmRows([
        "Halo Inersia, saya ingin berkonsultasi mengenai program belajar untuk anak saya.",
        "",
        `Nama orang tua/wali: ${data.get("parent_name") || "-"}`,
        `Nama siswa: ${data.get("student_name") || "-"}`,
        `Kota: ${data.get("city") || "-"}`,
        `Kelas: ${data.get("grade") || "-"}`,
        `Program yang diminati: ${data.get("program") || "-"}`,
        `Pesan: ${data.get("message") || "-"}`
      ]);
      track("FormSubmit", { form: "consultation", destination: "WhatsApp" });
      const link = document.createElement("a");
      link.href = buildWhatsAppUrl(rows.join("\n"));
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
      const status = contactForm.querySelector(".form-status");
      if (status) status.textContent = "Pesan telah disiapkan. Selesaikan pengiriman di WhatsApp.";
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const observer = !reduceMotion && "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("visible"));
});
