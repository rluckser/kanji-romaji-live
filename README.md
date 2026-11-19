# Kanji → Romaji Live

Website ringan berbasis HTML, CSS, dan JavaScript statis untuk mengonversi teks Kanji dan bahasa Jepang ke Romaji secara langsung (*live*) tanpa tombol klik dan tanpa server backend.

## Fitur Utama

- **Konversi Live & Kontekstual**: Menggunakan analisis morfologi `kuromoji.js` sehingga bacaan Kanji dan partikel (`は` → `wa`, `へ` → `e`, `を` → `o`) menyesuaikan konteks kalimat.
- **Posisi Romaji Fleksibel**: Pilih tampilan Romaji **di atas** atau **di bawah** Kanji.
- **3 Mode Tema**: Tersedia tema **Terang**, **Gelap**, dan **Perangkat** (mengikuti pengaturan sistem secara otomatis).
- **Gaya Vokal Panjang**: Pilih format makron (`ō` / `ū`) atau standar (`ou` / `uu`).
- **Siap untuk GitHub Pages**: Statis 100%, tidak perlu proses *build* (`npm` atau *bundler*).

## Cara Push ke GitHub & Aktifkan GitHub Pages

1. Buat repository baru di GitHub (misalnya `kanji-romaji-live`).
2. Ekstrak isi arsip ini ke folder proyek lokal, lalu jalankan:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Kanji to Romaji Live"
   git branch -M main
   git remote add origin https://github.com/USERNAME/kanji-romaji-live.git
   git push -u origin main
   ```
3. Buka **Settings → Pages** di repository GitHub kamu.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**, lalu pilih branch `main` dan folder `/ (root)`, kemudian klik **Save**.
5. Tunggu sekitar 1 menit hingga URL `https://USERNAME.github.io/kanji-romaji-live/` aktif.
