"use client";

/* ============================================================================
 * ISI HALAMAN PRODUK
 * ----------------------------------------------------------------------------
 * Bagian terpenting di halaman ini adalah jawaban atas satu pertanyaan:
 * "barang ini muat tidak di kendaraan saya?"
 *
 * Jawabannya ditampilkan tiga kali dengan cara berbeda supaya tidak mungkin
 * terlewat: sebagai papan baca besar, sebagai kalimat, dan sebagai tabel
 * daftar kendaraan yang cocok.
 *
 * Tabel kecocokan dibungkus wadah yang menggeser sendiri ke samping, karena
 * tabel adalah sumber paling umum halaman jadi bisa digeser ke kanan di ponsel.
 * ========================================================================== */

import { useState } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import { ProductGraphic } from "@/components/ui/product-graphic";
import { StockBadge, PengaturJumlah, TandaContoh } from "@/components/ui/bits";
import { SplitFlap } from "@/components/ui/split-flap";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { VehiclePicker, VehicleChip } from "@/components/fitment/vehicle-picker";
import { PenandaKecocokan } from "@/components/catalog/product-card";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { useKeranjang } from "@/components/providers/cart-provider";
import { useOverlay } from "@/components/providers/overlay-provider";
import { cekKecocokan, kelompokKecocokan, namaKategori } from "@/lib/fitment";
import { rupiah, tanggal } from "@/lib/format";
import { DATA_CONTOH } from "@/lib/store-config";
import type { Produk } from "@/data/catalog";

