"use client";

/* ============================================================================
 * KENDARAAN YANG SEDANG DIPILIH
 * ----------------------------------------------------------------------------
 * Pilihan pembeli terbawa saat pindah halaman. Ini yang membuat katalog
 * tersaring otomatis dan halaman produk bisa langsung menjawab cocok atau
 * tidak.
 *
 * Berapa lama pilihan itu bertahan ditentukan oleh jawaban pembeli di banner
 * penyimpanan:
 *   - preferensi disetujui  -> disimpan di localStorage, bertahan antar kunjungan
 *   - preferensi ditolak    -> disimpan di sessionStorage, hilang saat tab ditutup
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { kendaraanValid, type Kendaraan } from "@/lib/fitment";
import { usePersetujuan } from "@/components/providers/consent-provider";

const KUNCI = "otomotif:kendaraan";

type IsiKonteks = {
  kendaraan: Kendaraan | null;
  /** false selama pembacaan dari peramban belum selesai. */
  siap: boolean;
  pilih: (k: Kendaraan) => void;
  hapus: () => void;
};

const Konteks = createContext<IsiKonteks | null>(null);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const { preferensi, siap: persetujuanSiap } = usePersetujuan();
  const [kendaraan, setKendaraan] = useState<Kendaraan | null>(null);
  const [siap, setSiap] = useState(false);

  /* Tempat menyimpan mengikuti jawaban di banner penyimpanan. */
  const gudang = useCallback((): Storage | null => {
    try {
      return preferensi ? window.localStorage : window.sessionStorage;
    } catch {
      return null;
    }
  }, [preferensi]);

  useEffect(() => {
    if (!persetujuanSiap) return;
    try {
      const mentah = gudang()?.getItem(KUNCI);
      if (mentah) {
        const tersimpan = JSON.parse(mentah) as Kendaraan;
        /* Pilihan lama yang sudah tidak ada di tabel kendaraan dibuang,
           bukan dipaksakan tetap terpakai. */
        if (kendaraanValid(tersimpan)) setKendaraan(tersimpan);
        else gudang()?.removeItem(KUNCI);
      }
    } catch {
      /* Peramban bisa menolak penyimpanan, misalnya di mode penyamaran. */
    }
    setSiap(true);
  }, [persetujuanSiap, gudang]);

  const pilih = useCallback(
    (k: Kendaraan) => {
      setKendaraan(k);
      try {
        gudang()?.setItem(KUNCI, JSON.stringify(k));
      } catch {
        /* Diabaikan. */
      }
    },
    [gudang]
  );

  const hapus = useCallback(() => {
    setKendaraan(null);
    try {
      window.localStorage.removeItem(KUNCI);
      window.sessionStorage.removeItem(KUNCI);
    } catch {
      /* Diabaikan. */
    }
  }, []);

  const nilai = useMemo<IsiKonteks>(
    () => ({ kendaraan, siap, pilih, hapus }),
    [kendaraan, siap, pilih, hapus]
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useKendaraan() {
  const isi = useContext(Konteks);
  if (!isi) throw new Error("useKendaraan dipakai di luar VehicleProvider");
  return isi;
}
