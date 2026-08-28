# Otomotif Store

Toko online produk otomotif dengan sistem pengecekan kecocokan kendaraan.
Dibangun dengan Next.js 16 (App Router), React 19, Tailwind CSS v4, dan TypeScript.

---

## 1. Yang perlu dibaca lebih dulu

### Nama toko masih sementara

Nama **"Otomotif Store"** adalah nama kerja, bukan nama final. Nama itu belum
dikonfirmasi pemilik toko.

Untuk menggantinya, ubah **satu baris** di [`src/lib/store-config.ts`](src/lib/store-config.ts):

```ts
export const NAMA_TOKO = "Otomotif Store";
```

Seluruh situs ikut berubah: judul halaman, header, footer, OG image, pesan
WhatsApp, dan data terstruktur.

### Seluruh produk dan harga adalah data contoh

Katalog berisi 31 produk contoh di 5 kategori (sparepart, aksesoris, oli dan
cairan, audio, perawatan). Semuanya karangan untuk keperluan pengembangan, dan
ditandai jelas di layar sebagai data contoh.

Ganti seluruhnya lewat satu berkas: [`src/data/catalog.ts`](src/data/catalog.ts).

Setelah katalog asli masuk, ubah penanda di `store-config.ts`:

```ts
export const DATA_CONTOH = false;
```

### Data kontak sengaja dikosongkan

Nomor WhatsApp, alamat, jam operasional, email, dan Instagram **belum diisi**,
dan ditandai "belum diisi" di layar.

**Soal pencarian kontak resmi di Google.** Pencarian tidak bisa dilakukan karena
tidak ada satu pun penanda identitas bisnis yang tersedia: tidak ada nama toko,
tidak ada tautan toko daring, tidak ada nama pemilik, tidak ada kota, dan tidak
ada akun media sosial. Satu-satunya nama yang ada dalam permintaan adalah
`onyxcreative.asia`, dan itu domain agensi pembuat situs, bukan bisnis
otomotifnya. Pencarian yang sempat dilakukan hanya memunculkan toko sparepart
lain yang tidak ada hubungannya.

Memakai nomor mana pun dari hasil itu sama saja dengan menebak, jadi tidak
dilakukan. **Kirimkan nama toko atau tautan tokonya**, dan pencarian bisa
diulang dengan benar.

Isi datanya di [`src/lib/store-config.ts`](src/lib/store-config.ts):

```ts
export const KONTAK = {
  whatsapp: null,       // contoh: "6281234567890" (tanpa tanda plus)
  alamat: null,
  jamOperasional: null,
  email: null,
  instagram: null,
};
```

Selama `whatsapp` masih `null`, tombol WhatsApp tetap berfungsi: menekannya
membuka jendela yang menampilkan **persis pesan yang akan terkirim**, lengkap
dengan nama produk, kode produk, kendaraan yang dipilih, dan alamat halaman.
Begitu nomornya diisi, tombol yang sama langsung membuka WhatsApp.

### Ketentuan pengiriman, retur, dan pembayaran belum diisi

Halaman Syarat dan Ketentuan menyebutkan secara netral bahwa ketiganya akan
diisi pemilik toko. Isinya sengaja tidak dikarang. Ongkos kirim, lama
pengiriman, dan syarat retur **tidak ada satu pun yang ditulis sebagai
perkiraan**.

---

## 2. Apa yang sudah nyata dan apa yang masih simulasi

| Bagian | Status | Keterangan |
|---|---|---|
| Katalog, pencarian, filter, pengurutan | **Nyata** | Berjalan penuh atas data contoh |
| Sistem kecocokan kendaraan | **Nyata** | Penyaringan, pengingatan pilihan, penandaan cocok atau tidak |
| Keranjang | **Nyata** | Tersimpan di peramban, bertahan antar halaman |
| Alur checkout (alamat, pengiriman, ringkasan, konfirmasi) | **Nyata** | Empat langkah berjalan penuh |
| Validasi form | **Nyata** | Diperiksa di browser **dan** di server |
| Perhitungan harga dan total | **Nyata** | Dihitung ulang di server dari katalog, bukan dari kiriman browser |
| Cookie consent | **Nyata** | Benar-benar mengubah tempat penyimpanan pilihan kendaraan |
| Halaman cek pesanan | **Nyata, dengan batas** | Lihat catatan penyimpanan pesanan di bawah |
| **Pembayaran** | **SIMULASI** | Tidak menagih, tidak memindahkan uang, tidak menghubungi siapa pun |
| **Ongkos kirim** | **TARIF CONTOH** | Angka karangan, ditandai jelas di layar |
| **Penyimpanan pesanan** | **BELUM AWET** | Di memori server, hilang saat server dimulai ulang |

