"use client";

/* ============================================================================
 * SCROLL HALUS (LENIS)
 * ----------------------------------------------------------------------------
 * Sengaja TIDAK dinyalakan di mana-mana. Lenis hanya hidup kalau semua syarat
 * di bawah terpenuhi:
 *
 *   - bukan perangkat sentuh, dan lebar layar minimal 1024px
 *     (di tablet dan ponsel scroll bawaan sistem terasa jauh lebih benar)
 *   - tidak ada panel filter, drawer keranjang, menu, atau modal yang terbuka
 *   - bukan sedang di halaman keranjang atau alur checkout
 *     (form harus tetap gesit, scroll halus bikin isian terasa berat)
 *   - pengguna tidak sedang minta gerakan dikurangi
 * ========================================================================== */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useOverlay } from "@/components/providers/overlay-provider";

const RUTE_TANPA_SCROLL_HALUS = ["/keranjang", "/checkout"];

export function LenisProvider() {
  const { adaYangTerbuka } = useOverlay();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef(0);

  const diAlurBelanja = RUTE_TANPA_SCROLL_HALUS.some((r) => pathname.startsWith(r));

  useEffect(() => {
    const bolehHidup = () => {
      if (typeof window === "undefined") return false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (window.matchMedia("(pointer: coarse)").matches) return false;
      if (window.innerWidth < 1024) return false;
      return true;
    };

    const matikan = () => {
      cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };

    const nyalakan = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        /* Sentuhan tetap memakai scroll bawaan sistem. */
        syncTouch: false,
      });
      lenisRef.current = lenis;

      const putar = (waktu: number) => {
        lenis.raf(waktu);
        rafRef.current = requestAnimationFrame(putar);
      };
      rafRef.current = requestAnimationFrame(putar);
    };

    const periksa = () => {
      if (bolehHidup() && !diAlurBelanja) nyalakan();
      else matikan();
    };

    periksa();
    window.addEventListener("resize", periksa);
    return () => {
      window.removeEventListener("resize", periksa);
      matikan();
    };
  }, [diAlurBelanja]);

  /* Berhenti selama ada lapisan mengambang yang terbuka, lalu jalan lagi. */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (adaYangTerbuka) lenis.stop();
    else lenis.start();
  }, [adaYangTerbuka]);

  /* Balik ke posisi paling atas tanpa animasi setiap ganti halaman, supaya
     tidak berkelahi dengan urutan tirai. */
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
