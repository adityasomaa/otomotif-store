/* ============================================================================
 * DATA KATALOG
 * ----------------------------------------------------------------------------
 * SELURUH isi toko ada di file ini: daftar kendaraan, kategori, dan produk.
 * File lain tidak perlu diubah saat menambah atau mengganti produk.
 *
 * SEMUA PRODUK DAN HARGA DI BAWAH INI ADALAH DATA CONTOH.
 * Ganti seluruhnya dengan katalog asli sebelum toko dipakai berjualan.
 *
 * CARA MENAMBAH PRODUK
 *   1. Salin satu blok produk yang sudah ada, dari tanda { sampai },
 *   2. Ganti "sku" dan "slug". Keduanya harus unik.
 *      Tulis slug dengan huruf kecil dan tanda hubung, tanpa spasi.
 *   3. Ganti nama, harga, stok, dan isi daftar kecocokan.
 *   4. Simpan. Tidak ada langkah lain.
 *
 * Struktur ini sanggup menampung ratusan produk tanpa berubah bentuk.
 * ========================================================================== */

/* --------------------------------------------------------------------------
 * 1. KENDARAAN
 * Satu baris = satu model dengan rentang tahun produksinya.
 * Daftar merek, model, dan tahun pada pemilih kendaraan dibuat otomatis
 * dari daftar ini. Untuk menambah sepeda motor, tulis dengan bentuk baris
 * yang sama persis.
 * ------------------------------------------------------------------------ */
export type BarisKendaraan = {
  merek: string;
  model: string;
  tahunMulai: number;
  tahunSelesai: number;
};

