"use client";

/* ============================================================================
 * KERANJANG
 * ----------------------------------------------------------------------------
 * Isi keranjang disimpan sebagai pasangan kode produk dan jumlah saja.
 * Nama dan harga selalu dibaca ulang dari katalog, jadi kalau harga diubah di
 * file data, keranjang lama ikut menyesuaikan dan tidak memakai harga basi.
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUK, type Produk } from "@/data/catalog";

const KUNCI = "otomotif:keranjang";

export type BarisKeranjang = { sku: string; jumlah: number };

export type BarisTerisi = {
  sku: string;
  jumlah: number;
  produk: Produk;
  subtotal: number;
};

type IsiKonteks = {
  baris: BarisKeranjang[];
  isi: BarisTerisi[];
  jumlahBarang: number;
  subtotal: number;
  siap: boolean;
  tambah: (sku: string, jumlah?: number) => void;
  ubahJumlah: (sku: string, jumlah: number) => void;
  hapus: (sku: string) => void;
  kosongkan: () => void;
};

const Konteks = createContext<IsiKonteks | null>(null);

/** Batas atas per barang, sama dengan yang diperiksa di server. */
const MAKS_PER_BARANG = 99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [baris, setBaris] = useState<BarisKeranjang[]>([]);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const mentah = window.localStorage.getItem(KUNCI);
      if (mentah) {
        const tersimpan = JSON.parse(mentah) as BarisKeranjang[];
        if (Array.isArray(tersimpan)) {
          /* Buang barang yang sudah tidak ada di katalog. */
          setBaris(
            tersimpan
              .filter((b) => b && typeof b.sku === "string" && PRODUK.some((p) => p.sku === b.sku))
              .map((b) => ({ sku: b.sku, jumlah: Math.min(MAKS_PER_BARANG, Math.max(1, Number(b.jumlah) || 1)) }))
          );
        }
      }
    } catch {
      /* Diabaikan. */
    }
    setSiap(true);
  }, []);

  const simpan = useCallback((berikutnya: BarisKeranjang[]) => {
    setBaris(berikutnya);
    try {
      window.localStorage.setItem(KUNCI, JSON.stringify(berikutnya));
    } catch {
      /* Diabaikan. */
    }
  }, []);

  const tambah = useCallback(
    (sku: string, jumlah = 1) => {
      setBaris((sebelum) => {
        const produk = PRODUK.find((p) => p.sku === sku);
        if (!produk || produk.stok <= 0) return sebelum;

        const adaIndex = sebelum.findIndex((b) => b.sku === sku);
        const batas = Math.min(MAKS_PER_BARANG, produk.stok);
        const berikutnya =
          adaIndex >= 0
            ? sebelum.map((b, i) =>
                i === adaIndex ? { ...b, jumlah: Math.min(batas, b.jumlah + jumlah) } : b
              )
            : [...sebelum, { sku, jumlah: Math.min(batas, Math.max(1, jumlah)) }];

        try {
          window.localStorage.setItem(KUNCI, JSON.stringify(berikutnya));
        } catch {
          /* Diabaikan. */
        }
        return berikutnya;
      });
    },
    []
  );

  const ubahJumlah = useCallback(
    (sku: string, jumlah: number) => {
      const produk = PRODUK.find((p) => p.sku === sku);
      const batas = Math.min(MAKS_PER_BARANG, produk?.stok ?? MAKS_PER_BARANG);
      if (jumlah <= 0) {
        simpan(baris.filter((b) => b.sku !== sku));
        return;
      }
      simpan(baris.map((b) => (b.sku === sku ? { ...b, jumlah: Math.min(batas, jumlah) } : b)));
    },
    [baris, simpan]
  );

  const hapus = useCallback((sku: string) => simpan(baris.filter((b) => b.sku !== sku)), [baris, simpan]);
  const kosongkan = useCallback(() => simpan([]), [simpan]);

  const isi = useMemo<BarisTerisi[]>(
    () =>
      baris
        .map((b) => {
          const produk = PRODUK.find((p) => p.sku === b.sku);
          if (!produk) return null;
          return { sku: b.sku, jumlah: b.jumlah, produk, subtotal: produk.harga * b.jumlah };
        })
        .filter((b): b is BarisTerisi => b !== null),
    [baris]
  );

  const jumlahBarang = useMemo(() => isi.reduce((t, b) => t + b.jumlah, 0), [isi]);
  const subtotal = useMemo(() => isi.reduce((t, b) => t + b.subtotal, 0), [isi]);

  const nilai = useMemo<IsiKonteks>(
    () => ({ baris, isi, jumlahBarang, subtotal, siap, tambah, ubahJumlah, hapus, kosongkan }),
    [baris, isi, jumlahBarang, subtotal, siap, tambah, ubahJumlah, hapus, kosongkan]
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useKeranjang() {
  const isi = useContext(Konteks);
  if (!isi) throw new Error("useKeranjang dipakai di luar CartProvider");
  return isi;
}
