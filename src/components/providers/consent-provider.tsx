"use client";

/* ============================================================================
 * PERSETUJUAN PENYIMPANAN DI PERAMBAN
 * ----------------------------------------------------------------------------
 * Pilihan di sini benar-benar menggerakkan sesuatu, bukan sekadar tombol
 * penutup banner.
 *
 * Yang selalu aktif dan tidak bisa dimatikan (kategori "wajib"):
 *   - isi keranjang belanja
 *   - catatan persetujuan ini sendiri
 *   Tanpa keduanya, toko tidak bisa dipakai berbelanja sama sekali.
 *
 * Yang bisa dimatikan (kategori "preferensi"):
 *   - mengingat kendaraan yang dipilih pembeli antar kunjungan
 *   Kalau dimatikan, pilihan kendaraan hanya bertahan selama tab masih
 *   terbuka, dan catatan lama yang sudah tersimpan langsung dihapus.
 *
 * Situs ini tidak memasang pelacak pihak ketiga, jadi tidak ada kategori
 * "analitik" atau "iklan" yang dibuat-buat di sini.
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KUNCI = "otomotif:persetujuan";

export type Persetujuan = {
  /** Sudah pernah menjawab banner atau belum. */
  sudahMemilih: boolean;
  /** Boleh mengingat kendaraan antar kunjungan. */
  preferensi: boolean;
};

type IsiKonteks = Persetujuan & {
  siap: boolean;
  simpanPilihan: (preferensi: boolean) => void;
  bukaLagi: () => void;
};

const AWAL: Persetujuan = { sudahMemilih: false, preferensi: false };

const Konteks = createContext<IsiKonteks | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [nilai, setNilai] = useState<Persetujuan>(AWAL);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const mentah = window.localStorage.getItem(KUNCI);
      if (mentah) {
        const tersimpan = JSON.parse(mentah) as Persetujuan;
        setNilai({
          sudahMemilih: Boolean(tersimpan?.sudahMemilih),
          preferensi: Boolean(tersimpan?.preferensi),
        });
      }
    } catch {
      /* Diabaikan. */
    }
    setSiap(true);
  }, []);

  const simpanPilihan = useCallback((preferensi: boolean) => {
    const berikutnya: Persetujuan = { sudahMemilih: true, preferensi };
    setNilai(berikutnya);
    try {
      window.localStorage.setItem(KUNCI, JSON.stringify(berikutnya));
      /* Kalau preferensi ditolak, catatan kendaraan yang sudah terlanjur
         tersimpan benar-benar dihapus sekarang juga. */
      if (!preferensi) window.localStorage.removeItem("otomotif:kendaraan");
    } catch {
      /* Diabaikan. */
    }
  }, []);

  const bukaLagi = useCallback(() => {
    setNilai((s) => ({ ...s, sudahMemilih: false }));
  }, []);

  const isi = useMemo<IsiKonteks>(
    () => ({ ...nilai, siap, simpanPilihan, bukaLagi }),
    [nilai, siap, simpanPilihan, bukaLagi]
  );

  return <Konteks.Provider value={isi}>{children}</Konteks.Provider>;
}

export function usePersetujuan() {
  const isi = useContext(Konteks);
  if (!isi) throw new Error("usePersetujuan dipakai di luar ConsentProvider");
  return isi;
}