### Yang dijamin tidak ada

- **Nol kunci API di dalam kode.** Seluruh kunci hanya dibaca dari variabel
  lingkungan di sisi server.
- **Nol permintaan data kartu.** Tidak ada kolom nomor kartu, tanggal
  kedaluwarsa, atau CVV di mana pun.
- **Nol klaim.** Tidak ada rating, jumlah ulasan, jumlah penjualan, tahun
  berdiri, testimoni, klaim keaslian barang, klaim garansi resmi, atau janji
  waktu pengiriman.

---

## 3. Cara menyambungkan pembayaran

Lapisan pembayaran memakai satu antarmuka dengan tiga implementasi:

```
src/lib/payments/
├── types.ts       antarmuka bersama
├── demo.ts        mode simulasi (aktif sekarang)
├── xendit.ts      kerangka kosong, siap diisi
└── midtrans.ts    kerangka kosong, siap diisi
```

### Langkah untuk Xendit

1. Di dasbor Vercel, buka **Settings → Environment Variables**, tambahkan:
   - `XENDIT_SECRET_KEY` = kunci rahasia dari dasbor Xendit
   - `PAYMENT_PROVIDER` = `xendit`
2. Buka [`src/lib/payments/xendit.ts`](src/lib/payments/xendit.ts), isi bagian
   bertanda `TODO` dengan pemanggilan Xendit Invoice API, lalu kembalikan
   `urlPembayaran` dari jawabannya.
3. Daftarkan alamat webhook di dasbor Xendit supaya status pesanan ikut berubah
   setelah pembayaran diterima.
4. Deploy ulang.

### Langkah untuk Midtrans

1. Di dasbor Vercel, tambahkan:
   - `MIDTRANS_SERVER_KEY` = server key dari dasbor Midtrans
   - `MIDTRANS_IS_PRODUCTION` = `true` atau `false`
   - `PAYMENT_PROVIDER` = `midtrans`
2. Buka [`src/lib/payments/midtrans.ts`](src/lib/payments/midtrans.ts), isi
   bagian bertanda `TODO` dengan pemanggilan Snap API, kembalikan `redirect_url`
   sebagai `urlPembayaran`.
3. Daftarkan alamat notifikasi pembayaran di dasbor Midtrans.
4. Deploy ulang.

**Jangan pernah menuliskan kunci di dalam berkas kode.** Kunci hanya dibaca dari
variabel lingkungan.

---

## 4. Cara menyambungkan ongkos kirim

Bentuknya sama persis dengan lapisan pembayaran:

```
src/lib/shipping/
├── types.ts        antarmuka bersama
├── demo.ts         tarif contoh (aktif sekarang)
└── aggregator.ts   kerangka kosong, siap diisi
```

1. Tambahkan variabel lingkungan:
   - `SHIPPING_API_KEY`
   - `SHIPPING_ORIGIN_AREA_ID` (kode wilayah asal pengiriman toko)
   - `SHIPPING_PROVIDER` = `agregator`
2. Isi bagian `TODO` di [`src/lib/shipping/aggregator.ts`](src/lib/shipping/aggregator.ts).
3. Sesuaikan `BERAT_PERKIRAAN_GRAM` di `src/lib/shipping/index.ts`, atau lebih
   baik tambahkan kolom berat asli pada tiap produk di `src/data/catalog.ts`.

---

## 5. Cara membuat pesanan tersimpan permanen

Sekarang pesanan disimpan di **memori server**, jadi hilang setiap kali server
dimulai ulang. Sebagai jaring pengaman, salinan pesanan juga disimpan di
peramban pembeli, sehingga halaman Cek Pesanan tetap bisa membukanya **dari
perangkat yang sama**. Kalau salinan itu yang terpakai, layar mengatakannya apa
adanya.

Supaya kode pesanan bisa dibuka dari perangkat mana pun:

1. Pasang basis data (misalnya Vercel Postgres, Supabase, atau Neon).
2. Tambahkan variabel lingkungan `DATABASE_URL` dan `ORDER_STORE` = `database`.
3. Isi bagian `TODO` di [`src/lib/orders/database-store.ts`](src/lib/orders/database-store.ts).

