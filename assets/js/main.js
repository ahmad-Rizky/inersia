document.addEventListener("DOMContentLoaded", () => {
  const config = window.INERSIA_CONFIG || {};
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll("[data-email]").forEach(el => {
    el.textContent = config.email || "halo@inersia.id";
    if (el.tagName === "A") el.href = `mailto:${config.email || "halo@inersia.id"}`;
  });
  document.querySelectorAll("[data-hours]").forEach(el => el.textContent = config.operatingHours || "Senin–Sabtu, 09.00–18.00 WIB");
  document.querySelectorAll("[data-lp-link]").forEach(el => el.href = config.landingPageUrl || "#");
  document.querySelectorAll("[data-instagram]").forEach(el => el.href = config.instagramUrl || "#");

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("is-open")));
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-nav]").forEach(link => {
    if (link.dataset.nav === page) link.classList.add("active");
  });

  document.querySelectorAll(".faq-item").forEach(item => {
    const button = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!button || !panel) return;
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      item.classList.toggle("open", !expanded);
    });
  });

  const filters = document.querySelectorAll("[data-filter]");
  const articles = document.querySelectorAll("[data-category]");
  filters.forEach(filter => filter.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    filter.classList.add("active");
    const value = filter.dataset.filter;
    articles.forEach(article => {
      article.hidden = value !== "all" && article.dataset.category !== value;
    });
  }));

  const contactForm = document.querySelector("[data-whatsapp-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const rows = [
        "Halo tim Inersia, saya ingin berkonsultasi.",
        `Nama orang tua: ${data.get("parent_name") || "-"}`,
        `Nama siswa: ${data.get("student_name") || "-"}`,
        `Kota: ${data.get("city") || "-"}`,
        `Kelas: ${data.get("grade") || "-"}`,
        `Program yang diminati: ${data.get("program") || "-"}`,
        `Pesan: ${data.get("message") || "-"}`
      ];
      const number = String(config.whatsappNumber || "").replace(/\D/g, "");
      if (!number || /^6280+$/.test(number)) {
        const status = contactForm.querySelector(".form-status");
        if (status) status.textContent = "Nomor WhatsApp belum dikonfigurasi di assets/js/site-config.js.";
        return;
      }
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(rows.join("\n"))}`, "_blank", "noopener");
    });
  }

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("visible"));
});
