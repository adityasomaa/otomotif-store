"use client";

/* ============================================================================
 * HERO
 * ----------------------------------------------------------------------------
 * Tingginya tepat satu layar dan isinya langsung alat kerja: pemilih kendaraan
 * dan kolom pencarian. Bukan gambar besar.
 *
 * Beberapa hal yang sengaja dijaga di sini:
 *
 * 1. Memakai 100svh, bukan 100vh. Di ponsel, batang alamat yang menyembunyikan
 *    diri saat digulir membuat 100vh ikut berubah tinggi dan halaman
 *    tersentak. Satuan svh tidak ikut berubah.
 *
 * 2. Grafik latarnya diam total saat digulir. Tidak ada zoom, tidak ada
 *    parallax.
 *
 * 3. Latar ditulis lebih dulu di DOM sebagai elemen absolut, dan isinya
 *    menyusul sebagai elemen relatif TANPA z-index. Dengan begitu isinya tetap
 *    tergambar di atas latar, tapi hero tidak membentuk konteks tumpukan baru.
 *    Kalau hero membentuk konteks sendiri, daftar dropdown di dalamnya akan
 *    terkurung di bawah header dan tertimpa.
 * ========================================================================== */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VehiclePicker, VehicleChip } from "@/components/fitment/vehicle-picker";
import { useTransisi } from "@/components/providers/transition-provider";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { TeksPerHuruf } from "@/components/ui/bits";

export function Hero() {
  const [kata, setKata] = useState("");
  const { navigasi } = useTransisi();
  const { kendaraan, siap } = useKendaraan();
  const router = useRouter();

  const cari = (e: React.FormEvent) => {
    e.preventDefault();
    const q = kata.trim();
    navigasi(q ? `/katalog?q=${encodeURIComponent(q)}` : "/katalog");
  };

  return (
    <section
      aria-labelledby="hero-judul"
      className="on-deep relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-between bg-deep text-chalk"
    >
      {/* -- Latar. Ditulis lebih dulu, diam saat digulir. -- */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="grid-field-deep absolute inset-0" />
        <GrafikHero />
        {/* Peredup di bawah supaya panel alat tetap terbaca. */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep to-transparent" />
      </div>

      {/* -- Isi. Relatif tanpa z-index, jadi tidak mengurung dropdown.
             Jarak dan ukuran sengaja lebih rapat di ponsel supaya seluruh
             isinya tetap muat dalam satu layar tanpa perlu digulir. -- */}
      <div className="shell relative flex w-full flex-1 flex-col justify-between gap-6 py-6 sm:gap-8 sm:py-10 md:py-12">
        <div className="max-w-full">
          <p className="eyebrow text-chalk-2">Toko sparepart dan aksesoris kendaraan</p>
          <h1 id="hero-judul" className="h-display mt-3 text-chalk sm:mt-5">
            <TeksPerHuruf teks="Cari komponen yang cocok" jedaAwal={120} />
          </h1>
          <p className="mt-3 max-w-[52ch] text-[0.92rem] leading-relaxed text-chalk-2 sm:mt-5 sm:text-[1rem] md:text-[1.05rem]">
            Pilih merek, model, dan tahun kendaraan Anda. Katalog akan menampilkan sparepart, aksesoris,
            oli, audio, dan produk perawatan yang sesuai dengan pilihan itu.
          </p>
        </div>

        {/* -- Panel alat -- */}
        <div className="w-full border border-[color:var(--color-control-deep)] bg-deep-2/80 p-3.5 backdrop-blur-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow text-chalk-2">Mulai dari kendaraan Anda</p>
            {siap && kendaraan && <VehicleChip diAtasGelap />}
          </div>

          <div className="mt-3.5 sm:mt-5">
            <VehiclePicker diAtasGelap />
          </div>

          <form onSubmit={cari} className="mt-3 flex gap-2.5 sm:mt-4 sm:gap-3">
            <div className="min-w-0 flex-1">
              {/* Di ponsel labelnya cukup dibaca pembaca layar, supaya tidak
                  memakan satu baris tinggi di layar yang sempit. */}
              <label htmlFor="cari-hero" className="eyebrow mb-2 hidden text-chalk-2 sm:block">
                Atau cari langsung
              </label>
              <span className="sr-only sm:hidden">Atau cari langsung</span>
              <input
                id="cari-hero"
                type="search"
                value={kata}
                onChange={(e) => setKata(e.target.value)}
                placeholder="Cari barang atau kode"
                className="h-12 w-full border border-[color:var(--color-control-deep)] bg-deep px-3.5 text-[0.95rem] text-chalk outline-none transition-colors placeholder:text-chalk-2 focus:border-chalk"
              />
            </div>
            <button
              type="submit"
              className="mt-auto inline-flex h-12 shrink-0 items-center justify-center gap-2.5 bg-accent px-4 text-[0.88rem] font-medium text-ink transition-colors hover:bg-chalk sm:px-6"
            >
              <span className="hidden sm:inline">Lihat katalog</span>
              <span className="sm:hidden">Cari</span>
              <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true">
                <path d="M0 4.5h12M8.5 1L12 4.5L8.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </form>

          <p className="mt-3 text-[0.78rem] leading-relaxed text-chalk-2 sm:mt-4 sm:text-[0.8rem]">
            Belum yakin kendaraan Anda masuk daftar?{" "}
            <button
              type="button"
              onClick={() => navigasi("/cek-kecocokan")}
              className="underline underline-offset-4 hover:text-chalk"
            >
              Buka halaman cek kecocokan
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/* Grafik teknis yang diam. Digambar langsung supaya tidak mungkin gagal
   dimuat, dan sengaja tidak menyerupai foto produk atau logo merek apa pun. */
function GrafikHero() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.5]"
    >
      <g stroke="var(--color-chalk-2)" fill="none" strokeWidth="1" opacity="0.5">
        <circle cx="880" cy="300" r="210" />
        <circle cx="880" cy="300" r="150" />
        <circle cx="880" cy="300" r="70" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={880 + Math.cos(a) * 82}
              y1={300 + Math.sin(a) * 82}
              x2={880 + Math.cos(a) * 142}
              y2={300 + Math.sin(a) * 142}
            />
          );
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3;
          return <circle key={i} cx={880 + Math.cos(a) * 176} cy={300 + Math.sin(a) * 176} r="7" />;
        })}
      </g>
      <path d="M670 300 h-180" stroke="var(--color-accent)" strokeWidth="3" />
      <path
        d="M880 90 a210 210 0 0 1 148 61"
        stroke="var(--color-accent)"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}
