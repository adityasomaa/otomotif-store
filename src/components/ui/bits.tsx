"use client";

/* ============================================================================
 * POTONGAN KECIL YANG DIPAKAI DI MANA-MANA
 * ========================================================================== */

import { useEffect, useId, useRef, useState } from "react";
import { statusStok } from "@/lib/fitment";
import { formatSaatKetik, keAngka, ribuan } from "@/lib/format";

/* ---------------------------------------------------------------------------
 * STATUS STOK
 * Dibedakan lewat teks, bentuk, dan warna sekaligus. Tidak pernah hanya warna.
 * ------------------------------------------------------------------------- */
export function StockBadge({ stok, kecil = false }: { stok: number; kecil?: boolean }) {
  const status = statusStok(stok);

  const gaya =
    status.kunci === "tersedia"
      ? "bg-ok-bg text-ok"
      : status.kunci === "menipis"
        ? "bg-warn-bg text-warn"
        : "bg-off-bg text-off";

  /* Bentuk penanda juga berbeda, jadi tetap terbaca tanpa membedakan warna. */
  const bentuk =
    status.kunci === "tersedia" ? (
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
    ) : status.kunci === "menipis" ? (
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-current" />
    ) : (
      <span aria-hidden="true" className="h-[2px] w-2.5 bg-current" />
    );

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${gaya} ${
        kecil ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1 text-[0.72rem]"
      } font-medium`}
    >
      {bentuk}
      {status.label}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * PENANDA DATA CONTOH / BELUM DIISI
 * ------------------------------------------------------------------------- */
export function TandaContoh({ children, nada = "contoh" }: { children: React.ReactNode; nada?: "contoh" | "kosong" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[0.68rem] font-medium ${
        nada === "contoh" ? "border-accent-ink text-accent-ink" : "border-control text-ink-2"
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 border border-current" />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * INPUT ANGKA DENGAN PEMISAH RIBUAN
 * Yang terlihat "1.250.000", yang dikirim ke perhitungan tetap 1250000.
 * ------------------------------------------------------------------------- */
export function InputAngka({
  label,
  nilai,
  onUbah,
  min = 0,
  max = 99999999,
  awalan,
  galat,
  petunjuk,
  id,
}: {
  label: string;
  nilai: number;
  onUbah: (angka: number) => void;
  min?: number;
  max?: number;
  awalan?: string;
  galat?: string | null;
  petunjuk?: string;
  id?: string;
}) {
  const idOtomatis = useId();
  const idInput = id ?? idOtomatis;
  const [teks, setTeks] = useState(nilai ? ribuan(nilai) : "");

  /* Ikut berubah kalau nilainya diubah dari luar. */
  useEffect(() => {
    setTeks(nilai ? ribuan(nilai) : "");
  }, [nilai]);

  return (
    <div className="w-full">
      <label htmlFor={idInput} className="eyebrow mb-2 block text-ink-2">
        {label}
      </label>
      <div
        className={`flex h-12 items-center border bg-panel ${galat ? "border-accent-ink" : "border-control"}`}
      >
        {awalan && <span className="pl-3.5 text-[0.95rem] text-ink-2">{awalan}</span>}
        <input
          id={idInput}
          /* inputMode numeric memunculkan papan angka di ponsel, sementara
             type text membuat pemisah ribuan tetap bisa ditampilkan. */
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={teks}
          aria-invalid={galat ? true : undefined}
          aria-describedby={galat ? `${idInput}-galat` : petunjuk ? `${idInput}-petunjuk` : undefined}
          onChange={(e) => {
            const bersih = formatSaatKetik(e.target.value);
            setTeks(bersih);
            const angka = Math.min(max, Math.max(min, keAngka(e.target.value)));
            onUbah(angka);
          }}
          onBlur={() => setTeks(nilai ? ribuan(nilai) : "")}
          className="h-full w-full bg-transparent px-3.5 text-[0.95rem] outline-none"
        />
      </div>
      {petunjuk && !galat && (
        <p id={`${idInput}-petunjuk`} className="mt-1.5 text-[0.78rem] text-ink-2">
          {petunjuk}
        </p>
      )}
      {galat && (
        <p id={`${idInput}-galat`} role="alert" className="mt-1.5 text-[0.8rem] text-accent-ink">
          {galat}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * PENGATUR JUMLAH BARANG
 * ------------------------------------------------------------------------- */
export function PengaturJumlah({
  jumlah,
  onUbah,
  maks = 99,
  namaBarang,
}: {
  jumlah: number;
  onUbah: (n: number) => void;
  maks?: number;
  namaBarang: string;
}) {
  const [teks, setTeks] = useState(String(jumlah));
  useEffect(() => setTeks(ribuan(jumlah)), [jumlah]);

  return (
    <div className="inline-flex h-10 items-stretch border border-control bg-panel">
      <button
        type="button"
        aria-label={`Kurangi jumlah ${namaBarang}`}
        onClick={() => onUbah(Math.max(0, jumlah - 1))}
        className="w-9 text-[1.1rem] leading-none text-ink transition-colors hover:bg-paper"
      >
        &minus;
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={`Jumlah ${namaBarang}`}
        value={teks}
        onChange={(e) => {
          const t = formatSaatKetik(e.target.value);
          setTeks(t);
          onUbah(Math.min(maks, keAngka(e.target.value)));
        }}
        onBlur={() => setTeks(ribuan(jumlah))}
        className="w-12 border-x border-control bg-transparent text-center text-[0.9rem] tabular-nums outline-none"
        data-tabular
      />
      <button
        type="button"
        aria-label={`Tambah jumlah ${namaBarang}`}
        onClick={() => onUbah(Math.min(maks, jumlah + 1))}
        className="w-9 text-[1.1rem] leading-none text-ink transition-colors hover:bg-paper"
      >
        +
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * KOLOM TEKS BIASA
 * ------------------------------------------------------------------------- */
export function Kolom({
  label,
  name,
  nilai,
  onUbah,
  galat,
  tipe = "text",
  placeholder,
  autoComplete,
  banyakBaris = false,
  wajib = true,
}: {
  label: string;
  name: string;
  nilai: string;
  onUbah: (v: string) => void;
  galat?: string | null;
  tipe?: string;
  placeholder?: string;
  autoComplete?: string;
  banyakBaris?: boolean;
  wajib?: boolean;
}) {
  const id = `kolom-${name}`;
  const kelas = `w-full border bg-panel px-3.5 py-3 text-[0.95rem] outline-none transition-colors ${
    galat ? "border-accent-ink" : "border-control focus:border-ink"
  }`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="eyebrow mb-2 block text-ink-2">
        {label}
        {!wajib && <span className="ml-1.5 normal-case tracking-normal opacity-70">(boleh dikosongkan)</span>}
      </label>
      {banyakBaris ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          value={nilai}
          placeholder={placeholder}
          aria-invalid={galat ? true : undefined}
          aria-describedby={galat ? `${id}-galat` : undefined}
          onChange={(e) => onUbah(e.target.value)}
          className={`${kelas} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={tipe}
          value={nilai}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={galat ? true : undefined}
          aria-describedby={galat ? `${id}-galat` : undefined}
          onChange={(e) => onUbah(e.target.value)}
          className={`${kelas} h-12 py-0`}
        />
      )}
      {galat && (
        <p id={`${id}-galat`} role="alert" className="mt-1.5 text-[0.8rem] text-accent-ink">
          {galat}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * KOLOM JEBAKAN UNTUK ROBOT
 * Memakai clip, bukan posisi -9999px, supaya tidak pernah menciptakan lebar
 * halaman berlebih ketika kebetulan tidak ada induk yang berposisi.
 * ------------------------------------------------------------------------- */
export function Honeypot({ nilai, onUbah }: { nilai: string; onUbah: (v: string) => void }) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor="situs">Jangan diisi</label>
      <input
        id="situs"
        name="situs"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={nilai}
        onChange={(e) => onUbah(e.target.value)}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * TEKS YANG DIPECAH PER HURUF
 * Teks utuhnya dibacakan sekali di induk lewat aria-label, dan tiap hurufnya
 * disembunyikan dari pembaca layar supaya tidak dieja satu per satu.
 * ------------------------------------------------------------------------- */
export function TeksPerHuruf({
  teks,
  className = "",
  jedaAwal = 0,
}: {
  teks: string;
  className?: string;
  jedaAwal?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [jalan, setJalan] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setJalan(true);
      return;
    }
    const t = setTimeout(() => setJalan(true), jedaAwal);
    return () => clearTimeout(t);
  }, [jedaAwal]);

  const kata = teks.split(" ");

  return (
    <span ref={ref} aria-label={teks} className={className}>
      {kata.map((k, ki) => (
        <span key={ki} aria-hidden="true" className="inline-block whitespace-nowrap">
          {k.split("").map((h, hi) => (
            <span
              key={hi}
              aria-hidden="true"
              className="inline-block"
              style={{
                opacity: jalan ? 1 : 0,
                transform: jalan ? "none" : "translateY(0.4em)",
                transition: `opacity 520ms cubic-bezier(.22,1,.36,1) ${(ki * 4 + hi) * 18}ms, transform 520ms cubic-bezier(.22,1,.36,1) ${(ki * 4 + hi) * 18}ms`,
              }}
            >
              {h}
            </span>
          ))}
          {ki < kata.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
