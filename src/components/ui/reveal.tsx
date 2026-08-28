"use client";

/* ============================================================================
 * MUNCUL SAAT MASUK LAYAR
 * ----------------------------------------------------------------------------
 * CATATAN PENTING
 * IntersectionObserver tidak boleh dipasang pada elemen yang salah satu
 * induknya memakai overflow hidden. Di situ rasio perpotongannya selalu nol
 * dan animasinya tidak akan pernah jalan.
 *
 * Karena itu komponen ini memeriksa sendiri rantai induknya saat dipasang.
 * Kalau ada induk yang memotong isi, elemen langsung ditampilkan tanpa
 * animasi, bukan dibiarkan tidak terlihat selamanya.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Jeda dalam milidetik, untuk memberi urutan pada beberapa elemen. */
  jeda?: number;
  className?: string;
  sebagai?: "div" | "section" | "li" | "article";
};

function adaIndukYangMemotong(el: HTMLElement): boolean {
  let induk = el.parentElement;
  while (induk && induk !== document.body) {
    const gaya = window.getComputedStyle(induk);
    if (
      gaya.overflow === "hidden" ||
      gaya.overflowY === "hidden" ||
      gaya.overflowX === "hidden" ||
      gaya.overflow === "clip"
    ) {
      return true;
    }
    induk = induk.parentElement;
  }
  return false;
}

export function Reveal({ children, jeda = 0, className = "", sebagai: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTampil(true);
      return;
    }

    /* Kalau ada induk yang memotong isi, jangan bergantung pada pengamat. */
    if (adaIndukYangMemotong(el)) {
      setTampil(true);
      return;
    }

    const pengamat = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (e.isIntersecting) {
            setTampil(true);
            pengamat.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    pengamat.observe(el);

    /* Jaring pengaman: kalau karena satu dan lain hal pengamat tidak pernah
       berbunyi, isinya tetap ditampilkan. Halaman tidak boleh kosong. */
    const cadangan = setTimeout(() => setTampil(true), 2200);

    return () => {
      pengamat.disconnect();
      clearTimeout(cadangan);
    };
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`}
      data-shown={tampil ? "true" : "false"}
      style={{ transitionDelay: tampil ? `${jeda}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
