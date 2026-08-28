"use client";

/* ============================================================================
 * GAMBAR PRODUK
 * ----------------------------------------------------------------------------
 * Semua gambar di situs ini adalah grafik placeholder buatan sendiri, bukan
 * foto produk. Tidak ada yang berpura-pura menjadi foto barang sungguhan dan
 * tidak ada logo merek kendaraan mana pun.
 *
 * Kalau berkasnya gagal dimuat, yang muncul adalah bidang cadangan yang rapi,
 * bukan ikon gambar rusak bawaan peramban.
 * ========================================================================== */

import { useState } from "react";

type Props = {
  sku: string;
  nama: string;
  className?: string;
  /** Beri tahu peramban gambar mana yang perlu didahulukan. */
  prioritas?: boolean;
};

export function ProductGraphic({ sku, nama, className = "", prioritas = false }: Props) {
  const [gagal, setGagal] = useState(false);

  if (gagal) return <GrafikCadangan className={className} />;

  return (
    /* Memakai <img> biasa, bukan komponen gambar Next, karena seluruh berkasnya
       sudah berupa SVG ringan dan pengoptimal gambar sengaja dimatikan. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/graphics/produk/${sku}.svg`}
      alt=""
      aria-hidden="true"
      width={640}
      height={480}
      loading={prioritas ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={prioritas ? "high" : "auto"}
      onError={() => setGagal(true)}
      className={`h-full w-full object-cover ${className}`}
      data-nama={nama}
    />
  );
}

export function CategoryGraphic({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const [gagal, setGagal] = useState(false);
  if (gagal) return <GrafikCadangan className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/graphics/kategori/${slug}.svg`}
      alt=""
      aria-hidden="true"
      width={800}
      height={500}
      loading="lazy"
      decoding="async"
      onError={() => setGagal(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** Bidang cadangan. Digambar langsung, jadi tidak mungkin ikut gagal dimuat. */
export function GrafikCadangan({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid-field flex h-full w-full items-center justify-center bg-paper ${className}`}
    >
      <span className="h-[3px] w-16 bg-accent" />
    </div>
  );
}
