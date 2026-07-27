document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
    });

    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => siteNav.classList.remove('open'));
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  const priceData = {
    early: {
      title: 'Early Admission',
      value: 'Rp22.500.000',
      desc: 'Deposit Rp6.000.000 menjadi bagian dari total biaya, bukan biaya tambahan.',
      installments: [
        ['Tahap 1 (40%)', 'Rp9.000.000'],
        ['Deposit', 'Rp6.000.000'],
        ['Sisa Tahap 1', 'Rp3.000.000'],
        ['Tahap 2 (30%)', 'Rp6.750.000'],
        ['Tahap 3 (30%)', 'Rp6.750.000']
      ],
      microcopy: 'Early Admission perlu memiliki batas waktu atau batas kuota yang nyata. Tambahkan tanggal atau syarat resmi sebelum halaman digunakan.'
    },
    normal: {
      title: 'Harga Normal',
      value: 'Rp24.500.000',
      desc: 'Deposit Rp6.000.000 dihitung sebagai bagian dari tahap pertama 40%.',
      installments: [
        ['Tahap 1 (40%)', 'Rp9.800.000'],
        ['Deposit', 'Rp6.000.000'],
        ['Sisa Tahap 1', 'Rp3.800.000'],
        ['Tahap 2 (30%)', 'Rp7.350.000'],
        ['Tahap 3 (30%)', 'Rp7.350.000']
      ],
      microcopy: 'Harga normal digunakan ketika periode Early Admission berakhir atau syaratnya tidak terpenuhi.'
    },
    friend: {
      title: 'Early Admission + Cashback Teman',
      value: 'Rp21.500.000',
      desc: 'Cashback teman Rp1.000.000 diberikan sebagai pengurang tahap ketiga, bukan tunai di awal.',
      installments: [
        ['Tahap 1 (40%)', 'Rp9.000.000'],
        ['Deposit', 'Rp6.000.000'],
        ['Sisa Tahap 1', 'Rp3.000.000'],
        ['Tahap 2 (30%)', 'Rp6.750.000'],
        ['Tahap 3 (30%)', 'Rp5.750.000*']
      ],
      microcopy: '*Cashback berlaku jika kedua siswa memenuhi ketentuan pembayaran dan tetap aktif dalam program.'
    }
  };

  const priceButtons = document.querySelectorAll('.price-switcher button');
  const priceTitle = document.getElementById('priceTitle');
  const priceValue = document.getElementById('priceValue');
  const priceDesc = document.getElementById('priceDesc');
  const priceMicrocopy = document.getElementById('priceMicrocopy');
  const installmentBox = document.getElementById('installmentBox');

  const renderPrice = (key) => {
    const data = priceData[key];
    if (!data) return;
    priceTitle.textContent = data.title;
    priceValue.textContent = data.value;
    priceDesc.textContent = data.desc;
    priceMicrocopy.textContent = data.microcopy;
    installmentBox.innerHTML = data.installments
      .map(item => `<div><span>${item[0]}</span><strong>${item[1]}</strong></div>`)
      .join('');
  };

  priceButtons.forEach(button => {
    button.addEventListener('click', () => {
      priceButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderPrice(button.dataset.price);
    });
  });

  const form = document.getElementById('assessmentForm');
  const formSteps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const nextStepBtn = document.querySelector('.next-step');
  const prevStepBtn = document.querySelector('.prev-step');
  const successBox = document.getElementById('formSuccess');

  const showStep = (stepNumber) => {
    formSteps.forEach(step => step.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
    stepDots.forEach((dot, index) => {
      dot.classList.toggle('active', index < stepNumber);
    });
  };

  const validateStepOne = () => {
    const stepOne = document.querySelector('.form-step[data-step="1"]');
    const fields = stepOne.querySelectorAll('input[required], select[required]');
    for (const field of fields) {
      if (!field.value.trim()) {
        field.focus();
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (validateStepOne()) showStep(2);
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => showStep(1));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add('hidden');
      successBox.classList.remove('hidden');
    });
  }

  renderPrice('early');
});
