# Dokumentasi Instalasi & Pengujian Website

Dibangun dengan ❤️ menggunakan **Next.js 16 (App Router)**, **TypeScript**, dan **Supabase**.

Dokumen ini berisi panduan langkah demi langkah untuk menjalankan source code proyek ini di lingkungan lokal (Localhost) untuk keperluan pengujian/testing.

## 📋 Persiapan

Sebelum memulai, pastikan komputer Anda sudah terinstal:

- [Node.js](https://nodejs.org/) (Versi v20.x atau lebih baru untuk menghindari error karena menggunakan next.js 16)
- [Git](https://git-scm.com/) untuk mengunduh repository.
- **Browser**: Google Chrome atau Edge (Versi terbaru).

## 🚀 Cara Menjalankan di Local

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda:

### 1. Clone Repository
Buka terminal dan jalankan perintah berikut untuk mengunduh kode:

```bash
git clone https://github.com/rizkynugrahaamaia/bss-technical-test.git
cd bss-technical-test
```

### 2. Install Dependencies
Instal semua modul yang diperlukan agar aplikasi bisa menyala:

```bash
npm install
```

### 3. Konfigurasi Environment Variables (PENTING!)
Aplikasi ini menggunakan database cloud (Supabase). Agar aplikasi bisa terhubung ke database, Anda memerlukan file "kunci" akses.
Buat file baru di dalam folder proyek bernama: .env
Salin (Copy) kode di bawah ini dan tempel (Paste) ke dalam file .env tersebut:

```bash
# Hubungi pemilik proyek untuk mendapatkan value (isi) dari variabel ini
NEXT_PUBLIC_SUPABASE_URL=DIDAPATKAN_DARI_PENGEMBANG
NEXT_PUBLIC_SUPABASE_ANON_KEY=DIDAPATKAN_DARI_PENGEMBANG
```
### 4. Menjalankan Aplikasi 
- Di terminal, jalankan perintah:
```bash
npm run dev
```
- Tunggu hingga muncul pesan: Ready in xxxxms
- Buka browser dan akses alamat berikut: [http://localhost:3000](http://localhost:3000)

## 🧪 Akun Pengujian
Berikut adalah akun demo yang dapat digunakan untuk menguji fitur login:
- Email: testuser@gmail.com
- Password: 12345678

Jika ingin meggunakan akun lain, tinggal buat user baru pada halaman register/daftar.

## 📂 Struktur Folder Utama
- `/src/app`: Berisi halaman (Pages) dan Layout.
- `/src/components`: Komponen UI (Button, Form, dll).
- `/src/hooks`: Custom React Hooks untuk memisahkan logika bisnis dari UI.
- `/src/lib`: : Folder utilitas utama, konfigurasi library pihak ketiga (Supabase) dan helper functions.
- `/src/types`: Definisi tipe data TypeScript dan skema validasi.
- `/src/proxy.ts`: File konfigurasi Middleware/Proxy untuk proteksi rute (Auth Guard).