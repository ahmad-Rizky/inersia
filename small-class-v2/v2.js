document.addEventListener("DOMContentLoaded", () => {
  const config = window.INERSIA_CONFIG || {};
  const whatsappNumber = String(config.whatsappNumber || "628885165117").replace(/\D/g, "");

  const track = (eventName, detail = {}) => {
    const payload = { event: eventName, page_variant: "small_class_v2", ...detail };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("inersia:track", { detail: payload }));
  };

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const search = new URLSearchParams(window.location.search);
  const incomingUtm = Object.fromEntries(utmKeys.map(key => [key, search.get(key)]).filter(([, value]) => value));
  if (Object.keys(incomingUtm).length) sessionStorage.setItem("inersia_utm", JSON.stringify(incomingUtm));
  let storedUtm = {};
  try { storedUtm = JSON.parse(sessionStorage.getItem("inersia_utm") || "{}"); } catch { storedUtm = {}; }

  const progressBar = document.querySelector(".read-progress span");
  const reportedDepths = new Set();
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
    [25, 50, 75, 90].forEach(depth => {
      if (progress * 100 >= depth && !reportedDepths.has(depth)) {
        reportedDepths.add(depth);
        track("ScrollDepth", { depth });
      }
    });
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealTargets = document.querySelectorAll(".recognition-grid article, .journey-grid article, .value-cards article, .fit-grid article, .quote-grid blockquote, .proof-card, .difference-grid article, .location-grid article");
  revealTargets.forEach(target => target.classList.add("reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealTargets.forEach(target => observer.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add("visible"));
  }

  const priceData = {
    early: {
      title: "Early Admission",
      value: "Rp22.500.000",
      description: "Deposit Rp6.000.000 menjadi bagian dari total biaya, bukan biaya tambahan.",
      installments: [["Tahap 1 (40%)", "Rp9.000.000"], ["Deposit", "Rp6.000.000"], ["Sisa Tahap 1", "Rp3.000.000"], ["Tahap 2 (30%)", "Rp6.750.000"], ["Tahap 3 (30%)", "Rp6.750.000"]],
      microcopy: "Hubungi tim Inersia untuk memastikan ketentuan Early Admission yang sedang berlaku."
    },
    normal: {
      title: "Harga Normal",
      value: "Rp24.500.000",
      description: "Deposit Rp6.000.000 dihitung sebagai bagian dari pembayaran tahap pertama 40%.",
      installments: [["Tahap 1 (40%)", "Rp9.800.000"], ["Deposit", "Rp6.000.000"], ["Sisa Tahap 1", "Rp3.800.000"], ["Tahap 2 (30%)", "Rp7.350.000"], ["Tahap 3 (30%)", "Rp7.350.000"]],
      microcopy: "Konfirmasi skema pembayaran yang berlaku bersama tim Inersia sebelum mendaftar."
    },
    friend: {
      title: "Early Admission + Cashback Teman",
      value: "Rp21.500.000",
      description: "Cashback teman Rp1.000.000 diberikan sebagai pengurang tahap ketiga, bukan tunai di awal.",
      installments: [["Tahap 1 (40%)", "Rp9.000.000"], ["Deposit", "Rp6.000.000"], ["Sisa Tahap 1", "Rp3.000.000"], ["Tahap 2 (30%)", "Rp6.750.000"], ["Tahap 3 (setelah cashback)", "Rp5.750.000"]],
      microcopy: "Cashback berlaku jika kedua siswa memenuhi ketentuan pembayaran dan tetap aktif dalam program."
    }
  };

  const priceTitle = document.getElementById("priceTitle");
  const priceValue = document.getElementById("priceValue");
  const priceDescription = document.getElementById("priceDescription");
  const installmentList = document.getElementById("installmentList");
  const priceMicrocopy = document.getElementById("priceMicrocopy");
  const priceButtons = document.querySelectorAll(".price-tabs button");
  const renderPrice = key => {
    const data = priceData[key];
    if (!data || !priceTitle || !priceValue || !priceDescription || !installmentList || !priceMicrocopy) return;
    priceTitle.textContent = data.title;
    priceValue.textContent = data.value;
    priceDescription.textContent = data.description;
    priceMicrocopy.textContent = data.microcopy;
    installmentList.replaceChildren(...data.installments.map(([label, value]) => {
      const row = document.createElement("div");
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      span.textContent = label;
      strong.textContent = value;
      row.append(span, strong);
      return row;
    }));
  };
  priceButtons.forEach(button => button.addEventListener("click", () => {
    priceButtons.forEach(other => {
      other.classList.remove("active");
      other.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    renderPrice(button.dataset.price);
    track("PriceOptionView", { option: button.dataset.price });
  }));

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, index) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    const answerId = `v2-faq-${index + 1}`;
    answer.id = answerId;
    button.setAttribute("aria-controls", answerId);
    button.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("open");
      faqItems.forEach(other => {
        other.classList.remove("open");
        const otherButton = other.querySelector(".faq-question");
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      });
      if (shouldOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        track("FAQOpen", { question: button.textContent.trim().replace(/\+$/, "").trim() });
      }
    });
  });

  document.querySelectorAll("[data-track='CTA_Click']").forEach(link => link.addEventListener("click", () => {
    track("CTA_Click", { label: link.textContent.trim(), destination: link.getAttribute("href") });
  }));

  const form = document.getElementById("assessmentForm");
  const formSteps = document.querySelectorAll(".form-step");
  const stepDots = document.querySelectorAll(".step-indicator span");
  const nextButton = document.querySelector(".next-step");
  const previousButton = document.querySelector(".prev-step");
  const formStatus = document.getElementById("formStatus");
  const showStep = stepNumber => {
    formSteps.forEach(step => step.classList.toggle("active", step.dataset.step === String(stepNumber)));
    stepDots.forEach((dot, index) => dot.classList.toggle("active", index < stepNumber));
    const active = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const firstField = active?.querySelector("input, select");
    if (firstField && stepNumber > 1) firstField.focus();
  };
  const validateStepOne = () => {
    const stepOne = document.querySelector('.form-step[data-step="1"]');
    if (!stepOne) return false;
    for (const field of stepOne.querySelectorAll("input[required], select[required]")) {
      if (!field.value.trim()) {
        field.focus();
        field.reportValidity();
        return false;
      }
    }
    return true;
  };
  if (nextButton) nextButton.addEventListener("click", () => {
    if (!validateStepOne()) return;
    showStep(2);
    track("FormStepComplete", { step: 1 });
  });
  if (previousButton) previousButton.addEventListener("click", () => showStep(1));

  if (form) {
    let formStarted = false;
    form.addEventListener("input", () => {
      if (!formStarted) {
        formStarted = true;
        track("FormStart", { form: "small_class_v2_assessment" });
      }
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const rows = [
        "Halo Inersia, saya ingin mengecek kecocokan PTN Small Class 2027 dan menjadwalkan assessment.", "",
        `Nama siswa: ${data.get("student_name") || "-"}`,
        `Nama orang tua/wali: ${data.get("parent_name") || "-"}`,
        `Nomor WhatsApp pendaftar: ${data.get("whatsapp") || "-"}`,
        `Kota: ${data.get("city") || "-"}`,
        `Kelas: ${data.get("grade") || "-"}`,
        `Target PTN: ${data.get("target_university") || "-"}`,
        `Target program studi: ${data.get("target_major") || "-"}`,
        `Kendala utama: ${data.get("main_problem") || "-"}`,
        `Preferensi jadwal: ${data.get("schedule") || "-"}`
      ];
      const utmEntries = Object.entries(storedUtm);
      if (utmEntries.length) rows.push("", "Sumber kunjungan:", ...utmEntries.map(([key, value]) => `${key}: ${value}`));
      track("FormSubmit", { form: "small_class_v2_assessment", destination: "WhatsApp" });
      const link = document.createElement("a");
      link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rows.join("\n"))}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
      if (formStatus) {
        formStatus.classList.remove("hidden");
        formStatus.textContent = "Pesan assessment sudah disiapkan. Selesaikan pengiriman melalui WhatsApp agar tim Inersia menerima data Anda.";
      }
    });
  }
});
