"use client";

/* ============================================================================
 * KATALOG
 * ----------------------------------------------------------------------------
 * Pencarian, penyaringan, pengurutan, dan pemuatan bertahap.
 *
 * Katalog TIDAK dimuat sekaligus. Yang digambar hanya sejumlah kartu pertama,
 * lalu bertambah saat pembaca mendekati ujung daftar. Ini penting karena
 * katalog aslinya nanti bisa ratusan produk.
 *
 * Panel filter di layar kecil memakai lapisan tersendiri, mengunci scroll
 * halaman selama terbuka, dan mengembalikannya persis di posisi semula.
 * ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { Dropdown } from "@/components/ui/dropdown";
import { InputAngka, TandaContoh } from "@/components/ui/bits";
import { VehiclePicker, VehicleChip } from "@/components/fitment/vehicle-picker";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { useOverlay } from "@/components/providers/overlay-provider";
import { cariProduk, saringUntukKendaraan, daftarMerekProduk, rentangHarga } from "@/lib/fitment";
import { rupiah } from "@/lib/format";
import { KATEGORI, PRODUK, type Produk } from "@/data/catalog";
import { DATA_CONTOH } from "@/lib/store-config";

const PER_MUAT = 9;

type Urutan = "terbaru" | "termurah" | "termahal";

const OPSI_URUTAN = [
  { nilai: "terbaru", label: "Terbaru" },
  { nilai: "termurah", label: "Harga termurah" },
  { nilai: "termahal", label: "Harga termahal" },
];

const OPSI_STOK = [
  { nilai: "semua", label: "Semua" },
  { nilai: "tersedia", label: "Hanya yang tersedia" },
];

export function CatalogBrowser({
  kataAwal = "",
  kategoriTerkunci,
}: {
  kataAwal?: string;
  /** Kalau diisi, halaman ini hanya menampilkan satu kategori. */
  kategoriTerkunci?: string;
}) {
  const { kendaraan, siap } = useKendaraan();
  const { terbuka, setTerbuka } = useOverlay();

  const batas = useMemo(() => rentangHarga(), []);

  const [kata, setKata] = useState(kataAwal);
  const [kategoriDipilih, setKategoriDipilih] = useState<string[]>(
    kategoriTerkunci ? [kategoriTerkunci] : []
  );
  const [merekDipilih, setMerekDipilih] = useState<string[]>([]);
  const [hargaMin, setHargaMin] = useState(0);
  const [hargaMaks, setHargaMaks] = useState(0);
  const [stok, setStok] = useState("semua");
  const [urutan, setUrutan] = useState<Urutan>("terbaru");
  const [pakaiKendaraan, setPakaiKendaraan] = useState(true);
  const [tampil, setTampil] = useState(PER_MUAT);

  const semuaMerek = useMemo(() => daftarMerekProduk(), []);

  /* -- Rangkaian penyaringan -- */
  const hasil = useMemo<Produk[]>(() => {
    let daftar = [...PRODUK];

    if (kategoriTerkunci) daftar = daftar.filter((p) => p.kategori === kategoriTerkunci);
    else if (kategoriDipilih.length) daftar = daftar.filter((p) => kategoriDipilih.includes(p.kategori));

    if (merekDipilih.length) daftar = daftar.filter((p) => merekDipilih.includes(p.merekProduk));

    if (hargaMin > 0) daftar = daftar.filter((p) => p.harga >= hargaMin);
    if (hargaMaks > 0) daftar = daftar.filter((p) => p.harga <= hargaMaks);

    if (stok === "tersedia") daftar = daftar.filter((p) => p.stok > 0);

    daftar = cariProduk(daftar, kata);

    if (pakaiKendaraan && kendaraan) daftar = saringUntukKendaraan(daftar, kendaraan);

    switch (urutan) {
      case "termurah":
        daftar.sort((a, b) => a.harga - b.harga);
        break;
      case "termahal":
        daftar.sort((a, b) => b.harga - a.harga);
        break;
      default:
        daftar.sort((a, b) => b.ditambahkan.localeCompare(a.ditambahkan));
    }

    return daftar;
  }, [
    kata,
    kategoriDipilih,
    kategoriTerkunci,
    merekDipilih,
    hargaMin,
    hargaMaks,
    stok,
    urutan,
    pakaiKendaraan,
    kendaraan,
  ]);

  /* Setiap kali saringan berubah, daftar dimulai lagi dari awal. */
  useEffect(() => {
    setTampil(PER_MUAT);
  }, [kata, kategoriDipilih, merekDipilih, hargaMin, hargaMaks, stok, urutan, pakaiKendaraan, kendaraan]);

  const terlihat = hasil.slice(0, tampil);
  const masihAda = tampil < hasil.length;

  /* -- Pemuatan bertahap.
        Penanda ujung daftar ini berada di aliran halaman biasa, bukan di dalam
        wadah yang memotong isi, jadi rasio perpotongannya tidak pernah nol. -- */
  const penanda = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!masihAda) return;
    const el = penanda.current;
    if (!el) return;

    const pengamat = new IntersectionObserver(
      (entri) => {
        if (entri.some((e) => e.isIntersecting)) setTampil((n) => n + PER_MUAT);
      },
      { rootMargin: "400px 0px" }
    );
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, [masihAda, tampil]);

  const kosongkanSaringan = useCallback(() => {
    setKata("");
    if (!kategoriTerkunci) setKategoriDipilih([]);
    setMerekDipilih([]);
    setHargaMin(0);
    setHargaMaks(0);
    setStok("semua");
    setUrutan("terbaru");
    setPakaiKendaraan(true);
  }, [kategoriTerkunci]);

  const jumlahSaringanAktif =
    (kategoriTerkunci ? 0 : kategoriDipilih.length) +
    merekDipilih.length +
    (hargaMin > 0 ? 1 : 0) +
    (hargaMaks > 0 ? 1 : 0) +
    (stok !== "semua" ? 1 : 0);

  const isiFilter = (
    <FilterIsi
      kategoriTerkunci={kategoriTerkunci}
      kategoriDipilih={kategoriDipilih}
      setKategoriDipilih={setKategoriDipilih}
      semuaMerek={semuaMerek}
      merekDipilih={merekDipilih}
      setMerekDipilih={setMerekDipilih}
      hargaMin={hargaMin}
      setHargaMin={setHargaMin}
      hargaMaks={hargaMaks}
      setHargaMaks={setHargaMaks}
      batas={batas}
      stok={stok}
      setStok={setStok}
      kosongkanSaringan={kosongkanSaringan}
    />
  );

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      {/* -------- Panel filter, layar lebar -------- */}
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+24px)]">
          <h2 className="eyebrow text-ink-2">Saring</h2>
          <div className="mt-5">{isiFilter}</div>
        </div>
      </aside>

      {/* -------- Daftar -------- */}
      <div className="min-w-0">
        {/* Baris alat */}
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="cari-katalog" className="eyebrow mb-2 block text-ink-2">
                Cari produk
              </label>
              <input
                id="cari-katalog"
                type="search"
                value={kata}
                onChange={(e) => setKata(e.target.value)}
                placeholder="Nama barang, kode produk, atau merek"
                className="h-12 w-full border border-control bg-panel px-3.5 text-[0.95rem] outline-none transition-colors focus:border-ink"
              />
            </div>
            <div className="w-full sm:w-52">
              <Dropdown
                label="Urutkan"
                pilihan={OPSI_URUTAN}
                nilai={urutan}
                onPilih={(v) => setUrutan(v as Urutan)}
              />
            </div>
          </div>

          {/* Tombol filter di layar kecil */}
          <div className="flex flex-wrap items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setTerbuka("filter", true)}
              className="inline-flex h-11 items-center gap-2 border border-ink px-4 text-[0.84rem] font-medium"
            >
              Saring
              {jumlahSaringanAktif > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[0.7rem] text-ink" data-tabular>
                  {jumlahSaringanAktif}
                </span>
              )}
            </button>
            {siap && kendaraan && <VehicleChip />}
          </div>

          {/* Saringan kendaraan */}
          {siap && kendaraan && (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-panel px-4 py-3">
              <p className="text-[0.86rem] text-ink-2">
                Menyaring untuk{" "}
                <span className="font-medium text-ink">
                  {kendaraan.merek} {kendaraan.model} {kendaraan.tahun}
                </span>
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2.5 text-[0.84rem]">
                <input
                  type="checkbox"
                  checked={pakaiKendaraan}
                  onChange={(e) => setPakaiKendaraan(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                Hanya tampilkan yang cocok
              </label>
            </div>
          )}

          {siap && !kendaraan && (
            <div className="border border-rule bg-panel p-4">
              <p className="eyebrow text-ink-2">Belum memilih kendaraan</p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-2">
                Pilih kendaraan supaya katalog hanya menampilkan barang yang cocok.
              </p>
              <div className="mt-4">
                <VehiclePicker rapat />
              </div>
            </div>
          )}
        </div>

        {/* Jumlah hasil */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
          <p className="text-[0.86rem] text-ink-2" data-tabular>
            {hasil.length} produk ditemukan
          </p>
          {DATA_CONTOH && <TandaContoh>Data contoh</TandaContoh>}
        </div>

        {/* Kartu */}
        {hasil.length === 0 ? (
          <div className="border border-rule bg-panel px-5 py-12 text-center">
            <p className="text-[1rem] font-medium">Tidak ada produk yang cocok dengan saringan ini</p>
            <p className="mx-auto mt-2 max-w-[42ch] text-[0.88rem] leading-relaxed text-ink-2">
              Coba longgarkan saringan, ganti kata pencarian, atau matikan penyaringan kendaraan.
            </p>
            <button
              type="button"
              onClick={kosongkanSaringan}
              className="mt-5 inline-flex h-11 items-center border border-ink px-5 text-[0.85rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
            >
              Kosongkan saringan
            </button>
          </div>
        ) : (
          <>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {terlihat.map((p, i) => (
                <li key={p.sku}>
                  <ProductCard produk={p} prioritas={i < 3} />
                </li>
              ))}
            </ul>

            {masihAda && (
              <div ref={penanda} className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setTampil((n) => n + PER_MUAT)}
                  className="inline-flex h-12 items-center border border-ink px-6 text-[0.86rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
                >
                  Muat {Math.min(PER_MUAT, hasil.length - tampil)} produk lagi
                </button>
              </div>
            )}

            <p className="mt-6 text-center text-[0.8rem] text-ink-2" data-tabular>
              Menampilkan {terlihat.length} dari {hasil.length} produk
            </p>
          </>
        )}
      </div>

      {/* -------- Panel filter, layar kecil -------- */}
      {terbuka.filter && (
        <div className="layer-filter fixed inset-0 lg:hidden">
          <button
            type="button"
            aria-label="Tutup saringan"
            onClick={() => setTerbuka("filter", false)}
            className="absolute inset-0 bg-ink/55"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Saring produk"
            className="absolute inset-x-0 bottom-0 flex max-h-[86svh] flex-col border-t border-ink bg-paper"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-rule px-5 py-4">
              <p className="text-[1rem] font-medium">Saring</p>
              <button
                type="button"
                onClick={() => setTerbuka("filter", false)}
                className="inline-flex h-10 w-10 items-center justify-center border border-control"
                aria-label="Tutup saringan"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                  <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{isiFilter}</div>
            <div className="shrink-0 border-t border-rule bg-panel px-5 py-4">
              <button
                type="button"
                onClick={() => setTerbuka("filter", false)}
                className="inline-flex h-12 w-full items-center justify-center bg-ink px-5 text-[0.88rem] font-medium text-chalk"
                data-tabular
              >
                Lihat {hasil.length} produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * ISI PANEL FILTER
 * Dipakai dua kali: sebagai kolom di layar lebar, dan sebagai panel di layar
 * kecil. Satu sumber, jadi keduanya tidak pernah beda isi.
 * ------------------------------------------------------------------------- */
function FilterIsi({
  kategoriTerkunci,
  kategoriDipilih,
  setKategoriDipilih,
  semuaMerek,
  merekDipilih,
  setMerekDipilih,
  hargaMin,
  setHargaMin,
  hargaMaks,
  setHargaMaks,
  batas,
  stok,
  setStok,
  kosongkanSaringan,
}: {
  kategoriTerkunci?: string;
  kategoriDipilih: string[];
  setKategoriDipilih: (v: string[]) => void;
  semuaMerek: string[];
  merekDipilih: string[];
  setMerekDipilih: (v: string[]) => void;
  hargaMin: number;
  setHargaMin: (n: number) => void;
  hargaMaks: number;
  setHargaMaks: (n: number) => void;
  batas: { min: number; max: number };
  stok: string;
  setStok: (v: string) => void;
  kosongkanSaringan: () => void;
}) {
  const alihkan = (daftar: string[], nilai: string, set: (v: string[]) => void) => {
    set(daftar.includes(nilai) ? daftar.filter((x) => x !== nilai) : [...daftar, nilai]);
  };

  return (
    <div className="grid gap-7">
      {!kategoriTerkunci && (
        <fieldset>
          <legend className="eyebrow mb-3 text-ink-2">Kategori</legend>
          <div className="grid gap-2.5">
            {KATEGORI.map((k) => (
              <label key={k.slug} className="flex cursor-pointer items-center gap-2.5 text-[0.88rem]">
                <input
                  type="checkbox"
                  checked={kategoriDipilih.includes(k.slug)}
                  onChange={() => alihkan(kategoriDipilih, k.slug, setKategoriDipilih)}
                  className="h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                />
                <span>{k.nama}</span>
                <span className="ml-auto text-[0.74rem] text-ink-2" data-tabular>
                  {PRODUK.filter((p) => p.kategori === k.slug).length}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="eyebrow mb-3 text-ink-2">Merek produk</legend>
        <div className="grid gap-2.5">
          {semuaMerek.map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2.5 text-[0.88rem]">
              <input
                type="checkbox"
                checked={merekDipilih.includes(m)}
                onChange={() => alihkan(merekDipilih, m, setMerekDipilih)}
                className="h-4 w-4 shrink-0 accent-[var(--color-accent)]"
              />
              <span>{m}</span>
              <span className="ml-auto text-[0.74rem] text-ink-2" data-tabular>
                {PRODUK.filter((p) => p.merekProduk === m).length}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3 text-ink-2">Rentang harga</legend>
        <div className="grid gap-3">
          <InputAngka
            label="Harga terendah"
            nilai={hargaMin}
            onUbah={setHargaMin}
            awalan="Rp"
            petunjuk={`Termurah di katalog ${rupiah(batas.min)}`}
          />
          <InputAngka
            label="Harga tertinggi"
            nilai={hargaMaks}
            onUbah={setHargaMaks}
            awalan="Rp"
            petunjuk={`Termahal di katalog ${rupiah(batas.max)}`}
          />
        </div>
      </fieldset>

      <div>
        <Dropdown label="Ketersediaan" pilihan={OPSI_STOK} nilai={stok} onPilih={setStok} />
      </div>

      <button
        type="button"
        onClick={kosongkanSaringan}
        className="inline-flex h-11 items-center justify-center border border-control px-4 text-[0.84rem] transition-colors hover:border-ink"
      >
        Kosongkan saringan
      </button>
    </div>
  );
}
