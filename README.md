# Website Utama Bimbel Inersia

Website statis resmi Inersia. Landing page PTN Small Class 2027 berada di dalam website ini pada folder `small-class-2027/`.

## Konfigurasi

Informasi resmi tersimpan di `assets/js/site-config.js`. WhatsApp, email, Instagram, jam layanan, domain utama, dan tiga alamat sudah diperbarui.

Sebelum deployment, isi hanya data yang belum final:

- `mapsUrl` untuk setiap lokasi setelah URL Google Maps resmi tersedia.
- ID GA4, Meta Pixel, dan verifikasi Search Console bila sudah tersedia.

## Menjalankan secara lokal

Jalankan server statis dari folder ini:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080/`.

## Deployment

Seluruh path aset bersifat relatif. Proyek dapat digunakan pada shared hosting, GitHub Pages, Cloudflare Pages, Netlify, atau hosting statis lain. Publikasikan seluruh isi folder ini sebagai satu website; jangan memindahkan `small-class-2027/` ke subdomain.