---

## 6. Mengelola katalog

Semua ada di [`src/data/catalog.ts`](src/data/catalog.ts), dengan komentar
penjelasan di atas tiap bagian:

1. **`KENDARAAN`** — daftar merek, model, dan rentang tahun. Pemilih kendaraan
   dibuat otomatis dari daftar ini.
2. **`KATEGORI`** — lima kategori beserta bentuk grafik penandanya.
3. **Grup kecocokan** — daftar kendaraan yang sering dipakai berulang, ditulis
   sekali supaya tidak perlu diketik ulang di tiap produk.
4. **`PRODUK`** — daftar produk.

Menambah produk: salin satu blok produk, ganti `sku` dan `slug` (harus unik),
lalu ganti isinya. Tidak ada langkah lain. Struktur ini sanggup menampung
ratusan produk tanpa berubah bentuk.

Setelah mengubah katalog, buat ulang grafik penandanya:

```bash
npm run graphics
```

---

## 7. Gambar

Semua gambar adalah **SVG generatif** yang dibuat dari skrip
[`scripts/generate-graphics.mjs`](scripts/generate-graphics.mjs), bukan foto stok
dan bukan gambar acak dari internet. Hasilnya deterministik: data yang sama
selalu menghasilkan gambar yang sama, jadi aman diregenerasi kapan saja.

Tiap kategori punya komposisi geometris berbeda supaya kartunya bisa dibedakan
sekilas:

| Kategori | Bentuk |
|---|---|
| Sparepart | Piringan rem, lingkaran baut, sudut kaliper |
| Aksesoris | Susunan modul persegi bertingkat |
| Oli dan Cairan | Lapisan mendatar dan gelas ukur |
| Audio | Kerucut speaker dan batang spektrum |
| Perawatan | Kipas garis memancar dan sapuan busur |

Tidak ada gambar yang berpura-pura menjadi foto produk sungguhan, dan tidak ada
logo merek kendaraan mana pun. Kalau ada berkas gambar gagal dimuat, yang muncul
adalah bidang cadangan yang rapi, bukan ikon rusak.

Tidak ada grain, noise, dither, atau tekstur bintik di bagian mana pun dari
situs ini, termasuk di layar pembuka.

---

## 8. Huruf

Neue Montreal, diubah ke WOFF2 dan disajikan dari server sendiri
(`src/fonts/`). Tiga berat: Regular 400, Medium 500, Bold 700, total sekitar
72 KB. Tidak ada permintaan ke penyedia font pihak ketiga.

Berkas TTF Medium ikut disimpan karena pembuat OG image tidak bisa membaca
WOFF2.

---

## 9. Menjalankan di komputer sendiri

```bash
npm install
npm run dev
```

Perintah lain:

```bash
npm run build      # build produksi
npm run start      # menjalankan hasil build
npm run graphics   # membuat ulang seluruh SVG placeholder
```

---

## 10. Catatan teknis

- **`images.unoptimized = true`** di `next.config.ts` disetel sejak awal dan
  **jangan dinyalakan lagi**. Kuota Vercel Image Optimization pada akun ini
  sudah habis; kalau optimizer menyala, semua gambar dijawab 402 dan halaman
  produksi jadi kosong. Seluruh gambar di situs ini berupa SVG ringan, jadi
  tidak ada yang hilang karena dimatikan.
- **Skala z-index** didefinisikan sekali sebagai token di
  [`src/app/globals.css`](src/app/globals.css). Tidak ada angka z-index mentah
  di dalam kode. Urutannya: konten < header < bar keranjang < panel filter <
  menu mobile < drawer dan modal < cookie banner < tirai transisi < skip link.
- **Lenis** hanya aktif di layar lebar non-sentuh, dan dimatikan saat ada
  panel, drawer, atau modal terbuka, serta di seluruh alur keranjang dan
  checkout.
- **Urutan transisi halaman** memakai `tunggu()` di
  [`src/lib/tunggu.ts`](src/lib/tunggu.ts), yang mengadu `requestAnimationFrame`
  dengan `setTimeout`. Kalau hanya mengandalkan rAF, tirai akan tersangkut
  selamanya begitu tab dipindah ke belakang.
