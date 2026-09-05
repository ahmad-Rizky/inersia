# Inersia PTN Small Class 2027 V3

Landing page statis baru dan terisolasi pada route `/small-class-v3/`. Small Class V2 tetap berada di `/small-class-v2/` dan tidak diubah.

## Review lokal

Dari folder `main-website` jalankan:

```powershell
python -m http.server 8765
```

Lalu buka:

`http://localhost:8765/small-class-v3/`

Entry point langsung: `small-class-v3/index.html`.

## File V3

- `index.html` — struktur, copy, SEO, schema, form, dan placeholder tervalidasi.
- `v3.css` — seluruh styling V3, breakpoint, sticky CTA, scroll-snap, dan focus state.
- `v3.js` — navigasi, FAQ, tracking preparation, validasi, dan fallback WhatsApp.
- `assets/` — tiga foto kelas asli yang dioptimalkan ke WebP.
- `QA-REPORT.md` — catatan pemeriksaan implementasi.

Visual laporan menggunakan rasio responsif 4:3. Kartu bukti pendamping memakai `../assets/img/Miss Nuning.png` sesuai aset utama website.

## Placeholder yang belum boleh dipublikasikan sebagai data final

1. Tiga profil tutor individual: foto, nama, jurusan ITB, kompetensi, pengalaman, pendekatan, dan kota/peran.
2. Rincian legal Program Jaminan: cakupan PTN/prodi, ambang kepatuhan, proses dan batas klaim, SLA refund, serta pengecualian.

Semua placeholder diberi label nyata dan komentar kode. Tidak ada nama, skor, testimoni, kelangkaan, atau syarat jaminan rekaan.

## Integrasi form

Form membuka WhatsApp resmi dari `../assets/js/site-config.js` dengan pesan terisi. Pengguna tetap harus menekan tombol kirim di WhatsApp. Titik integrasi CRM diberi komentar di `index.html`, dan event `AssessmentBooked` hanya tersedia sebagai hook untuk konfirmasi yang benar-benar tervalidasi.
