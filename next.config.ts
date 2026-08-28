import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Pengoptimal gambar Vercel sengaja dimatikan.
       Kuota optimasi gambar di akun ini sudah habis; kalau optimizer menyala,
       semua gambar dijawab 402 dan halaman produksi jadi kosong.
       Seluruh gambar di situs ini berupa SVG buatan sendiri yang sudah ringan,
       jadi tidak ada yang hilang karena dimatikan. */
    unoptimized: true,
  }
};

export default nextConfig;
