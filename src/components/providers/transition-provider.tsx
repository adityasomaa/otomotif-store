"use client";

/* ============================================================================
 * TRANSISI ANTAR HALAMAN
 * ----------------------------------------------------------------------------
 * Urutannya selalu sama:
 *
 *   1. halaman menutup      tirai masuk menutupi layar
 *   2. isi halaman berganti  router.push dijalankan saat tirai sudah penuh
 *   3. scroll balik ke atas  masih dalam keadaan tertutup
 *   4. halaman membuka       tirai keluar
 *
 * Semua perubahan isi terjadi ketika layar tertutup, jadi tidak pernah
 * terlihat berkedip atau melompat.
 *
 * Penungguan waktunya memakai tunggu() yang mengadu requestAnimationFrame
 * dengan setTimeout. Kalau hanya mengandalkan requestAnimationFrame, tirai
 * akan berhenti selamanya begitu tab dipindah ke belakang.
 *
 * Ada dua tampilan:
 *   varian "home"    dipakai saat pertama membuka situs dan saat menuju Home
 *   varian "halaman" dipakai untuk perpindahan ke halaman lain
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { tunggu } from "@/lib/tunggu";

export type FaseTransisi = "awal" | "diam" | "menutup" | "membuka";
export type VarianTirai = "home" | "halaman";

const DURASI = {
  tutup: 560,
  buka: 620,
  /* Berapa lama tirai bertahan tertutup setelah isi diganti, supaya
     perpindahannya terbaca sebagai satu gerakan, bukan kedipan. */
  tahan: 140,
  /* Batas paling lama menunggu halaman baru selesai dipasang. Kalau lewat,
     urutan tetap dilanjutkan supaya tirai tidak pernah tersangkut. */
  batasNavigasi: 2000,
  introHome: 1150,
};

type IsiKonteks = {
  fase: FaseTransisi;
  varian: VarianTirai;
  navigasi: (href: string) => void;
  selesaiIntro: () => void;
};

const Konteks = createContext<IsiKonteks | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [fase, setFase] = useState<FaseTransisi>("awal");
  const [varian, setVarian] = useState<VarianTirai>("home");

  const sedangBerpindah = useRef(false);
  const penungguRute = useRef<(() => void) | null>(null);

  /* Dipanggil setiap kali alamat halaman benar-benar berganti. */
  useEffect(() => {
    if (penungguRute.current) {
      penungguRute.current();
      penungguRute.current = null;
    }
  }, [pathname]);

  const kurangiGerak = useCallback(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  /* Dipanggil layar pembuka setelah hitungannya selesai. Tirai dibuka dengan
     gerakan yang sama seperti transisi biasa, bukan dihilangkan mendadak. */
  const selesaiIntro = useCallback(() => {
    void (async () => {
      setFase("membuka");
      await tunggu(DURASI.buka);
      setFase("diam");
    })();
  }, []);

  const navigasi = useCallback(
    (href: string) => {
      if (sedangBerpindah.current) return;

      const tujuan = href.split("#")[0];
      if (tujuan === pathname) {
        window.scrollTo({ top: 0, behavior: kurangiGerak() ? "auto" : "smooth" });
        return;
      }

      /* Kalau pengguna minta gerakan dikurangi, langsung pindah saja. */
      if (kurangiGerak()) {
        router.push(href);
        window.scrollTo(0, 0);
        return;
      }

      sedangBerpindah.current = true;
      setVarian(tujuan === "/" ? "home" : "halaman");

      void (async () => {
        try {
          /* 1. Tutup. */
          setFase("menutup");
          await tunggu(DURASI.tutup);

          /* 2. Ganti isi, masih dalam keadaan tertutup. */
          const tibaDiHalamanBaru = new Promise<void>((selesai) => {
            penungguRute.current = selesai;
          });
          router.push(href);
          await Promise.race([tibaDiHalamanBaru, tunggu(DURASI.batasNavigasi)]);
          penungguRute.current = null;

          /* 3. Balik ke atas selagi masih tertutup. */
          window.scrollTo(0, 0);
          await tunggu(DURASI.tahan);

          /* 4. Buka. */
          setFase("membuka");
          await tunggu(DURASI.buka);
          setFase("diam");
        } finally {
          sedangBerpindah.current = false;
        }
      })();
    },
    [pathname, router, kurangiGerak]
  );

  const nilai = useMemo<IsiKonteks>(
    () => ({ fase, varian, navigasi, selesaiIntro }),
    [fase, varian, navigasi, selesaiIntro]
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useTransisi() {
  const isi = useContext(Konteks);
  if (!isi) throw new Error("useTransisi dipakai di luar TransitionProvider");
  return isi;
}

export const DURASI_TRANSISI = DURASI;