export const KENDARAAN: BarisKendaraan[] = [
  { merek: "Toyota", model: "Avanza", tahunMulai: 2004, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Calya", tahunMulai: 2016, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Agya", tahunMulai: 2013, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Innova", tahunMulai: 2004, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Rush", tahunMulai: 2006, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Yaris", tahunMulai: 2006, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Fortuner", tahunMulai: 2005, tahunSelesai: 2026 },
  { merek: "Honda", model: "Brio", tahunMulai: 2012, tahunSelesai: 2026 },
  { merek: "Honda", model: "Jazz", tahunMulai: 2004, tahunSelesai: 2021 },
  { merek: "Honda", model: "Mobilio", tahunMulai: 2014, tahunSelesai: 2023 },
  { merek: "Honda", model: "BR-V", tahunMulai: 2016, tahunSelesai: 2026 },
  { merek: "Honda", model: "HR-V", tahunMulai: 2015, tahunSelesai: 2026 },
  { merek: "Honda", model: "CR-V", tahunMulai: 2007, tahunSelesai: 2026 },
  { merek: "Honda", model: "City", tahunMulai: 2003, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Xenia", tahunMulai: 2004, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Sigra", tahunMulai: 2016, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Ayla", tahunMulai: 2013, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Terios", tahunMulai: 2006, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Gran Max", tahunMulai: 2007, tahunSelesai: 2026 },
  { merek: "Suzuki", model: "Ertiga", tahunMulai: 2012, tahunSelesai: 2026 },
  { merek: "Suzuki", model: "XL7", tahunMulai: 2020, tahunSelesai: 2026 },
  { merek: "Suzuki", model: "Carry", tahunMulai: 2005, tahunSelesai: 2026 },
  { merek: "Suzuki", model: "Baleno", tahunMulai: 2017, tahunSelesai: 2026 },
  { merek: "Mitsubishi", model: "Xpander", tahunMulai: 2017, tahunSelesai: 2026 },
  { merek: "Mitsubishi", model: "Pajero Sport", tahunMulai: 2009, tahunSelesai: 2026 },
  { merek: "Mitsubishi", model: "L300", tahunMulai: 2005, tahunSelesai: 2024 },
  { merek: "Nissan", model: "Grand Livina", tahunMulai: 2007, tahunSelesai: 2019 },
  { merek: "Nissan", model: "March", tahunMulai: 2010, tahunSelesai: 2019 },
  { merek: "Wuling", model: "Confero", tahunMulai: 2017, tahunSelesai: 2026 },
  { merek: "Wuling", model: "Almaz", tahunMulai: 2019, tahunSelesai: 2026 },
  { merek: "Hyundai", model: "Creta", tahunMulai: 2022, tahunSelesai: 2026 },
  { merek: "Hyundai", model: "Stargazer", tahunMulai: 2022, tahunSelesai: 2026 },
];

/* --------------------------------------------------------------------------
 * 2. KATEGORI
 * Kolom "grafik" menentukan bentuk gambar placeholder pada kartu produk.
 * Pilihan yang tersedia: rotor | modul | fluida | gelombang | radial
 * ------------------------------------------------------------------------ */
export type Kategori = {
  slug: string;
  nama: string;
  deskripsi: string;
  grafik: "rotor" | "modul" | "fluida" | "gelombang" | "radial";
};

export const KATEGORI: Kategori[] = [
  {
    slug: "sparepart",
    nama: "Sparepart",
    deskripsi:
      "Komponen pengganti untuk sistem rem, kaki-kaki, kelistrikan, dan mesin, dipilih berdasarkan kecocokan dengan kendaraan.",
    grafik: "rotor",
  },
  {
    slug: "aksesoris",
    nama: "Aksesoris",
    deskripsi:
      "Perlengkapan tambahan untuk interior dan eksterior kendaraan, dari karpet lantai sampai penutup bodi.",
    grafik: "modul",
  },
  {
    slug: "oli-cairan",
    nama: "Oli dan Cairan",
    deskripsi:
      "Oli mesin, oli transmisi, minyak rem, dan cairan pendingin dengan keterangan spesifikasi pada tiap produk.",
    grafik: "fluida",
  },
  {
    slug: "audio",
    nama: "Audio",
    deskripsi:
      "Head unit, speaker, dan perangkat pendukung audio kendaraan beserta ukuran dan kebutuhan pemasangannya.",
    grafik: "gelombang",
  },
  {
    slug: "perawatan",
    nama: "Perawatan",
    deskripsi:
      "Produk pembersih dan perawatan bodi, kaca, dan interior, beserta peralatan pendukungnya.",
    grafik: "radial",
  },
];

/* --------------------------------------------------------------------------
 * 3. GRUP KECOCOKAN
 * Daftar kendaraan yang sering dipakai berulang ditulis sekali di sini,
 * supaya tidak perlu diketik ulang pada tiap produk.
 * Produk tetap boleh menulis daftarnya sendiri kalau itu lebih mudah.
 * ------------------------------------------------------------------------ */
export type BarisKecocokan = {
  merek: string;
  model: string;
  tahunMulai: number;
  tahunSelesai: number;
};

const LCGC: BarisKecocokan[] = [
  { merek: "Toyota", model: "Agya", tahunMulai: 2013, tahunSelesai: 2026 },
  { merek: "Toyota", model: "Calya", tahunMulai: 2016, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Ayla", tahunMulai: 2013, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Sigra", tahunMulai: 2016, tahunSelesai: 2026 },
];

const MPV_KELUARGA: BarisKecocokan[] = [
  { merek: "Toyota", model: "Avanza", tahunMulai: 2004, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Xenia", tahunMulai: 2004, tahunSelesai: 2026 },
  { merek: "Mitsubishi", model: "Xpander", tahunMulai: 2017, tahunSelesai: 2026 },
  { merek: "Suzuki", model: "Ertiga", tahunMulai: 2012, tahunSelesai: 2026 },
  { merek: "Honda", model: "Mobilio", tahunMulai: 2014, tahunSelesai: 2023 },
];

const HONDA_KOMPAK: BarisKecocokan[] = [
  { merek: "Honda", model: "Brio", tahunMulai: 2012, tahunSelesai: 2026 },
  { merek: "Honda", model: "Jazz", tahunMulai: 2004, tahunSelesai: 2021 },
  { merek: "Honda", model: "City", tahunMulai: 2003, tahunSelesai: 2026 },
];

const SUV_MENENGAH: BarisKecocokan[] = [
  { merek: "Toyota", model: "Rush", tahunMulai: 2006, tahunSelesai: 2026 },
  { merek: "Daihatsu", model: "Terios", tahunMulai: 2006, tahunSelesai: 2026 },
  { merek: "Honda", model: "HR-V", tahunMulai: 2015, tahunSelesai: 2026 },
  { merek: "Hyundai", model: "Creta", tahunMulai: 2022, tahunSelesai: 2026 },
];

const NIAGA_RINGAN: BarisKecocokan[] = [
  { merek: "Daihatsu", model: "Gran Max", tahunMulai: 2007, tahunSelesai: 2026 },
  { merek: "Suzuki", model: "Carry", tahunMulai: 2005, tahunSelesai: 2026 },
  { merek: "Mitsubishi", model: "L300", tahunMulai: 2005, tahunSelesai: 2024 },
];

/* --------------------------------------------------------------------------
 * 4. PRODUK
 *
 * Keterangan tiap kolom:
 *   sku          kode produk, tampil di halaman produk dan pesan WhatsApp
 *   slug         potongan alamat halaman, huruf kecil dan tanda hubung saja
 *   nama         nama produk apa adanya
 *   kategori     harus sama persis dengan salah satu slug pada daftar KATEGORI
 *   merekProduk  merek pembuat barangnya, bukan merek kendaraan
 *   harga        angka rupiah polos, tanpa titik dan tanpa tulisan Rp
 *   stok         jumlah barang. 0 berarti habis, 1 sampai 5 ditandai menipis
 *   universal    true kalau barang muat di semua kendaraan
 *   kecocokan    daftar kendaraan yang cocok, diabaikan kalau universal true
 *   ditambahkan  tanggal masuk katalog, dipakai untuk urutan terbaru
 * ------------------------------------------------------------------------ */
export type Produk = {
  sku: string;
  slug: string;
  nama: string;
  kategori: string;
  merekProduk: string;
  harga: number;
  stok: number;
  ringkasan: string;
  spesifikasi: { label: string; nilai: string }[];
  universal: boolean;
  kecocokan: BarisKecocokan[];
  ditambahkan: string;
};

export const PRODUK: Produk[] = [
  /* ---------- Sparepart ---------- */
  {
    sku: "SP-1001",
    slug: "kampas-rem-depan-set",
    nama: "Kampas Rem Depan (Set)",
    kategori: "sparepart",
    merekProduk: "Rodavia",
    harga: 285000,
    stok: 24,
    ringkasan:
      "Kampas rem cakram depan satu set untuk dua sisi roda. Periksa daftar kecocokan sebelum memesan.",
    spesifikasi: [
      { label: "Posisi", nilai: "Roda depan" },
      { label: "Isi", nilai: "4 keping (1 set)" },
      { label: "Bahan", nilai: "Semi metalik" },
    ],
    universal: false,
    kecocokan: MPV_KELUARGA,
    ditambahkan: "2026-08-01",
  },
  {
    sku: "SP-1002",
    slug: "filter-oli-mesin",
    nama: "Filter Oli Mesin",
    kategori: "sparepart",
    merekProduk: "Rodavia",
    harga: 48000,
    stok: 60,
    ringkasan:
      "Filter oli mesin dengan ulir dan diameter yang mengikuti ukuran bawaan kendaraan.",
    spesifikasi: [
      { label: "Tipe", nilai: "Spin-on" },
      { label: "Ulir", nilai: "M20 x 1.5" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...LCGC],
    ditambahkan: "2026-07-28",
  },
  {
    sku: "SP-1003",
    slug: "filter-udara-mesin",
    nama: "Filter Udara Mesin",
    kategori: "sparepart",
    merekProduk: "Rodavia",
    harga: 95000,
    stok: 18,
    ringkasan:
      "Elemen filter udara pengganti dengan bingkai karet yang mengikuti dudukan bawaan.",
    spesifikasi: [
      { label: "Bentuk", nilai: "Panel persegi" },
      { label: "Bahan", nilai: "Kertas berlapis" },
    ],
    universal: false,
    kecocokan: HONDA_KOMPAK,
    ditambahkan: "2026-07-25",
  },
  {
    sku: "SP-1004",
    slug: "busi-iridium-set-4",
    nama: "Busi Iridium (Set 4)",
    kategori: "sparepart",
    merekProduk: "Sparkline",
    harga: 420000,
    stok: 4,
    ringkasan: "Busi dengan elektroda iridium, dijual satu set untuk empat silinder.",
    spesifikasi: [
      { label: "Isi", nilai: "4 batang" },
      { label: "Celah", nilai: "1.0 mm" },
      { label: "Ulir", nilai: "14 mm" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...HONDA_KOMPAK],
    ditambahkan: "2026-08-10",
  },
  {
    sku: "SP-1005",
    slug: "shockbreaker-belakang",
    nama: "Shockbreaker Belakang",
    kategori: "sparepart",
    merekProduk: "Tekanan",
    harga: 675000,
    stok: 0,
    ringkasan:
      "Peredam kejut belakang, dijual satuan. Pemasangan disarankan sepasang kiri dan kanan.",
    spesifikasi: [
      { label: "Posisi", nilai: "Roda belakang" },
      { label: "Jenis", nilai: "Gas" },
      { label: "Isi", nilai: "1 batang" },
    ],
    universal: false,
    kecocokan: SUV_MENENGAH,
    ditambahkan: "2026-07-12",
  },
  {
    sku: "SP-1006",
    slug: "aki-kering-45ah",
    nama: "Aki Kering 45Ah",
    kategori: "sparepart",
    merekProduk: "Voltra",
    harga: 890000,
    stok: 7,
    ringkasan:
      "Aki bebas perawatan dengan terminal standar. Perhatikan posisi kutub sebelum memesan.",
    spesifikasi: [
      { label: "Kapasitas", nilai: "45 Ah" },
      { label: "Tegangan", nilai: "12 V" },
      { label: "Kutub", nilai: "Kanan" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...SUV_MENENGAH],
    ditambahkan: "2026-08-14",
  },
  {
    sku: "SP-1007",
    slug: "wiper-blade-depan-sepasang",
    nama: "Wiper Blade Depan (Sepasang)",
    kategori: "sparepart",
    merekProduk: "Rodavia",
    harga: 135000,
    stok: 32,
    ringkasan:
      "Wiper depan sepasang dengan ukuran berbeda untuk sisi pengemudi dan penumpang.",
    spesifikasi: [
      { label: "Ukuran", nilai: "21 inci dan 18 inci" },
      { label: "Kaitan", nilai: "U-hook" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...HONDA_KOMPAK, ...LCGC],
    ditambahkan: "2026-07-30",
  },
  {
    sku: "SP-1008",
    slug: "tie-rod-end",
    nama: "Tie Rod End",
    kategori: "sparepart",
    merekProduk: "Tekanan",
    harga: 245000,
    stok: 11,
    ringkasan: "Sambungan ujung tie rod dengan karet pelindung. Dijual satuan.",
    spesifikasi: [
      { label: "Posisi", nilai: "Kemudi depan" },
      { label: "Isi", nilai: "1 buah" },
    ],
    universal: false,
    kecocokan: NIAGA_RINGAN,
    ditambahkan: "2026-06-20",
  },
  {
    sku: "SP-1009",
    slug: "tutup-radiator",
    nama: "Tutup Radiator",
    kategori: "sparepart",
    merekProduk: "Rodavia",
    harga: 65000,
    stok: 3,
    ringkasan:
      "Tutup radiator dengan katup tekanan. Perhatikan angka tekanan pada tutup bawaan.",
    spesifikasi: [
      { label: "Tekanan", nilai: "1.1 bar" },
      { label: "Diameter", nilai: "Standar" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...NIAGA_RINGAN],
    ditambahkan: "2026-08-18",
  },

  /* ---------- Aksesoris ---------- */
  {
    sku: "AK-2001",
    slug: "karpet-lantai-set",
    nama: "Karpet Lantai (Set 3 Baris)",
    kategori: "aksesoris",
    merekProduk: "Kabina",
    harga: 750000,
    stok: 9,
    ringkasan:
      "Karpet lantai berbahan karet dengan potongan mengikuti bentuk lantai kabin.",
    spesifikasi: [
      { label: "Isi", nilai: "Set 3 baris" },
      { label: "Bahan", nilai: "Karet PVC" },
      { label: "Warna", nilai: "Hitam" },
    ],
    universal: false,
    kecocokan: MPV_KELUARGA,
    ditambahkan: "2026-08-05",
  },
  {
    sku: "AK-2002",
    slug: "sarung-jok-kulit-sintetis",
    nama: "Sarung Jok Kulit Sintetis",
    kategori: "aksesoris",
    merekProduk: "Kabina",
    harga: 1450000,
    stok: 5,
    ringkasan:
      "Sarung jok berbahan kulit sintetis dengan jahitan mengikuti bentuk sandaran.",
    spesifikasi: [
      { label: "Isi", nilai: "Set penuh" },
      { label: "Bahan", nilai: "Kulit sintetis" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...SUV_MENENGAH],
    ditambahkan: "2026-07-18",
  },
  {
    sku: "AK-2003",
    slug: "cover-bodi-outdoor",
    nama: "Cover Bodi Outdoor",
    kategori: "aksesoris",
    merekProduk: "Kabina",
    harga: 385000,
    stok: 21,
    ringkasan:
      "Penutup bodi dengan lapisan luar tahan air dan lapisan dalam yang lembut.",
    spesifikasi: [
      { label: "Ukuran", nilai: "Mengikuti panjang bodi" },
      { label: "Lapisan", nilai: "2 lapis" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...SUV_MENENGAH, ...HONDA_KOMPAK],
    ditambahkan: "2026-08-12",
  },
  {
    sku: "AK-2004",
    slug: "holder-ponsel-dashboard",
    nama: "Holder Ponsel Dashboard",
    kategori: "aksesoris",
    merekProduk: "Kabina",
    harga: 89000,
    stok: 44,
    ringkasan:
      "Dudukan ponsel dengan penjepit lebar dan kaki perekat untuk permukaan dashboard.",
    spesifikasi: [
      { label: "Lebar jepit", nilai: "60 sampai 95 mm" },
      { label: "Pemasangan", nilai: "Perekat" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-20",
  },
  {
    sku: "AK-2005",
    slug: "kaca-film-kaca-depan",
    nama: "Kaca Film Kaca Depan",
    kategori: "aksesoris",
    merekProduk: "Lumina",
    harga: 620000,
    stok: 6,
    ringkasan:
      "Lembar kaca film untuk kaca depan. Pemasangan dilakukan terpisah oleh pemasang.",
    spesifikasi: [
      { label: "Kegelapan", nilai: "40 persen" },
      { label: "Ukuran", nilai: "1 lembar kaca depan" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...HONDA_KOMPAK, ...SUV_MENENGAH],
    ditambahkan: "2026-06-30",
  },
  {
    sku: "AK-2006",
    slug: "roof-rack-crossbar",
    nama: "Roof Rack Crossbar",
    kategori: "aksesoris",
    merekProduk: "Tekanan",
    harga: 1250000,
    stok: 0,
    ringkasan:
      "Palang atap sepasang dengan pengunci. Hanya untuk kendaraan yang sudah punya rel atap.",
    spesifikasi: [
      { label: "Isi", nilai: "2 batang" },
      { label: "Syarat", nilai: "Ada rel atap bawaan" },
    ],
    universal: false,
    kecocokan: SUV_MENENGAH,
    ditambahkan: "2026-07-02",
  },

  /* ---------- Oli dan Cairan ---------- */
  {
    sku: "OL-3001",
    slug: "oli-mesin-10w-40-4-liter",
    nama: "Oli Mesin 10W-40 (4 Liter)",
    kategori: "oli-cairan",
    merekProduk: "Grivo",
    harga: 395000,
    stok: 38,
    ringkasan:
      "Oli mesin semi sintetik kemasan 4 liter. Cocokkan kekentalan dengan buku manual kendaraan.",
    spesifikasi: [
      { label: "Kekentalan", nilai: "10W-40" },
      { label: "Isi", nilai: "4 liter" },
      { label: "Jenis", nilai: "Semi sintetik" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-08",
  },
  {
    sku: "OL-3002",
    slug: "oli-mesin-5w-30-4-liter",
    nama: "Oli Mesin 5W-30 (4 Liter)",
    kategori: "oli-cairan",
    merekProduk: "Grivo",
    harga: 465000,
    stok: 26,
    ringkasan:
      "Oli mesin sintetik penuh kemasan 4 liter untuk mesin yang mensyaratkan kekentalan 5W-30.",
    spesifikasi: [
      { label: "Kekentalan", nilai: "5W-30" },
      { label: "Isi", nilai: "4 liter" },
      { label: "Jenis", nilai: "Sintetik penuh" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-16",
  },
  {
    sku: "OL-3003",
    slug: "oli-transmisi-matic-1-liter",
    nama: "Oli Transmisi Matic (1 Liter)",
    kategori: "oli-cairan",
    merekProduk: "Grivo",
    harga: 145000,
    stok: 15,
    ringkasan:
      "Oli transmisi otomatis kemasan 1 liter. Periksa tipe transmisi sebelum memesan.",
    spesifikasi: [
      { label: "Isi", nilai: "1 liter" },
      { label: "Untuk", nilai: "Transmisi otomatis" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...SUV_MENENGAH],
    ditambahkan: "2026-07-22",
  },
  {
    sku: "OL-3004",
    slug: "minyak-rem-dot-4-1-liter",
    nama: "Minyak Rem DOT 4 (1 Liter)",
    kategori: "oli-cairan",
    merekProduk: "Grivo",
    harga: 85000,
    stok: 2,
    ringkasan: "Minyak rem spesifikasi DOT 4 kemasan 1 liter.",
    spesifikasi: [
      { label: "Spesifikasi", nilai: "DOT 4" },
      { label: "Isi", nilai: "1 liter" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-19",
  },
  {
    sku: "OL-3005",
    slug: "radiator-coolant-siap-pakai",
    nama: "Radiator Coolant Siap Pakai (1 Liter)",
    kategori: "oli-cairan",
    merekProduk: "Grivo",
    harga: 62000,
    stok: 41,
    ringkasan: "Cairan pendingin siap pakai tanpa perlu dicampur air.",
    spesifikasi: [
      { label: "Isi", nilai: "1 liter" },
      { label: "Kondisi", nilai: "Siap pakai" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-07-05",
  },
  {
    sku: "OL-3006",
    slug: "oli-gardan-sae-90-1-liter",
    nama: "Oli Gardan SAE 90 (1 Liter)",
    kategori: "oli-cairan",
    merekProduk: "Grivo",
    harga: 78000,
    stok: 19,
    ringkasan: "Oli gardan kemasan 1 liter untuk kendaraan penggerak roda belakang.",
    spesifikasi: [
      { label: "Kekentalan", nilai: "SAE 90" },
      { label: "Isi", nilai: "1 liter" },
    ],
    universal: false,
    kecocokan: [...NIAGA_RINGAN, ...SUV_MENENGAH],
    ditambahkan: "2026-06-14",
  },

  /* ---------- Audio ---------- */
  {
    sku: "AU-4001",
    slug: "head-unit-9-inci-android",
    nama: "Head Unit 9 Inci Android",
    kategori: "audio",
    merekProduk: "Sonora",
    harga: 2350000,
    stok: 8,
    ringkasan:
      "Head unit layar sentuh 9 inci. Perlu bingkai dan soket yang sesuai dengan dashboard kendaraan.",
    spesifikasi: [
      { label: "Layar", nilai: "9 inci sentuh" },
      { label: "Dudukan", nilai: "2 DIN" },
      { label: "Catatan", nilai: "Bingkai dijual terpisah" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...SUV_MENENGAH],
    ditambahkan: "2026-08-21",
  },
  {
    sku: "AU-4002",
    slug: "speaker-coaxial-6-5-inci",
    nama: "Speaker Coaxial 6.5 Inci",
    kategori: "audio",
    merekProduk: "Sonora",
    harga: 690000,
    stok: 14,
    ringkasan: "Speaker dua arah ukuran 6.5 inci sepasang untuk dudukan pintu.",
    spesifikasi: [
      { label: "Ukuran", nilai: "6.5 inci" },
      { label: "Isi", nilai: "2 buah" },
      { label: "Daya", nilai: "60 W" },
    ],
    universal: false,
    kecocokan: [...MPV_KELUARGA, ...HONDA_KOMPAK, ...SUV_MENENGAH],
    ditambahkan: "2026-08-03",
  },
  {
    sku: "AU-4003",
    slug: "power-amplifier-4-channel",
    nama: "Power Amplifier 4 Channel",
    kategori: "audio",
    merekProduk: "Sonora",
    harga: 1750000,
    stok: 3,
    ringkasan: "Penguat daya empat kanal untuk speaker depan dan belakang.",
    spesifikasi: [
      { label: "Kanal", nilai: "4" },
      { label: "Daya", nilai: "4 x 60 W" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-07-15",
  },
  {
    sku: "AU-4004",
    slug: "subwoofer-kolong-jok",
    nama: "Subwoofer Kolong Jok",
    kategori: "audio",
    merekProduk: "Sonora",
    harga: 1980000,
    stok: 0,
    ringkasan:
      "Subwoofer tipis yang dipasang di bawah jok, sudah termasuk penguat internal.",
    spesifikasi: [
      { label: "Tinggi", nilai: "70 mm" },
      { label: "Penguat", nilai: "Sudah termasuk" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-06-26",
  },
  {
    sku: "AU-4005",
    slug: "kabel-set-instalasi-audio",
    nama: "Kabel Set Instalasi Audio",
    kategori: "audio",
    merekProduk: "Sonora",
    harga: 320000,
    stok: 27,
    ringkasan: "Paket kabel daya, kabel RCA, dan sekring untuk pemasangan penguat.",
    spesifikasi: [
      { label: "Isi", nilai: "Kabel daya, RCA, sekring" },
      { label: "Panjang", nilai: "5 meter" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-07-09",
  },

  /* ---------- Perawatan ---------- */
  {
    sku: "PR-5001",
    slug: "sampo-bodi-1-liter",
    nama: "Sampo Bodi (1 Liter)",
    kategori: "perawatan",
    merekProduk: "Lumina",
    harga: 75000,
    stok: 52,
    ringkasan: "Sampo pencuci bodi dengan busa banyak, dipakai dengan campuran air.",
    spesifikasi: [
      { label: "Isi", nilai: "1 liter" },
      { label: "Takaran", nilai: "1 banding 100" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-11",
  },
  {
    sku: "PR-5002",
    slug: "wax-poles-bodi-250-ml",
    nama: "Wax Poles Bodi (250 ml)",
    kategori: "perawatan",
    merekProduk: "Lumina",
    harga: 165000,
    stok: 5,
    ringkasan:
      "Pasta poles untuk lapisan cat luar, dipakai setelah bodi dicuci dan kering.",
    spesifikasi: [
      { label: "Isi", nilai: "250 ml" },
      { label: "Bentuk", nilai: "Pasta" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-07-27",
  },
  {
    sku: "PR-5003",
    slug: "pembersih-interior-500-ml",
    nama: "Cairan Pembersih Interior (500 ml)",
    kategori: "perawatan",
    merekProduk: "Lumina",
    harga: 92000,
    stok: 33,
    ringkasan: "Pembersih permukaan dashboard, panel pintu, dan plastik interior.",
    spesifikasi: [
      { label: "Isi", nilai: "500 ml" },
      { label: "Untuk", nilai: "Plastik dan vinil" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-06",
  },
  {
    sku: "PR-5004",
    slug: "lap-microfiber-set-3",
    nama: "Lap Microfiber (Set 3)",
    kategori: "perawatan",
    merekProduk: "Lumina",
    harga: 58000,
    stok: 68,
    ringkasan: "Tiga lembar lap microfiber untuk mengeringkan bodi, kaca, dan interior.",
    spesifikasi: [
      { label: "Isi", nilai: "3 lembar" },
      { label: "Ukuran", nilai: "40 x 40 cm" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-08-22",
  },
  {
    sku: "PR-5005",
    slug: "pembersih-kaca-300-ml",
    nama: "Pembersih Kaca (300 ml)",
    kategori: "perawatan",
    merekProduk: "Lumina",
    harga: 88000,
    stok: 4,
    ringkasan: "Cairan pembersih untuk menghilangkan bercak pada permukaan kaca.",
    spesifikasi: [
      { label: "Isi", nilai: "300 ml" },
      { label: "Untuk", nilai: "Kaca" },
    ],
    universal: true,
    kecocokan: [],
    ditambahkan: "2026-06-18",
  },
];