export function ProductDetail({ produk }: { produk: Produk }) {
  const { kendaraan, siap } = useKendaraan();
  const { tambah } = useKeranjang();
  const { setTerbuka } = useOverlay();
  const [jumlah, setJumlah] = useState(1);

  const hasil = cekKecocokan(produk, kendaraan);
  const habis = produk.stok <= 0;
  const kelompok = kelompokKecocokan(produk);

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14">
      {/* ---------------- Kolom kiri ---------------- */}
      <div className="min-w-0">
        <div className="aspect-4/3 overflow-hidden border border-rule bg-panel">
          <ProductGraphic sku={produk.sku} nama={produk.nama} prioritas />
        </div>
        <p className="mt-2.5 text-[0.76rem] text-ink-2">
          Gambar di atas adalah grafik penanda buatan sendiri, bukan foto produk.
        </p>

        {/* ---- Spesifikasi ---- */}
        <section aria-labelledby="spesifikasi-judul" className="mt-12">
          <h2 id="spesifikasi-judul" className="eyebrow text-ink-2">
            Spesifikasi
          </h2>
          <dl className="mt-4 border-t border-rule">
            {produk.spesifikasi.map((s) => (
              <div key={s.label} className="flex gap-4 border-b border-rule py-3">
                <dt className="w-40 shrink-0 text-[0.86rem] text-ink-2">{s.label}</dt>
                <dd className="min-w-0 flex-1 text-[0.9rem]">{s.nilai}</dd>
              </div>
            ))}
            <div className="flex gap-4 border-b border-rule py-3">
              <dt className="w-40 shrink-0 text-[0.86rem] text-ink-2">Kode produk</dt>
              <dd className="min-w-0 flex-1 text-[0.9rem]" data-tabular>
                {produk.sku}
              </dd>
            </div>
            <div className="flex gap-4 border-b border-rule py-3">
              <dt className="w-40 shrink-0 text-[0.86rem] text-ink-2">Merek produk</dt>
              <dd className="min-w-0 flex-1 text-[0.9rem]">{produk.merekProduk}</dd>
            </div>
            <div className="flex gap-4 border-b border-rule py-3">
              <dt className="w-40 shrink-0 text-[0.86rem] text-ink-2">Masuk katalog</dt>
              <dd className="min-w-0 flex-1 text-[0.9rem]">{tanggal(produk.ditambahkan)}</dd>
            </div>
          </dl>
        </section>

        {/* ---- Tabel kecocokan ---- */}
        <section aria-labelledby="kecocokan-judul" className="mt-12">
          <h2 id="kecocokan-judul" className="eyebrow text-ink-2">
            Kendaraan yang cocok
          </h2>

          {produk.universal ? (
            <p className="mt-4 border border-rule bg-panel p-5 text-[0.92rem] leading-relaxed">
              Barang ini tidak terikat pada satu model tertentu, jadi cocok untuk semua kendaraan di
              daftar kami. Kalau ragu soal ukuran atau cara pakainya, tanyakan dulu sebelum memesan.
            </p>
          ) : (
            <>
              <p className="mt-3 text-[0.86rem] text-ink-2">
                Geser tabel ke samping kalau daftarnya terpotong di layar kecil.
              </p>
              {/* Wadah yang menggeser sendiri, supaya halaman tidak ikut melebar. */}
              <div className="scroll-x mt-4 border border-rule bg-panel">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <caption className="sr-only">
                    Daftar merek, model, dan rentang tahun kendaraan yang cocok dengan {produk.nama}
                  </caption>
                  <thead>
                    <tr className="border-b border-rule bg-paper">
                      <th scope="col" className="px-4 py-3 text-[0.74rem] tracking-wide uppercase">
                        Merek
                      </th>
                      <th scope="col" className="px-4 py-3 text-[0.74rem] tracking-wide uppercase">
                        Model
                      </th>
                      <th scope="col" className="px-4 py-3 text-[0.74rem] tracking-wide uppercase">
                        Tahun
                      </th>
                      <th scope="col" className="px-4 py-3 text-[0.74rem] tracking-wide uppercase">
                        Kendaraan Anda
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {kelompok.flatMap((g) =>
                      g.model.map((m, i) => {
                        const iniKendaraanPembeli =
                          kendaraan != null &&
                          kendaraan.merek === g.merek &&
                          kendaraan.model === m.model &&
                          kendaraan.tahun >= m.tahunMulai &&
                          kendaraan.tahun <= m.tahunSelesai;

                        return (
                          <tr
                            key={`${g.merek}-${m.model}`}
                            className={`border-b border-rule last:border-b-0 ${
                              iniKendaraanPembeli ? "bg-ok-bg" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-[0.88rem]">{i === 0 ? g.merek : ""}</td>
                            <td className="px-4 py-3 text-[0.88rem]">{m.model}</td>
                            <td className="px-4 py-3 text-[0.88rem]" data-tabular>
                              {m.tahunMulai}&ndash;{m.tahunSelesai}
                            </td>
                            <td className="px-4 py-3 text-[0.82rem]">
                              {iniKendaraanPembeli ? (
                                <span className="font-medium text-ok">Ini kendaraan Anda</span>
                              ) : (
                                <span className="text-ink-2">&mdash;</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-2">
                Daftar ini adalah data contoh. Kalau kendaraan Anda tidak ada di tabel, bukan berarti
                pasti tidak muat. Tanyakan dulu supaya bisa dicek satu per satu.
              </p>
            </>
          )}
        </section>
      </div>

      {/* ---------------- Kolom kanan ---------------- */}
      <div className="min-w-0">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <p className="eyebrow text-ink-2">{namaKategori(produk.kategori)}</p>
          <h1 className="h-sub mt-3">{produk.nama}</h1>
          <p className="mt-2 text-[0.86rem] text-ink-2">
            {produk.merekProduk} &middot; <span data-tabular>{produk.sku}</span>
          </p>

          <p className="mt-5 text-[1.6rem] font-medium" data-tabular>
            {rupiah(produk.harga)}
          </p>
          {DATA_CONTOH && (
            <div className="mt-2.5">
              <TandaContoh>Harga contoh</TandaContoh>
            </div>
          )}

          <div className="mt-4">
            <StockBadge stok={produk.stok} />
          </div>

          <p className="mt-5 text-[0.94rem] leading-relaxed text-ink-2">{produk.ringkasan}</p>

          {/* ---- Papan kecocokan ---- */}
          <section
            aria-labelledby="papan-kecocokan"
            className="mt-7 border border-ink bg-panel"
          >
            <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
              <h2 id="papan-kecocokan" className="eyebrow text-ink-2">
                Kecocokan kendaraan
              </h2>
              {siap && kendaraan && <VehicleChip />}
            </div>

            <div className="p-4">
              {!siap ? (
                <p className="text-[0.88rem] text-ink-2">Memeriksa pilihan kendaraan Anda&hellip;</p>
              ) : !kendaraan && !produk.universal ? (
                <>
                  <p className="text-[0.92rem] leading-relaxed">
                    Pilih kendaraan Anda dulu supaya bisa dicek apakah barang ini muat.
                  </p>
                  <div className="mt-4">
                    <VehiclePicker />
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-deep p-4">
                    <SplitFlap
                      teks={
                        hasil === "universal"
                          ? "SEMUA UNIT"
                          : hasil === "cocok"
                            ? "COCOK"
                            : "TIDAK COCOK"
                      }
                      ukuran="sm"
                      label={
                        hasil === "universal"
                          ? "Cocok untuk semua kendaraan"
                          : hasil === "cocok"
                            ? "Cocok dengan kendaraan Anda"
                            : "Tidak cocok dengan kendaraan Anda"
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <PenandaKecocokan hasil={hasil} besar />
                  </div>

                  <p className="mt-3 text-[0.9rem] leading-relaxed">
                    {hasil === "universal" ? (
                      "Barang ini tidak terikat pada satu model tertentu."
                    ) : hasil === "cocok" ? (
                      <>
                        Barang ini ada di daftar kecocokan untuk{" "}
                        <span className="font-medium">
                          {kendaraan!.merek} {kendaraan!.model} {kendaraan!.tahun}
                        </span>
                        .
                      </>
                    ) : (
                      <>
                        <span className="font-medium">
                          {kendaraan!.merek} {kendaraan!.model} {kendaraan!.tahun}
                        </span>{" "}
                        tidak ada di daftar kecocokan barang ini. Tanyakan dulu sebelum memesan, atau
                        cari barang lain yang cocok.
                      </>
                    )}
                  </p>

                  {hasil === "tidak-cocok" && (
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <WhatsAppLink
                        produk={{ nama: produk.nama, sku: produk.sku }}
                        gaya="garis"
                        label="Tanyakan kecocokannya"
                      />
                      <TransitionLink
                        href="/katalog"
                        className="inline-flex h-11 items-center border border-control px-4 text-[0.84rem] transition-colors hover:border-ink"
                      >
                        Cari yang cocok
                      </TransitionLink>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* ---- Pembelian ---- */}
          <div className="mt-6 border border-rule bg-panel p-4">
            <div className="flex flex-wrap items-center gap-3">
              <PengaturJumlah
                jumlah={jumlah}
                onUbah={(n) => setJumlah(Math.max(1, n))}
                maks={Math.max(1, Math.min(99, produk.stok))}
                namaBarang={produk.nama}
              />
              <p className="text-[0.86rem] text-ink-2" data-tabular>
                Subtotal {rupiah(produk.harga * jumlah)}
              </p>
            </div>

            <button
              type="button"
              disabled={habis}
              onClick={() => {
                tambah(produk.sku, jumlah);
                setTerbuka("keranjang", true);
              }}
              className="mt-4 inline-flex h-12 w-full items-center justify-center bg-ink px-5 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:bg-off-bg disabled:text-ink-2"
            >
              {habis ? "Stok habis" : "Tambah ke keranjang"}
            </button>

            <div className="mt-3">
              <WhatsAppLink
                produk={{ nama: produk.nama, sku: produk.sku }}
                gaya="garis"
                className="w-full"
              />
            </div>

            <p className="mt-4 text-[0.78rem] leading-relaxed text-ink-2">
              Ongkos kirim dihitung di langkah pengiriman. Ketentuan pengiriman dan retur belum diisi
              pemilik toko.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