- **Komponen dari componentry.dev**: yang dipakai hanya
  **Split Flap Display**, disesuaikan dengan token warna di sini dan ditambah
  label aksesibilitas. Komponen lain yang sempat dipertimbangkan ditolak karena
  bertabrakan dengan arah desain: keluarga dither, pixel, ASCII, matrix rain,
  plasma, aurora, dan liquid melanggar larangan tekstur bintik; `hero-geometric`
  memakai shader simplex noise dan menyeret Three.js untuk hero yang seharusnya
  berisi alat kerja, bukan gambar; sisanya butuh framer-motion untuk efek kursor
  yang tidak menambah apa pun pada toko sparepart.

---

## 11. Struktur halaman

| Alamat | Isi |
|---|---|
| `/` | Hero satu layar berisi pemilih kendaraan dan pencarian, kategori, produk pilihan |
| `/katalog` | Katalog lengkap dengan pencarian, filter, pengurutan, pemuatan bertahap |
| `/katalog/[kategori]` | Katalog per kategori (5 halaman) |
| `/produk/[slug]` | Halaman produk dengan tabel kecocokan (31 halaman) |
| `/cek-kecocokan` | Pengecekan kecocokan kendaraan |
| `/cek-pesanan` | Pencarian status pesanan lewat kode |
| `/kontak` | Data kontak dan form pesan |
| `/keranjang` | Keranjang belanja |
| `/checkout` | Alur checkout empat langkah |
| `/privacy` | Kebijakan privasi |
| `/terms` | Syarat dan ketentuan |

Menu utama berisi lima halaman: Home, Katalog, Cek Kecocokan, Cek Pesanan,
Kontak. Keranjang menjadi ikon di header, bukan item menu.

---

## 12. Hasil verifikasi di produksi

Diperiksa langsung terhadap `https://otomotif.onyxcreative.asia` dengan Chrome
headless, bukan hanya di komputer sendiri.

**Halaman dan aset**

| Pemeriksaan | Hasil |
|---|---|
| Status semua route yang diuji | 200, dan alamat yang tidak ada menjawab 404 |
| Gambar rusak | 0 |
| Permintaan jaringan gagal | 0 |
| Galat console | 0 |
| Overflow horizontal di 375, 768, dan 1440 | 0 di ketiga lebar |
| Judul melebihi batas baris per lebar layar | 0 |
| Hero muat satu layar | 752 / 964 / 828 px, tepat setinggi layar dikurangi header |

**Sistem kecocokan kendaraan dan alur belanja** — 22 dari 22 pemeriksaan lulus,
antara lain: katalog tersaring dari 31 menjadi 26 produk setelah memilih Toyota
Avanza 2019; pilihan kendaraan bertahan saat pindah halaman; halaman produk
menandai cocok, tidak cocok, dan cocok untuk semua kendaraan dengan benar;
mengganti merek mengosongkan model dan tahun; drawer keranjang mengunci lalu
melepas scroll halaman; alur checkout berjalan sampai layar konfirmasi dan
menghasilkan kode pesanan yang bisa dibuka lagi di halaman Cek Pesanan.

**Struktur, mobile, dan SEO** — 11 dari 11 pemeriksaan lulus: hamburger membuka
dan menutup menu beserta kunci scroll; panel filter mobile berperilaku sama;
data terstruktur Product dan BreadcrumbList terbaca dan tidak memuat rating atau
ulasan karangan; canonical benar; sitemap berisi 43 alamat termasuk seluruh 31
halaman produk dan 5 halaman kategori, tanpa halaman keranjang dan checkout.

**Sisir keamanan** — nol kunci API di seluruh kode, nol kolom yang meminta data
kartu, nol berkas `.env` yang ikut ter-commit, dan nol angka z-index mentah di
luar token `globals.css`.

**Yang belum terlihat mata.** Browser pane di lingkungan kerja ini tidak
menggambar frame, jadi seluruh gerakan (layar pembuka, tirai transisi antar
halaman, papan split flap, dan animasi muncul saat digulir) belum pernah dilihat
berjalan sebagai gerakan. Yang sudah diperiksa adalah keadaan akhirnya lewat
DOM: nilai `data-fase` tirai, kunci scroll saat lapisan terbuka, label
aksesibilitas papan split flap, dan tangkapan layar hasil render sungguhan.
Timing dan kehalusan gerakannya perlu Anda lihat sendiri sekali di peramban.
