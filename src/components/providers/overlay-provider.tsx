"use client";

/* ============================================================================
 * PENGATUR LAPISAN MENGAMBANG
 * ----------------------------------------------------------------------------
 * Panel filter, drawer keranjang, menu mobile, dan modal semuanya mendaftar
 * ke sini. Satu tempat yang memutuskan kapan scroll halaman dikunci dan kapan
 * dilepas kembali, supaya keempatnya tidak saling menimpa.
 *
 * Ini juga yang dibaca Lenis untuk berhenti selama ada yang terbuka.
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type NamaLapisan = "filter" | "keranjang" | "menu" | "modal";

type IsiKonteks = {
  terbuka: Record<NamaLapisan, boolean>;
  adaYangTerbuka: boolean;
  setTerbuka: (nama: NamaLapisan, nilai: boolean) => void;
  tutupSemua: () => void;
};

const Konteks = createContext<IsiKonteks | null>(null);

const AWAL: Record<NamaLapisan, boolean> = {
  filter: false,
  keranjang: false,
  menu: false,
  modal: false,
};

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [terbuka, setSemua] = useState<Record<NamaLapisan, boolean>>(AWAL);
  const posisiTersimpan = useRef(0);
  const sedangTerkunci = useRef(false);

  const adaYangTerbuka = Object.values(terbuka).some(Boolean);

  const setTerbuka = useCallback((nama: NamaLapisan, nilai: boolean) => {
    setSemua((sebelum) => (sebelum[nama] === nilai ? sebelum : { ...sebelum, [nama]: nilai }));
  }, []);

  const tutupSemua = useCallback(() => setSemua(AWAL), []);

  /* Kunci dan lepas scroll halaman. Memakai position: fixed supaya juga
     bekerja di Safari iOS, dan mengembalikan posisi scroll persis seperti
     sebelum dikunci. */
  useEffect(() => {
    const body = document.body;

    if (adaYangTerbuka && !sedangTerkunci.current) {
      sedangTerkunci.current = true;
      posisiTersimpan.current = window.scrollY;

      /* Ganti lebar batang scroll dengan padding supaya isi halaman
         tidak melompat ke samping saat dikunci. */
      const lebarBatang = window.innerWidth - document.documentElement.clientWidth;

      body.dataset.scrollLock = "true";
      body.style.position = "fixed";
      body.style.top = `-${posisiTersimpan.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      if (lebarBatang > 0) body.style.paddingRight = `${lebarBatang}px`;
      return;
    }

    if (!adaYangTerbuka && sedangTerkunci.current) {
      sedangTerkunci.current = false;
      delete body.dataset.scrollLock;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.paddingRight = "";
      window.scrollTo(0, posisiTersimpan.current);
    }
  }, [adaYangTerbuka]);

  /* Tombol Escape menutup semuanya. */
  useEffect(() => {
    if (!adaYangTerbuka) return;
    const saatTekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutupSemua();
    };
    window.addEventListener("keydown", saatTekan);
    return () => window.removeEventListener("keydown", saatTekan);
  }, [adaYangTerbuka, tutupSemua]);

  /* Kalau layar melebar melewati titik mobile, menu mobile ikut ditutup. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const saatUbah = () => {
      if (mq.matches) {
        setTerbuka("menu", false);
        setTerbuka("filter", false);
      }
    };
    mq.addEventListener("change", saatUbah);
    return () => mq.removeEventListener("change", saatUbah);
  }, [setTerbuka]);

  const nilai = useMemo<IsiKonteks>(
    () => ({ terbuka, adaYangTerbuka, setTerbuka, tutupSemua }),
    [terbuka, adaYangTerbuka, setTerbuka, tutupSemua]
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useOverlay() {
  const isi = useContext(Konteks);
  if (!isi) throw new Error("useOverlay dipakai di luar OverlayProvider");
  return isi;
}
