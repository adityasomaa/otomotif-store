"use client";

/* ============================================================================
 * HALAMAN CEK KECOCOKAN
 * ----------------------------------------------------------------------------
 * Satu halaman khusus untuk pembeli yang belum yakin. Setelah kendaraan
 * dipilih, hasilnya langsung dipecah per kategori supaya kelihatan berapa
 * banyak barang yang cocok dan di mana letaknya.
 * ========================================================================== */

import { useMemo } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import { VehiclePicker } from "@/components/fitment/vehicle-picker";
import { SplitFlap } from "@/components/ui/split-flap";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { ProductCard } from "@/components/catalog/product-card";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { saringUntukKendaraan, cekKecocokan } from "@/lib/fitment";
import { KATEGORI, PRODUK } from "@/data/catalog";

export function FitmentChecker() {
  const { kendaraan, siap, hapus } = useKendaraan();

  const hasil = useMemo(() => {
    if (!kendaraan) return null;
    const cocok = saringUntukKendaraan(PRODUK, kendaraan);
    const perKategori = KATEGORI.map((k) => ({
      kategori: k,
      jumlah: cocok.filter((p) => p.kategori === k.slug).length,
    }));
    const khusus = cocok.filter((p) => cekKecocokan(p, kendaraan) === "cocok");
    const universal = cocok.filter((p) => p.universal);
    return { cocok, perKategori, khusus, universal };
  }, [kendaraan]);

  return (
    <div className="mt-10">
      {/* -------- Pemilih -------- */}
      <section aria-labelledby="pilih-judul" className="border border-ink bg-panel">
        <div className="border-b border-rule px-5 py-4">
          <h2 id="pilih-judul" className="eyebrow text-ink-2">
            Pilih kendaraan
          </h2>
        </div>
        <div className="p-5">
          <VehiclePicker rapat />
          {siap && kendaraan && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-[0.9rem]">
                Kendaraan terpilih:{" "}
                <span className="font-medium">
                  {kendaraan.merek} {kendaraan.model} {kendaraan.tahun}
                </span>
              </p>
              <button
                type="button"
                onClick={hapus}
                className="text-[0.82rem] text-ink-2 underline underline-offset-4 hover:text-ink"
              >
                Ganti kendaraan
              </button>
            </div>
          )}
        </div>
      </section>

      {/* -------- Hasil -------- */}
      {!siap ? null : !kendaraan ? (
        <div className="mt-8 border border-rule bg-panel px-5 py-12 text-center">
          <p className="text-[1rem] font-medium">Belum ada kendaraan yang dipilih</p>
          <p className="mx-auto mt-2 max-w-[46ch] text-[0.9rem] leading-relaxed text-ink-2">
            Isi ketiga pilihan di atas. Pilihan itu akan terbawa ke katalog dan halaman produk, jadi cukup
            sekali saja.
          </p>
        </div>
      ) : (
        <>
          <section aria-labelledby="hasil-judul" className="mt-10">
            <h2 id="hasil-judul" className="eyebrow text-ink-2">
              Hasil
            </h2>

            <div className="mt-4 border border-ink">
              <div className="bg-deep p-5">
                <p className="eyebrow mb-3 text-chalk-2">Barang yang cocok</p>
                <SplitFlap
                  teks={`${hasil!.cocok.length} PRODUK`}
                  ukuran="md"
                  label={`${hasil!.cocok.length} produk cocok`}
                />
              </div>
              <div className="bg-panel p-5">
                <p className="text-[0.94rem] leading-relaxed">
                  Untuk{" "}
                  <span className="font-medium">
                    {kendaraan.merek} {kendaraan.model} {kendaraan.tahun}
                  </span>
                  , ada <span className="font-medium" data-tabular>{hasil!.khusus.length}</span> barang
                  yang tercatat cocok khusus untuk model ini, ditambah{" "}
                  <span className="font-medium" data-tabular>{hasil!.universal.length}</span> barang yang
                  memang tidak terikat model tertentu.
                </p>
                <p className="mt-3 text-[0.84rem] leading-relaxed text-ink-2">
                  Daftar kecocokan ini masih data contoh. Kalau barang yang Anda cari tidak muncul, bukan
                  berarti pasti tidak ada. Tanyakan dulu supaya bisa dicek langsung.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <TransitionLink
                    href="/katalog"
                    className="inline-flex h-11 items-center bg-ink px-5 text-[0.85rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
                  >
                    Buka katalog tersaring
                  </TransitionLink>
                  <WhatsAppLink gaya="garis" label="Tanya kecocokan lewat WhatsApp" />
                </div>
              </div>
            </div>
          </section>

          {/* Per kategori */}
          <section aria-labelledby="kategori-hasil" className="mt-10">
            <h2 id="kategori-hasil" className="eyebrow text-ink-2">
              Rincian per kategori
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hasil!.perKategori.map((r) => (
                <li key={r.kategori.slug}>
                  <TransitionLink
                    href={`/katalog/${r.kategori.slug}`}
                    className="flex items-center justify-between gap-3 border border-rule bg-panel px-4 py-4 transition-colors hover:border-ink"
                  >
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-medium">{r.kategori.nama}</span>
                      <span className="mt-0.5 block text-[0.78rem] text-ink-2" data-tabular>
                        {r.jumlah} barang cocok
                      </span>
                    </span>
                    <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true" className="shrink-0">
                      <path d="M0 4.5h12M8.5 1L12 4.5L8.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </section>

          {/* Contoh barang */}
          {hasil!.cocok.length > 0 && (
            <section aria-labelledby="contoh-hasil" className="mt-10">
              <h2 id="contoh-hasil" className="eyebrow text-ink-2">
                Sebagian barang yang cocok
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hasil!.cocok.slice(0, 6).map((p) => (
                  <li key={p.sku}>
                    <ProductCard produk={p} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
