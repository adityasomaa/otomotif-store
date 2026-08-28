"use client";

/* ============================================================================
 * TAUTAN DALAM SITUS
 * ----------------------------------------------------------------------------
 * Dipakai sebagai ganti Link biasa supaya setiap perpindahan halaman melewati
 * urutan tirai. Prefetch bawaan Next tetap jalan, jadi halaman tujuan sudah
 * siap sebelum tirai selesai menutup.
 *
 * Klik yang jelas-jelas bukan navigasi biasa (klik tengah, ctrl, cmd, shift,
 * atau target lain) dibiarkan berjalan seperti tautan normal.
 * ========================================================================== */

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransisi } from "@/components/providers/transition-provider";

type Props = ComponentProps<typeof Link> & {
  href: string;
  /** Dijalankan sebelum perpindahan, misalnya untuk menutup drawer. */
  sebelumPindah?: () => void;
};

export function TransitionLink({ href, onClick, sebelumPindah, children, ...sisa }: Props) {
  const { navigasi } = useTransisi();

  const saatKlik = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    /* Biarkan browser menangani cara-cara membuka tab baru. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (sisa.target && sisa.target !== "_self") return;

    /* Tautan ke luar situs dan tautan khusus tidak lewat tirai. */
    if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    e.preventDefault();
    sebelumPindah?.();
    navigasi(href);
  };

  return (
    <Link href={href} onClick={saatKlik} {...sisa}>
      {children}
    </Link>
  );
}
