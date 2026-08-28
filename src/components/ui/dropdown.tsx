"use client";

/* ============================================================================
 * DROPDOWN
 * ----------------------------------------------------------------------------
 * Dibuat sendiri, bukan memakai <select> bawaan, supaya tampilannya sama di
 * semua peramban dan bisa dipakai untuk pemilih bertingkat.
 *
 * Yang harus tetap jalan seperti <select> bawaan:
 *   Enter / Spasi / Panah    membuka daftar
 *   Panah atas dan bawah     berpindah pilihan
 *   Home dan End             lompat ke ujung
 *   Mengetik huruf           lompat ke pilihan yang diawali huruf itu
 *   Escape                   menutup tanpa mengubah pilihan
 *   Tab                      menutup lalu lanjut ke kolom berikutnya
 *   Klik di luar             menutup
 *
 * Susunan ARIA-nya mengikuti pola combobox yang hanya bisa memilih: fokus
 * tetap di tombol, dan pilihan yang sedang disorot ditunjuk lewat
 * aria-activedescendant.
 * ========================================================================== */

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type PilihanDropdown = { nilai: string; label: string; keterangan?: string };

type Props = {
  label: string;
  pilihan: PilihanDropdown[];
  nilai: string | null;
  onPilih: (nilai: string) => void;
  placeholder?: string;
  /** Ditampilkan saat daftar kosong, misalnya karena merek belum dipilih. */
  pesanKosong?: string;
  nonaktif?: boolean;
  galat?: string | null;
  /** Warna terang untuk dipakai di atas permukaan gelap. */
  diAtasGelap?: boolean;
  id?: string;
};

