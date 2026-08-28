"use client";

/* ============================================================================
 * CEK PESANAN
 * ----------------------------------------------------------------------------
 * Pencarian dilakukan dua arah, dan urutannya penting:
 *
 *   1. tanya ke server lebih dulu
 *   2. kalau server tidak punya, cari salinan di peramban pembeli
 *
 * Alasannya jujur saja: penyimpanan pesanan saat ini masih di memori server
 * dan belum awet, jadi salinan di peramban adalah jaring pengaman supaya
 * pembeli tetap bisa membuka pesanannya sendiri. Kalau salinan itu yang
 * dipakai, layar mengatakannya apa adanya.
 * ========================================================================== */

import { useState } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import { SplitFlap } from "@/components/ui/split-flap";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { rapikanKodePesanan, POLA_KODE_PESANAN } from "@/lib/orders";
import { LABEL_STATUS, type Pesanan } from "@/lib/orders/types";
import { rupiah, tanggal } from "@/lib/format";

type Sumber = "server" | "peramban" | null;

export function OrderLookup() {
  const [kode, setKode] = useState("");
  const [mencari, setMencari] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [sumber, setSumber] = useState<Sumber>(null);

  const cariDiPeramban = (k: string): Pesanan | null => {
    try {
      const daftar = JSON.parse(window.localStorage.getItem("otomotif:pesanan") ?? "[]");
      if (!Array.isArray(daftar)) return null;
      return daftar.find((p: Pesanan) => p?.kode?.toUpperCase() === k) ?? null;
    } catch {
      return null;
    }
  };

  const cari = async (e: React.FormEvent) => {
    e.preventDefault();
    const bersih = kode.toUpperCase().trim();

    setPesanan(null);
    setSumber(null);
    setGalat(null);

    if (!POLA_KODE_PESANAN.test(bersih)) {
      setGalat("Bentuk kode pesanan belum benar. Contohnya OTO-A2B3-C4D5.");
      return;
    }

    setMencari(true);
    try {
      const jawab = await fetch(`/api/pesanan/${encodeURIComponent(bersih)}`);
      const data = await jawab.json();

      if (jawab.ok && data.ok) {
        setPesanan(data.pesanan as Pesanan);
        setSumber("server");
        return;
      }

      const salinan = cariDiPeramban(bersih);
      if (salinan) {
        setPesanan(salinan);
        setSumber("peramban");
        return;
      }

      setGalat(
        data?.pesan ??
          "Pesanan dengan kode itu tidak ditemukan. Periksa lagi kodenya, atau hubungi toko lewat WhatsApp."
      );
    } catch {
      const salinan = cariDiPeramban(bersih);
      if (salinan) {
        setPesanan(salinan);
        setSumber("peramban");
        return;
      }
      setGalat("Pencarian gagal karena sambungan terputus. Coba lagi sebentar lagi.");
    } finally {
      setMencari(false);
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={cari} noValidate className="border border-ink bg-panel p-5">
        <label htmlFor="kode-pesanan" className="eyebrow mb-2 block text-ink-2">
          Kode pesanan
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="kode-pesanan"
            name="kode"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            value={kode}
            onChange={(e) => setKode(rapikanKodePesanan(e.target.value))}
            placeholder="OTO-A2B3-C4D5"
            aria-invalid={galat ? true : undefined}
            aria-describedby={galat ? "kode-galat" : "kode-petunjuk"}
            className="h-12 w-full border border-control bg-panel px-3.5 text-[0.95rem] tracking-[0.08em] uppercase outline-none transition-colors focus:border-ink sm:max-w-xs"
            data-tabular
          />
          <button
            type="submit"
            disabled={mencari}
            className="inline-flex h-12 shrink-0 items-center justify-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink disabled:bg-off-bg disabled:text-ink-2"
          >
            {mencari ? "Mencari…" : "Cari pesanan"}
          </button>
        </div>

        {galat ? (
          <p id="kode-galat" role="alert" className="mt-3 text-[0.85rem] text-accent-ink">
            {galat}
          </p>
        ) : (
          <p id="kode-petunjuk" className="mt-3 text-[0.82rem] leading-relaxed text-ink-2">
            Kode pesanan diberikan di layar konfirmasi setelah pesanan dibuat. Bentuknya OTO diikuti dua
            kelompok empat karakter.
          </p>
        )}
      </form>

      {galat && (
        <div className="mt-5 flex flex-wrap gap-3">
          <WhatsAppLink gaya="garis" label="Tanya status lewat WhatsApp" />
          <TransitionLink
            href="/katalog"
            className="inline-flex h-11 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
          >
            Kembali ke katalog
          </TransitionLink>
        </div>
      )}

      {pesanan && <HasilPesanan pesanan={pesanan} sumber={sumber} />}
    </div>
  );
}

function HasilPesanan({ pesanan, sumber }: { pesanan: Pesanan; sumber: Sumber }) {
  return (
    <section aria-labelledby="hasil-pesanan" className="mt-10">
      <h2 id="hasil-pesanan" className="eyebrow text-ink-2">
        Pesanan ditemukan
      </h2>

      <div className="mt-4 border border-ink">
        <div className="bg-deep p-5">
          <p className="eyebrow mb-3 text-chalk-2">Status</p>
          <SplitFlap
            teks={LABEL_STATUS[pesanan.status]}
            ukuran="sm"
            label={`Status pesanan: ${LABEL_STATUS[pesanan.status]}`}
          />
          <p className="mt-4 text-[0.8rem] text-chalk-2" data-tabular>
            {pesanan.kode} &middot; dibuat {tanggal(pesanan.dibuatPada)}
          </p>
        </div>

        <div className="bg-panel p-5">
          {sumber === "peramban" && (
            <p className="mb-4 border border-control bg-paper px-3.5 py-3 text-[0.84rem] leading-relaxed text-ink-2">
              Pesanan ini dibaca dari salinan di peramban perangkat ini, bukan dari server. Penyimpanan
              pesanan di server belum awet, jadi kode ini belum tentu bisa dibuka dari perangkat lain.
            </p>
          )}

          <div className="border border-accent-ink bg-accent-soft p-4">
            <p className="eyebrow text-accent-ink">Catatan pembayaran</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink">{pesanan.pembayaran.pesan}</p>
          </div>

          <h3 className="eyebrow mt-6 text-ink-2">Barang</h3>
          <ul className="mt-3 border-t border-rule">
            {pesanan.item.map((b) => (
              <li key={b.sku} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5">
                <span className="min-w-0 text-[0.88rem]">
                  <TransitionLink href={`/produk/${b.slug}`} className="hover:text-accent-ink">
                    {b.nama}
                  </TransitionLink>{" "}
                  <span className="text-ink-2" data-tabular>
                    &times;{b.jumlah}
                  </span>
                </span>
                <span className="shrink-0 text-[0.88rem]" data-tabular>
                  {rupiah(b.hargaSatuan * b.jumlah)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 text-[0.88rem]">
            <div className="flex justify-between py-1">
              <dt className="text-ink-2">Subtotal</dt>
              <dd data-tabular>{rupiah(pesanan.subtotal)}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-ink-2">
                Ongkos kirim{pesanan.ongkirContoh ? " (tarif contoh)" : ""}
              </dt>
              <dd data-tabular>{rupiah(pesanan.pengiriman.ongkos)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-rule pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="font-medium" data-tabular>
                {rupiah(pesanan.total)}
              </dd>
            </div>
          </dl>

          <h3 className="eyebrow mt-6 text-ink-2">Dikirim ke</h3>
          <p className="mt-2 text-[0.88rem] leading-relaxed">
            {pesanan.pembeli.nama}
            <br />
            {pesanan.alamat.jalan}
            <br />
            {pesanan.alamat.kota}, {pesanan.alamat.provinsi}{" "}
            <span data-tabular>{pesanan.alamat.kodePos}</span>
            <br />
            <span className="text-ink-2">
              {pesanan.pengiriman.nama} &middot; {pesanan.pengiriman.keterangan}
            </span>
          </p>

          <div className="mt-6">
            <WhatsAppLink gaya="garis" label="Tanya pesanan ini lewat WhatsApp" />
          </div>
        </div>
      </div>
    </section>
  );
}
