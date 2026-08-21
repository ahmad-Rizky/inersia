document.addEventListener("DOMContentLoaded", () => {
  const config = window.INERSIA_CONFIG || {};
  const whatsappNumber = String(config.whatsappNumber || "628885165117").replace(/\D/g, "");
  const track = (eventName, detail = {}) => {
    const payload = { event: eventName, ...detail };
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

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    navToggle.setAttribute("aria-expanded", "false");
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

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, index) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    const answerId = answer.id || `lp-faq-${index + 1}`;
    answer.id = answerId;
    button.setAttribute("aria-controls", answerId);
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach(other => {
        other.classList.remove("active");
        const otherButton = other.querySelector(".faq-question");
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const priceData = {
    early: {
      title: "Early Admission",
      value: "Rp22.500.000",
      desc: "Deposit Rp6.000.000 menjadi bagian dari total biaya, bukan biaya tambahan.",
      installments: [["Tahap 1 (40%)", "Rp9.000.000"], ["Deposit", "Rp6.000.000"], ["Sisa Tahap 1", "Rp3.000.000"], ["Tahap 2 (30%)", "Rp6.750.000"], ["Tahap 3 (30%)", "Rp6.750.000"]],
      microcopy: "Hubungi tim Inersia untuk memastikan ketentuan Early Admission yang sedang berlaku."
    },
    normal: {
      title: "Harga Normal",
      value: "Rp24.500.000",
      desc: "Deposit Rp6.000.000 dihitung sebagai bagian dari tahap pertama 40%.",
      installments: [["Tahap 1 (40%)", "Rp9.800.000"], ["Deposit", "Rp6.000.000"], ["Sisa Tahap 1", "Rp3.800.000"], ["Tahap 2 (30%)", "Rp7.350.000"], ["Tahap 3 (30%)", "Rp7.350.000"]],
      microcopy: "Konfirmasi skema pembayaran yang berlaku bersama tim Inersia sebelum mendaftar."
    },
    friend: {
      title: "Early Admission + Cashback Teman",
      value: "Rp21.500.000",
      desc: "Cashback teman Rp1.000.000 diberikan sebagai pengurang tahap ketiga, bukan tunai di awal.",
      installments: [["Tahap 1 (40%)", "Rp9.000.000"], ["Deposit", "Rp6.000.000"], ["Sisa Tahap 1", "Rp3.000.000"], ["Tahap 2 (30%)", "Rp6.750.000"], ["Tahap 3 (30%)", "Rp5.750.000*"]],
      microcopy: "*Cashback berlaku jika kedua siswa memenuhi ketentuan pembayaran dan tetap aktif dalam program."
    }
  };

  const priceButtons = document.querySelectorAll(".price-switcher button");
  const priceTitle = document.getElementById("priceTitle");
  const priceValue = document.getElementById("priceValue");
  const priceDesc = document.getElementById("priceDesc");
  const priceMicrocopy = document.getElementById("priceMicrocopy");
  const installmentBox = document.getElementById("installmentBox");
  const renderPrice = key => {
    const data = priceData[key];
    if (!data || !priceTitle || !priceValue || !priceDesc || !priceMicrocopy || !installmentBox) return;
    priceTitle.textContent = data.title;
    priceValue.textContent = data.value;
    priceDesc.textContent = data.desc;
    priceMicrocopy.textContent = data.microcopy;
    installmentBox.replaceChildren(...data.installments.map(([label, value]) => {
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
    priceButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    renderPrice(button.dataset.price);
  }));

  const form = document.getElementById("assessmentForm");
  const formSteps = document.querySelectorAll(".form-step");
  const stepDots = document.querySelectorAll(".step-dot");
  const nextStepBtn = document.querySelector(".next-step");
  const prevStepBtn = document.querySelector(".prev-step");
  const statusBox = document.getElementById("formSuccess");
  const showStep = stepNumber => {
    formSteps.forEach(step => step.classList.remove("active"));
    const activeStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (activeStep) activeStep.classList.add("active");
    stepDots.forEach((dot, index) => dot.classList.toggle("active", index < stepNumber));
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
  if (nextStepBtn) nextStepBtn.addEventListener("click", () => { if (validateStepOne()) showStep(2); });
  if (prevStepBtn) prevStepBtn.addEventListener("click", () => showStep(1));

  if (form) {
    let formStarted = false;
    form.addEventListener("input", () => {
      if (!formStarted) { formStarted = true; track("FormStart", { form: "small_class_assessment" }); }
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const rows = [
        "Halo Inersia, saya ingin mendaftar assessment PTN Small Class 2027.", "",
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
      track("FormSubmit", { form: "small_class_assessment", destination: "WhatsApp" });
      const link = document.createElement("a");
      link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rows.join("\n"))}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
      if (statusBox) {
        statusBox.classList.remove("hidden");
        statusBox.innerHTML = "<strong>Pesan assessment sudah disiapkan.</strong><p>Selesaikan pengiriman melalui WhatsApp agar tim Inersia menerima data Anda.</p>";
      }
    });
  }

  document.querySelectorAll("a[href^='#']").forEach(link => link.addEventListener("click", () => {
    if (link.getAttribute("href") === "#form") track("CTA_Click", { label: link.textContent.trim(), destination: "assessment_form" });
  }));
  renderPrice("early");
});
