"use client";

/* ============================================================================
 * TIRAI TRANSISI DAN LAYAR PEMBUKA
 * ----------------------------------------------------------------------------
 * Dua tampilan, satu elemen:
 *   varian "home"    layar pembuka saat pertama membuka situs dan saat ke Home
 *   varian "halaman" tirai singkat untuk perpindahan ke halaman lain
 *
 * Tidak ada grain, noise, atau tekstur bintik di sini. Kedalamannya datang
 * dari garis ukur, bidang geometris, dan kontras.
 * ========================================================================== */

import { useEffect, useState } from "react";
import { useTransisi, DURASI_TRANSISI } from "@/components/providers/transition-provider";
import { NAMA_TOKO } from "@/lib/store-config";

export function Curtain() {
  const { fase, varian, selesaiIntro } = useTransisi();
  const [hitungan, setHitungan] = useState(0);

  /* Layar pembuka: hitungan naik memakai setInterval, bukan
     requestAnimationFrame, supaya tetap berjalan kalau tab disembunyikan. */
  useEffect(() => {
    if (fase !== "awal") return;

    const mulai = Date.now();
    const durasi = DURASI_TRANSISI.introHome;

    const detak = setInterval(() => {
      const lewat = Date.now() - mulai;
      const rasio = Math.min(1, lewat / durasi);
      /* Melambat di ujung supaya terasa berhenti, bukan terpotong. */
      setHitungan(Math.round((1 - Math.pow(1 - rasio, 3)) * 100));
      if (rasio >= 1) clearInterval(detak);
    }, 40);

    /* Jaring pengaman kedua: apa pun yang terjadi pada detak di atas,
       layar pembuka tetap ditutup tepat waktu. */
    const selesai = setTimeout(() => {
      setHitungan(100);
      selesaiIntro();
    }, durasi);

    return () => {
      clearInterval(detak);
      clearTimeout(selesai);
    };
  }, [fase, selesaiIntro]);

  const menutupiLayar = fase === "awal" || fase === "menutup" || fase === "membuka";

  return (
    <div
      className="curtain layer-curtain on-deep"
      data-fase={fase}
      data-varian={varian}
      aria-hidden="true"
      /* Tirai tidak pernah menelan klik ketika sedang tidak menutupi layar. */
      style={{ pointerEvents: menutupiLayar ? "auto" : "none" }}
    >
      <div className="curtain-inner grid-field-deep">
        {varian === "home" ? (
          <div className="curtain-home">
            <div className="curtain-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="34" height="34">
                <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="32" cy="32" r="7.5" fill="currentColor" />
                <rect x="29" y="1.5" width="6" height="14" fill="var(--color-accent)" />
                <rect x="29" y="48.5" width="6" height="14" fill="var(--color-accent)" />
              </svg>
            </div>

            <p className="curtain-wordmark">{NAMA_TOKO}</p>

            <div className="curtain-meter">
              <div className="curtain-meter-track">
                <div className="curtain-meter-fill" style={{ transform: `scaleX(${hitungan / 100})` }} />
              </div>
              <div className="curtain-ticks" aria-hidden="true">
                {Array.from({ length: 21 }, (_, i) => (
                  <span key={i} data-besar={i % 5 === 0 ? "true" : undefined} />
                ))}
              </div>
              <p className="curtain-count" data-tabular>
                {String(hitungan).padStart(3, "0")}
              </p>
            </div>
          </div>
        ) : (
          <div className="curtain-page">
            <span className="curtain-bar" />
            <span className="curtain-dot" />
            <span className="curtain-bar" />
          </div>
        )}
      </div>
    </div>
  );
}
