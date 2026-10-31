# Jeanne – Toko Pashmina Kaos Premium

Website toko online Jeanne Hijab berbasis HTML, CSS, dan JavaScript murni.

**Fitur utama:** katalog pashmina kaos premium, **Studio Scrunchie gratis** (pilih motif bunga watercolor, warna, ukuran, atau unggah gambar sendiri, dengan pratinjau langsung), keranjang, dan pemesanan via WhatsApp.

## Struktur
```
index.html   → struktur halaman
style.css    → tampilan (responsif)
foto-*.jpg   → foto produk & foto tampilan awal
script.js    → produk, studio scrunchie, keranjang, tab kebijakan
README.md
```

## Publish ke GitHub Pages
1. Buat repo publik di https://github.com/new, mis. `jeanne`.
2. Klik **uploading an existing file**, lalu unggah **SEMUA 12 file** hasil ekstrak (index.html, style.css, script.js, README.md, dan 8 file `foto-*.jpg`). Tidak ada subfolder, jadi tinggal pilih semua file (Ctrl+A) lalu seret. Commit changes.
3. Settings → Pages → Source: *Deploy from a branch* → Branch `main` / `(root)` → Save.
4. Link: `https://USERNAME-GITHUB.github.io/jeanne/`

Cek foto: buka `https://USERNAME-GITHUB.github.io/jeanne/foto-navy.jpg`. Jika tampil fotonya, berarti sudah terunggah. Jika 404, file foto belum terunggah. (Selama foto gagal dimuat, website menampilkan ilustrasi cadangan.)

## Foto produk
Foto berada di folder yang sama dengan index.html (`foto-*.jpg`, sudah dikompres ±30–45 KB). Pasangan foto-produk diatur di `PRODUCTS` pada `script.js` (field `photo`, dan `pos` untuk posisi crop). `foto-hero-group.jpg` dipakai di tampilan awal.

## Yang perlu diganti
- Nomor WhatsApp: `WA_NUMBER` di `script.js` (format 62xxxxxxxxxx).
- Harga: `PRICE` di `script.js`.
- Alamat, email, dan link sosmed di `index.html`.
- Jika sudah punya NIB, tambahkan di bagian Legalitas Usaha pada `index.html`.
