# QA Report — Small Class V3

Tanggal pemeriksaan: 6 September 2026

## Content

- PASS — Hook, CTA, disclosure, harga Rp22.500.000, Uang Pendaftaran Rp6.000.000, tahap 40/30/30, dan contoh refund Rp16.500.000 sesuai brief V3.
- PASS — Tidak ada istilah atau offer lama yang dilarang.
- PASS — Terminologi customer-facing menggunakan bahasa Indonesia.
- PASS — Tutor dan ketentuan yang belum tervalidasi tampil sebagai sample/placeholder, bukan fakta.
- BLOCKED SOURCE — Master Source of Truth belum tersedia di workspace. Fakta yang sudah locked di brief V3 digunakan; detail lain tidak dibuat-buat.

## Routing dan rollback

- PASS — `/small-class-v3/` mengembalikan HTTP 200 dari server lokal.
- PASS — Satu H1 dan title unik.
- PASS — Seluruh anchor internal terhubung.
- PASS — Seluruh 54 file bersama pada paket V2 dan V3 byte-identik berdasarkan SHA-256.
- PASS — Paket `Inersia-Website-Small-Class-V2` tidak diubah.

## Visual dan responsive

- PASS — Diperiksa pada 360, 390, 430, 768, 1280, dan 1440 px.
- PASS — Tidak ada horizontal overflow pada seluruh breakpoint.
- PASS — Desktop memakai hero unified; tablet dan mobile memakai komposisi bertumpuk agar copy tidak menimpa wajah.
- PASS — Sticky CTA tampil di tablet/mobile dan tidak tampil di desktop.
- PASS — Galeri memakai CSS scroll-snap pada mobile.
- PASS — `report-visual` terkunci ke rasio intrinsik 4:3 dan terukur tepat mengikuti wrapper pada 360, 390, 430, 768, dan 1440 px.
- PASS — Foto profil Miss Nuning memakai `assets/img/Miss Nuning.png` dengan dimensi intrinsik 1824 × 2131.
- PASS — Tiga foto kelas asli telah dioptimalkan ke WebP dan tampil pada galeri responsif; satu foto juga digunakan pada early proof teaser.
- PASS — Gambar eksisting tidak stretch dan seluruh referensi aset yang tersedia berhasil dimuat.

## JavaScript, form, dan aksesibilitas

- PASS — `node --check` tanpa error dan browser console tanpa warning/error.
- PASS — Form kosong menahan submit, memfokuskan field pertama, dan tidak membuka WhatsApp.
- PASS — Tidak ada fake success; status hanya menjelaskan bahwa pengguna masih harus mengirim pesan di WhatsApp.
- PASS — FAQ dapat dibuka/ditutup melalui keyboard dan memperbarui `aria-expanded`.
- PASS — Label form, focus state, skip link, alt text, serta tombol navigasi tersedia.
- PASS — Event preparation: PageView, ViewContent, CTA_Click, FormStart, FormSubmit, WhatsAppClick, AssessmentBooked, GuaranteeTermsClick.

## Performance

- PASS — Vanilla HTML/CSS/JS tanpa dependency baru.
- PASS — Hero diprioritaskan dan gambar bawah fold memakai lazy loading, dimensi, serta async decoding.
- PASS — Tiga foto kelas sumber dikonversi ke WebP kualitas tinggi tanpa resize atau crop permanen.

## Paket

- PASS — Arsip `Inersia-Website-Small-Class-V3.zip` berhasil dibuat.
