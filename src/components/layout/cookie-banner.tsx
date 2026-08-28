"use client";

/* ============================================================================
 * BANNER PENYIMPANAN DI PERAMBAN
 * ----------------------------------------------------------------------------
 * Dua hal yang sengaja dijaga di sini:
 *
 * 1. Banner menyingkir sendiri saat menu mobile, drawer keranjang, panel
 *    filter, atau modal sedang terbuka. Skala z-index menaruh banner di atas
 *    semuanya, jadi caranya adalah tidak menampilkannya sama sekali selama
 *    ada lapisan lain yang terbuka, bukan mengadu angka z-index.
 *
 * 2. Wadah luarnya tidak menangkap klik sama sekali. Hanya kartunya yang bisa
 *    diklik, jadi tombol melayang di layar kecil tetap bisa ditekan.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import { usePersetujuan } from "@/components/providers/consent-provider";
import { useOverlay } from "@/components/providers/overlay-provider";

export function CookieBanner() {
  const { sudahMemilih, siap, simpanPilihan } = usePersetujuan();
  const { adaYangTerbuka } = useOverlay();
  const [rinciTerbuka, setRinciTerbuka] = useState(false);

  const tampil = siap && !sudahMemilih && !adaYangTerbuka;

  /* Beri tanda ke halaman supaya bar keranjang melayang menyingkir ke atas
     dan tidak saling menutupi dengan banner ini. */
  const kartuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const akar = document.documentElement;

    if (!tampil) {
      delete akar.dataset.cookie;
      akar.style.removeProperty("--cookie-h");
      return;
    }

    akar.dataset.cookie = "tampil";

    /* Tinggi banner diukur langsung, bukan ditebak, supaya bar keranjang
       naik pas setinggi banner walaupun teksnya membungkus jadi lebih tinggi. */
    const kartu = kartuRef.current;
    if (!kartu) return;

    const ukur = () => {
      akar.style.setProperty("--cookie-h", `${Math.ceil(kartu.getBoundingClientRect().height) + 24}px`);
    };
    ukur();

    const pengamat = new ResizeObserver(ukur);
    pengamat.observe(kartu);
    window.addEventListener("resize", ukur);

    return () => {
      pengamat.disconnect();
      window.removeEventListener("resize", ukur);
      delete akar.dataset.cookie;
      akar.style.removeProperty("--cookie-h");
    };
  }, [tampil, rinciTerbuka]);

  if (!tampil) return null;

  return (
    /* pointer-events-none di wadah, pointer-events-auto di kartunya. */
    <div className="layer-cookie pointer-events-none fixed inset-x-0 bottom-0 p-3 sm:p-4">
      <div
        ref={kartuRef}
        role="region"
        aria-label="Pengaturan penyimpanan di peramban"
        className="pointer-events-auto mx-auto w-full max-w-3xl border border-ink bg-panel p-4 shadow-[0_16px_40px_rgba(20,22,26,0.18)] sm:p-5"
      >
        <p className="eyebrow text-ink-2">Penyimpanan di peramban</p>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-ink">
          Situs ini menyimpan isi keranjang di peramban supaya belanja bisa dilanjutkan. Pilihan kendaraan
          juga bisa diingat kalau diizinkan. Tidak ada pelacak pihak ketiga di situs ini.
        </p>

        {rinciTerbuka && (
          <dl className="mt-4 grid gap-3 border-t border-rule pt-4 text-[0.85rem]">
            <div>
              <dt className="font-medium">Wajib, tidak bisa dimatikan</dt>
              <dd className="mt-0.5 text-ink-2">
                Isi keranjang belanja dan catatan pilihan Anda di banner ini. Tanpa keduanya, toko tidak
                bisa dipakai berbelanja.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Preferensi, bisa dimatikan</dt>
              <dd className="mt-0.5 text-ink-2">
                Mengingat kendaraan yang Anda pilih antar kunjungan. Kalau ditolak, pilihan kendaraan hanya
                bertahan selama tab ini masih terbuka.
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => simpanPilihan(true)}
            className="inline-flex h-11 items-center bg-ink px-5 text-[0.85rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
          >
            Izinkan semua
          </button>
          <button
            type="button"
            onClick={() => simpanPilihan(false)}
            className="inline-flex h-11 items-center border border-ink px-5 text-[0.85rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
          >
            Hanya yang wajib
          </button>
          <button
            type="button"
            onClick={() => setRinciTerbuka((s) => !s)}
            aria-expanded={rinciTerbuka}
            className="inline-flex h-11 items-center px-2 text-[0.82rem] text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            {rinciTerbuka ? "Tutup rincian" : "Lihat rincian"}
          </button>
          <TransitionLink
            href="/privacy"
            className="inline-flex h-11 items-center px-2 text-[0.82rem] text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Kebijakan Privasi
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

/** Tombol kecil untuk membuka lagi pilihan penyimpanan, dipakai di footer. */
export function TombolAturPenyimpanan({ className = "" }: { className?: string }) {
  const { bukaLagi } = usePersetujuan();
  return (
    <button
      type="button"
      onClick={bukaLagi}
      className={`text-left underline underline-offset-4 transition-colors ${className}`}
    >
      Atur penyimpanan peramban
    </button>
  );
}
