document.addEventListener("DOMContentLoaded", () => {
  const config = window.INERSIA_CONFIG || {};
  const whatsappNumber = String(config.whatsappNumber || "628885165117").replace(/\D/g, "");
  const lpVersion = "v3";

  const track = (eventName, detail = {}) => {
    const payload = { event: eventName, lp_version: lpVersion, ...detail };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("inersia:track", { detail: payload }));
  };

  track("PageView", { page: "small_class_v3" });
  track("ViewContent", { content_name: "Inersia PTN Small Class 2027 V3" });

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const search = new URLSearchParams(window.location.search);
  const incomingUtm = Object.fromEntries(utmKeys.map(key => [key, search.get(key)]).filter(([, value]) => value));
  if (Object.keys(incomingUtm).length) {
    sessionStorage.setItem("inersia_v3_utm", JSON.stringify(incomingUtm));
  }
  let storedUtm = {};
  try {
    storedUtm = JSON.parse(sessionStorage.getItem("inersia_v3_utm") || "{}");
  } catch {
    storedUtm = {};
  }

  const progressBar = document.querySelector(".read-progress span");
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    });
    siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu navigasi");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-event='CTA_Click']").forEach(control => {
    control.addEventListener("click", () => track("CTA_Click", {
      cta_label: control.textContent.trim(),
      cta_location: control.dataset.ctaLocation || "unknown",
      destination: control.getAttribute("href") || ""
    }));
  });

  document.querySelectorAll("[data-event='GuaranteeTermsClick']").forEach(control => {
    control.addEventListener("click", () => track("GuaranteeTermsClick", {
      cta_location: control.dataset.ctaLocation || "guarantee"
    }));
  });

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, index) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    const answerId = `v3-faq-${index + 1}`;
    answer.id = answerId;
    button.setAttribute("aria-controls", answerId);
    button.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("open");
      faqItems.forEach(other => {
        other.classList.remove("open");
        other.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });
      if (shouldOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const revealTargets = document.querySelectorAll(".proof-teaser, .problem-list article, .visit-steps li, .loop-grid article, .tutor-card, .gallery-card, .report-list li");
  revealTargets.forEach(target => target.classList.add("reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px" });
    revealTargets.forEach(target => observer.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add("visible"));
  }

  const form = document.getElementById("bookingForm");
  const formStatus = document.getElementById("formStatus");
  if (form) {
    let formStarted = false;
    form.addEventListener("input", () => {
      if (formStarted) return;
      formStarted = true;
      track("FormStart", { form_name: "v3_home_visit" });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const rows = [
        "Halo Inersia, saya ingin menjadwalkan Asesmen PTN Gratis di Rumah.",
        "",
        `Nama siswa: ${data.get("student_name") || "-"}`,
        `Nama orang tua/wali: ${data.get("parent_name") || "-"}`,
        `Nomor WhatsApp: ${data.get("whatsapp") || "-"}`,
        `Kota: ${data.get("city") || "-"}`,
        `Kelas saat ini: ${data.get("grade") || "-"}`,
        `Target PTN: ${data.get("target_university") || "Belum ditentukan"}`,
        `Target program studi: ${data.get("target_major") || "Belum ditentukan"}`
      ];
      const utmEntries = Object.entries(storedUtm);
      if (utmEntries.length) {
        rows.push("", "Sumber kunjungan:", ...utmEntries.map(([key, value]) => `${key}: ${value}`));
      }

      track("FormSubmit", { form_name: "v3_home_visit", destination: "WhatsApp" });
      track("WhatsAppClick", { source: "v3_home_visit_form" });
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rows.join("\n"))}`;
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!newWindow) window.location.href = whatsappUrl;

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.textContent = "Pesan sudah disiapkan. Tekan kirim di WhatsApp agar tim Inersia menerima permintaan Anda.";
      }
    });
  }

  // Panggil hanya setelah CRM atau tim mengonfirmasi jadwal; jangan dipicu saat form dibuka.
  window.InersiaV3 = Object.freeze({
    markAssessmentBooked(detail = {}) {
      track("AssessmentBooked", { confirmation_source: "verified", ...detail });
    }
  });
});