export function Dropdown({
  label,
  pilihan,
  nilai,
  onPilih,
  placeholder = "Pilih",
  pesanKosong = "Belum ada pilihan",
  nonaktif = false,
  galat = null,
  diAtasGelap = false,
  id,
}: Props) {
  const idOtomatis = useId();
  const idDasar = id ?? idOtomatis;
  const idTombol = `${idDasar}-tombol`;
  const idDaftar = `${idDasar}-daftar`;
  const idLabel = `${idDasar}-label`;
  const idGalat = `${idDasar}-galat`;

  const [terbuka, setTerbuka] = useState(false);
  const [sorotan, setSorotan] = useState(-1);

  const bungkusRef = useRef<HTMLDivElement>(null);
  const tombolRef = useRef<HTMLButtonElement>(null);
  const daftarRef = useRef<HTMLUListElement>(null);
  const ketikan = useRef({ teks: "", waktu: 0 });

  const kosong = pilihan.length === 0;
  const matiTotal = nonaktif || kosong;
  const terpilih = pilihan.find((p) => p.nilai === nilai) ?? null;

  const buka = useCallback(() => {
    if (matiTotal) return;
    const awal = terpilih ? pilihan.findIndex((p) => p.nilai === terpilih.nilai) : 0;
    setSorotan(awal < 0 ? 0 : awal);
    setTerbuka(true);
  }, [matiTotal, pilihan, terpilih]);

  const tutup = useCallback((kembalikanFokus = true) => {
    setTerbuka(false);
    setSorotan(-1);
    if (kembalikanFokus) tombolRef.current?.focus();
  }, []);

  const pilihIndex = useCallback(
    (i: number) => {
      const p = pilihan[i];
      if (!p) return;
      onPilih(p.nilai);
      tutup();
    },
    [pilihan, onPilih, tutup]
  );

  /* Klik di luar menutup daftar tanpa memindahkan fokus. */
  useEffect(() => {
    if (!terbuka) return;
    const saatKlik = (e: PointerEvent) => {
      if (!bungkusRef.current?.contains(e.target as Node)) {
        setTerbuka(false);
        setSorotan(-1);
      }
    };
    document.addEventListener("pointerdown", saatKlik);
    return () => document.removeEventListener("pointerdown", saatKlik);
  }, [terbuka]);

  /* Jaga pilihan yang sedang disorot supaya selalu terlihat. */
  useEffect(() => {
    if (!terbuka || sorotan < 0) return;
    const el = daftarRef.current?.children[sorotan] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [terbuka, sorotan]);

  /* Kalau daftar pilihan berubah (misalnya merek diganti), daftar ditutup. */
  useEffect(() => {
    setTerbuka(false);
    setSorotan(-1);
  }, [pilihan]);

  const lompatKeHuruf = useCallback(
    (huruf: string) => {
      const sekarang = Date.now();
      const teks = sekarang - ketikan.current.waktu < 800 ? ketikan.current.teks + huruf : huruf;
      ketikan.current = { teks, waktu: sekarang };

      const mulai = sorotan >= 0 ? sorotan : 0;
      const urutan = [...pilihan.slice(mulai + 1), ...pilihan.slice(0, mulai + 1)];
      const ketemu = urutan.findIndex((p) => p.label.toLowerCase().startsWith(teks.toLowerCase()));
      if (ketemu < 0) return;
      const index = (mulai + 1 + ketemu) % pilihan.length;
      if (terbuka) setSorotan(index);
      else pilihIndex(index);
    },
    [pilihan, sorotan, terbuka, pilihIndex]
  );

  const saatTekan = (e: React.KeyboardEvent) => {
    if (matiTotal) return;

    if (!terbuka) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        buka();
        return;
      }
      if (e.key.length === 1 && /\S/.test(e.key)) {
        e.preventDefault();
        lompatKeHuruf(e.key);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        tutup();
        break;
      case "Tab":
        /* Biarkan Tab pindah kolom, cukup tutup daftarnya. */
        setTerbuka(false);
        setSorotan(-1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        pilihIndex(sorotan);
        break;
      case "ArrowDown":
        e.preventDefault();
        setSorotan((s) => Math.min(pilihan.length - 1, s + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSorotan((s) => Math.max(0, s - 1));
        break;
      case "Home":
        e.preventDefault();
        setSorotan(0);
        break;
      case "End":
        e.preventDefault();
        setSorotan(pilihan.length - 1);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          e.preventDefault();
          lompatKeHuruf(e.key);
        }
    }
  };

  const warnaTombol = diAtasGelap
    ? "bg-deep-2 text-chalk border-control-deep hover:border-chalk-2"
    : "bg-panel text-ink border-control hover:border-ink";

  return (
    <div className="w-full" ref={bungkusRef}>
      <label
        id={idLabel}
        htmlFor={idTombol}
        className={`eyebrow mb-2 block ${diAtasGelap ? "text-chalk-2" : "text-ink-2"}`}
      >
        {label}
      </label>

      <div className="relative">
        <button
          ref={tombolRef}
          id={idTombol}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={terbuka}
          aria-controls={terbuka ? idDaftar : undefined}
          aria-labelledby={`${idLabel} ${idTombol}`}
          aria-activedescendant={terbuka && sorotan >= 0 ? `${idDasar}-opsi-${sorotan}` : undefined}
          aria-describedby={galat ? idGalat : undefined}
          aria-invalid={galat ? true : undefined}
          disabled={matiTotal}
          onClick={() => (terbuka ? tutup() : buka())}
          onKeyDown={saatTekan}
          className={`flex h-12 w-full items-center justify-between gap-3 border px-3.5 text-left text-[0.95rem] transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${warnaTombol} ${
            galat ? "border-accent-ink" : ""
          }`}
        >
          <span className={`truncate ${terpilih ? "" : diAtasGelap ? "text-chalk-2" : "text-ink-2"}`}>
            {terpilih ? terpilih.label : kosong ? pesanKosong : placeholder}
          </span>
          <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            aria-hidden="true"
            className={`shrink-0 transition-transform duration-200 ${terbuka ? "rotate-180" : ""}`}
          >
            <path d="M1 1L5.5 5.5L10 1" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        {terbuka && (
          /* layer-filter dipakai supaya daftar selalu di atas isi halaman dan
             header, tapi tetap di bawah menu mobile, drawer, dan modal. */
          <ul
            ref={daftarRef}
            id={idDaftar}
            role="listbox"
            aria-labelledby={idLabel}
            tabIndex={-1}
            className={`layer-filter absolute top-[calc(100%+4px)] left-0 max-h-64 w-full overflow-y-auto border shadow-[0_12px_32px_rgba(20,22,26,0.16)] ${
              diAtasGelap ? "border-control-deep bg-deep-2" : "border-ink bg-panel"
            }`}
          >
            {pilihan.map((p, i) => {
              const aktif = i === sorotan;
              const dipilih = p.nilai === nilai;
              return (
                <li
                  key={p.nilai}
                  id={`${idDasar}-opsi-${i}`}
                  role="option"
                  aria-selected={dipilih}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => pilihIndex(i)}
                  onPointerEnter={() => setSorotan(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-[0.9rem] ${
                    diAtasGelap
                      ? aktif
                        ? "bg-chalk text-ink"
                        : "text-chalk"
                      : aktif
                        ? "bg-ink text-chalk"
                        : "text-ink"
                  }`}
                >
                  <span className="truncate">{p.label}</span>
                  {p.keterangan && (
                    <span
                      className={`shrink-0 text-[0.7rem] ${
                        aktif ? "opacity-80" : diAtasGelap ? "text-chalk-2" : "text-ink-2"
                      }`}
                    >
                      {p.keterangan}
                    </span>
                  )}
                  {dipilih && !p.keterangan && (
                    <span aria-hidden="true" className="shrink-0 text-[0.7rem]">
                      dipilih
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {galat && (
        <p id={idGalat} role="alert" className="mt-1.5 text-[0.8rem] text-accent-ink">
          {galat}
        </p>
      )}
    </div>
  );
}
