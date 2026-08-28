"use client";

/* ============================================================================
 * PEMILIH KENDARAAN
 * ----------------------------------------------------------------------------
 * Tiga dropdown bertingkat: merek menentukan daftar model, model menentukan
 * daftar tahun.
 *
 * Aturan kebersihannya:
 *   - mengganti merek mengosongkan model dan tahun
 *   - mengganti model mengosongkan tahun
 *   - dropdown yang belum ada isinya dimatikan, bukan dibiarkan kosong
 *   - kombinasi hanya disimpan setelah ketiganya benar-benar terisi
 *
 * Pilihan yang tersimpan dipakai ulang di seluruh situs.
 * ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import { Dropdown, type PilihanDropdown } from "@/components/ui/dropdown";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { daftarMerek, daftarModel, daftarTahun } from "@/lib/fitment";

type Props = {
  diAtasGelap?: boolean;
  /** Dipanggil setelah kendaraan lengkap dipilih. */
  onTerapkan?: () => void;
  className?: string;
};

export function VehiclePicker({ diAtasGelap = false, onTerapkan, className = "" }: Props) {
  const { kendaraan, pilih, siap } = useKendaraan();

  const [merek, setMerek] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [tahun, setTahun] = useState<number | null>(null);

  /* Isi ulang dari pilihan yang tersimpan begitu pembacaan selesai. */
  useEffect(() => {
    if (!siap) return;
    if (kendaraan) {
      setMerek(kendaraan.merek);
      setModel(kendaraan.model);
      setTahun(kendaraan.tahun);
    }
  }, [siap, kendaraan]);

  const opsiMerek: PilihanDropdown[] = useMemo(
    () => daftarMerek().map((m) => ({ nilai: m, label: m })),
    []
  );

  const opsiModel: PilihanDropdown[] = useMemo(
    () => (merek ? daftarModel(merek).map((m) => ({ nilai: m, label: m })) : []),
    [merek]
  );

  const opsiTahun: PilihanDropdown[] = useMemo(
    () =>
      merek && model
        ? daftarTahun(merek, model).map((t) => ({ nilai: String(t), label: String(t) }))
        : [],
    [merek, model]
  );

  /* Mengganti merek membuang model dan tahun yang lama, bukan
     meninggalkan pilihan yang sudah tidak sah. */
  const gantiMerek = (nilai: string) => {
    setMerek(nilai);
    setModel(null);
    setTahun(null);
  };

  const gantiModel = (nilai: string) => {
    setModel(nilai);
    setTahun(null);
  };

  const gantiTahun = (nilai: string) => {
    const t = Number(nilai);
    setTahun(t);
    if (merek && model && Number.isFinite(t)) {
      pilih({ merek, model, tahun: t });
      onTerapkan?.();
    }
  };

  /* Susunannya mengikuti lebar WADAHNYA, bukan lebar layar.
     Ini penting karena pemilih yang sama dipakai di dua tempat yang jauh
     berbeda lebarnya: panel hero yang selebar halaman, dan kolom samping
     halaman produk yang sempit. Kalau memakai ukuran layar, tiga dropdown
     akan dipaksa berdampingan di kolom sempit dan tulisannya terpotong.

     Di wadah sempit: merek dan model berdampingan, tahun satu baris penuh.
     Susunan itu juga menghemat satu baris tinggi, yang menentukan apakah
     hero masih muat dalam satu layar di ponsel. */
  return (
    <div className={`@container w-full ${className}`}>
      <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @2xl:gap-3.5">
      <Dropdown
        label="Merek"
        pilihan={opsiMerek}
        nilai={merek}
        onPilih={gantiMerek}
        placeholder="Pilih merek"
        diAtasGelap={diAtasGelap}
      />
      <Dropdown
        label="Model"
        pilihan={opsiModel}
        nilai={model}
        onPilih={gantiModel}
        placeholder="Pilih model"
        pesanKosong="Merek dulu"
        nonaktif={!merek}
        diAtasGelap={diAtasGelap}
      />
        <div className="col-span-2 @2xl:col-span-1">
          <Dropdown
            label="Tahun"
            pilihan={opsiTahun}
            nilai={tahun ? String(tahun) : null}
            onPilih={gantiTahun}
            placeholder="Pilih tahun"
            pesanKosong="Model dulu"
            nonaktif={!model}
            diAtasGelap={diAtasGelap}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * PENANDA KENDARAAN YANG SEDANG DIPILIH
 * ------------------------------------------------------------------------- */
export function VehicleChip({
  diAtasGelap = false,
  className = "",
}: {
  diAtasGelap?: boolean;
  className?: string;
}) {
  const { kendaraan, hapus, siap } = useKendaraan();

  if (!siap || !kendaraan) return null;

  return (
    <div
      className={`inline-flex items-center gap-2.5 border px-3 py-1.5 text-[0.78rem] ${
        diAtasGelap ? "border-control-deep text-chalk" : "border-control text-ink"
      } ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
      <span className="truncate">
        <span className={diAtasGelap ? "text-chalk-2" : "text-ink-2"}>Kendaraan: </span>
        {kendaraan.merek} {kendaraan.model} {kendaraan.tahun}
      </span>
      <button
        type="button"
        onClick={hapus}
        className={`shrink-0 underline underline-offset-2 ${
          diAtasGelap ? "text-chalk-2 hover:text-chalk" : "text-ink-2 hover:text-ink"
        }`}
      >
        Hapus
      </button>
    </div>
  );
}
