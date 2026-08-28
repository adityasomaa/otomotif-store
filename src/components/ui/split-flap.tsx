"use client";

/* ============================================================================
 * PAPAN SPLIT FLAP
 * ----------------------------------------------------------------------------
 * Diambil dari componentry.dev (komponen "Split Flap Display"), lalu
 * disesuaikan dengan arah desain di sini:
 *   - warna kerasnya diganti dengan token dari globals.css
 *   - ukuran dan jarak dirapikan supaya masuk ke kisi teknis situs ini
 *   - ditambah label aksesibilitas: teks lengkapnya dibacakan sekali di induk,
 *     sedangkan tiap huruf disembunyikan dari pembaca layar
 *   - gerakan dimatikan kalau pengguna minta gerakan dikurangi
 *
 * Dipakai untuk membaca status pesanan dan hasil pengecekan kecocokan, karena
 * keduanya adalah bacaan pendek yang memang perlu terlihat sebagai alat ukur.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";

const HURUF = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:-/";

function hurufBerikutnya(sekarang: string): string {
  const i = HURUF.indexOf(sekarang);
  if (i === -1 || i >= HURUF.length - 1) return HURUF[0];
  return HURUF[i + 1];
}

type UkuranFlap = "sm" | "md";

function Flap({
  target,
  jeda,
  ukuran,
  kecepatan,
}: {
  target: string;
  jeda: number;
  ukuran: UkuranFlap;
  kecepatan: number;
}) {
  const [tampil, setTampil] = useState(" ");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detak = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const bersihkan = () => {
      if (timer.current) clearTimeout(timer.current);
      if (detak.current) clearInterval(detak.current);
    };
    bersihkan();

    const tujuan = target.toUpperCase();
    const kurangiGerak =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (kurangiGerak) {
      setTampil(HURUF.includes(tujuan) ? tujuan : " ");
      return bersihkan;
    }

    if (!HURUF.includes(tujuan)) {
      setTampil(" ");
      return bersihkan;
    }

    timer.current = setTimeout(() => {
      detak.current = setInterval(() => {
        setTampil((sebelum) => {
          if (sebelum === tujuan) {
            if (detak.current) clearInterval(detak.current);
            return sebelum;
          }
          const berikutnya = hurufBerikutnya(sebelum);
          if (berikutnya === tujuan && detak.current) clearInterval(detak.current);
          return berikutnya;
        });
      }, kecepatan);
    }, jeda);

    return bersihkan;
  }, [target, jeda, kecepatan]);

  const kelasUkuran =
    ukuran === "sm" ? "h-9 w-[22px] text-[15px]" : "h-12 w-[30px] text-[21px]";

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-deep-2 font-medium text-chalk tabular-nums select-none ${kelasUkuran}`}
    >
      {/* Garis engsel di tengah, penanda khas papan mekanis.
          Ditulis lebih dulu di DOM lalu hurufnya menyusul, jadi hurufnya
          tergambar di atas garis tanpa perlu angka z-index sama sekali. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-deep" />
      <span className="relative">{tampil}</span>
    </span>
  );
}

export function SplitFlap({
  teks,
  kolom,
  ukuran = "md",
  kecepatan = 38,
  jedaAntarHuruf = 55,
  label,
}: {
  teks: string;
  /** Jumlah kotak. Teks yang lebih pendek diisi spasi. */
  kolom?: number;
  ukuran?: UkuranFlap;
  kecepatan?: number;
  jedaAntarHuruf?: number;
  /** Bacaan untuk pembaca layar. Kalau kosong, dipakai teksnya sendiri. */
  label?: string;
}) {
  const isi = teks.toUpperCase();
  const total = kolom ?? isi.length;
  const huruf = isi.padEnd(total, " ").slice(0, total).split("");

  return (
    /* Teks lengkapnya dibacakan sekali di sini. Tiap kotak huruf di dalamnya
       disembunyikan dari pembaca layar supaya tidak dieja satu per satu. */
    <span role="img" aria-label={label ?? teks} className="inline-flex flex-wrap gap-[2px]">
      {huruf.map((h, i) => (
        <Flap key={i} target={h} jeda={i * jedaAntarHuruf} ukuran={ukuran} kecepatan={kecepatan} />
      ))}
    </span>
  );
}
