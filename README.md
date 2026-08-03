# Website Statis Bimbel Inersia

## Struktur
- `index.html`: beranda utama
- `tentang.html`: profil dan prinsip Inersia
- `program.html`: ringkasan program
- `metode.html`: sistem pembelajaran
- `tutor.html`: seleksi dan profil tutor
- `kota.html`: Malang, Surabaya, Bandung
- `artikel.html`: indeks artikel
- `faq.html`: FAQ
- `kontak.html`: form WhatsApp
- halaman artikel dan legal

## Konfigurasi wajib
Buka `assets/js/site-config.js`, lalu ganti:
- nomor WhatsApp
- email
- URL landing page Small Class pada subdomain Anda
- Instagram
- jam operasional

## Placeholder yang harus diganti
- nama, foto, program studi, dan pengalaman tutor
- alamat lokasi dan Google Maps
- jadwal dan status kuota
- legalitas usaha
- kebijakan program final

## Menjalankan
Buka `index.html` langsung atau unggah seluruh folder ke hosting statis. Untuk pengujian lokal yang lebih baik:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Deployment
Cocok untuk cPanel, Netlify, Cloudflare Pages, GitHub Pages, atau hosting statis lain. Pastikan seluruh file dan folder `assets` diunggah dengan struktur yang sama.
