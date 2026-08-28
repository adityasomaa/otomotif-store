"use client";

/* ============================================================================
 * ALUR CHECKOUT
 * ----------------------------------------------------------------------------
 * Empat langkah: alamat, pengiriman, ringkasan, konfirmasi.
 *
 * Yang perlu diketahui pembaca kode ini:
 *
 * 1. TIDAK ADA kolom kartu di sini. Tidak ada nomor kartu, tanggal
 *    kedaluwarsa, atau CVV. Data seperti itu hanya boleh ditangani halaman
 *    milik penyedia pembayaran.
 *
 * 2. Pemeriksaan isian di berkas ini hanya untuk memberi tahu pembeli lebih
 *    cepat. Pemeriksaan yang sebenarnya ada di server, memakai aturan yang
 *    sama persis dari src/lib/validation.ts.
 *
 * 3. Harga, ongkos kirim, dan total dihitung ulang di server. Angka di layar
 *    ini cuma tampilan.
 *
 * 4. Selama mode pembayaran masih demo, layar konfirmasi menyatakan dengan
 *    jelas bahwa tidak ada uang yang berpindah.
 * ========================================================================== */

import { useCallback, useEffect, useMemo, useState } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import { Kolom, Honeypot, TandaContoh } from "@/components/ui/bits";
import { SplitFlap } from "@/components/ui/split-flap";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { useKeranjang } from "@/components/providers/cart-provider";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { skemaAlamat, petaGalat } from "@/lib/validation";
import { rupiah } from "@/lib/format";
import type { Pesanan } from "@/lib/orders/types";
import type { PilihanKirim } from "@/lib/shipping/types";

type Langkah = 1 | 2 | 3 | 4;

const NAMA_LANGKAH: Record<Langkah, string> = {
  1: "Alamat pengiriman",
  2: "Cara pengiriman",
  3: "Ringkasan pesanan",
  4: "Konfirmasi",
};

const ALAMAT_KOSONG = {
  nama: "",
  email: "",
  telepon: "",
  jalan: "",
  kota: "",
  provinsi: "",
  kodePos: "",
  catatan: "",
};

export function CheckoutFlow() {
  const { isi, jumlahBarang, subtotal, kosongkan, siap } = useKeranjang();
  const { kendaraan } = useKendaraan();

  const [langkah, setLangkah] = useState<Langkah>(1);
  const [alamat, setAlamat] = useState(ALAMAT_KOSONG);
  const [situs, setSitus] = useState("");
  const [galat, setGalat] = useState<Record<string, string>>({});

  const [pilihanKirim, setPilihanKirim] = useState<PilihanKirim[]>([]);
  const [kirimTerpilih, setKirimTerpilih] = useState<string | null>(null);
  const [ongkirContoh, setOngkirContoh] = useState(false);
  const [pesanOngkir, setPesanOngkir] = useState("");
  const [memuatOngkir, setMemuatOngkir] = useState(false);

  const [mengirim, setMengirim] = useState(false);
  const [galatUmum, setGalatUmum] = useState<string | null>(null);
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);

  const ongkos = useMemo(
    () => pilihanKirim.find((p) => p.kode === kirimTerpilih)?.ongkos ?? 0,
    [pilihanKirim, kirimTerpilih]
  );
  const total = subtotal + ongkos;

  /* ---- Langkah 1 -> 2 ---- */
  const lanjutDariAlamat = () => {
    const hasil = skemaAlamat.safeParse(alamat);
    if (!hasil.success) {
      setGalat(petaGalat(hasil.error));
      return;
    }
    setGalat({});
    setLangkah(2);
  };

  /* ---- Ambil pilihan pengiriman dari server ---- */
  const ambilOngkir = useCallback(async () => {
    setMemuatOngkir(true);
    setGalatUmum(null);
    try {
      const jawab = await fetch("/api/ongkir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kota: alamat.kota,
          kodePos: alamat.kodePos,
          jumlahBarang,
          nilaiBarang: subtotal,
        }),
      });
      const data = await jawab.json();
      if (!jawab.ok || !data.ok) {
        setPilihanKirim([]);
        setPesanOngkir(data?.pesan ?? "Pilihan pengiriman belum bisa diambil.");
        return;
      }
      setPilihanKirim(data.pilihan ?? []);
      setOngkirContoh(Boolean(data.contoh));
      setPesanOngkir(data.pesan ?? "");
      setKirimTerpilih((s) => s ?? data.pilihan?.[0]?.kode ?? null);
    } catch {
      setPilihanKirim([]);
      setPesanOngkir("Pilihan pengiriman belum bisa diambil karena sambungan terputus.");
    } finally {
      setMemuatOngkir(false);
    }
  }, [alamat.kota, alamat.kodePos, jumlahBarang, subtotal]);

  useEffect(() => {
    if (langkah === 2) void ambilOngkir();
  }, [langkah, ambilOngkir]);

  /* ---- Kirim pesanan ---- */
  const kirimPesanan = async () => {
    setMengirim(true);
    setGalatUmum(null);
    setGalat({});
    try {
      const jawab = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alamat,
          item: isi.map((b) => ({ sku: b.sku, jumlah: b.jumlah })),
          kodePengiriman: kirimTerpilih,
          kendaraan,
          situs,
        }),
      });
      const data = await jawab.json();

      if (!jawab.ok || !data.ok) {
        setGalatUmum(data?.pesan ?? "Pesanan gagal dibuat.");
        if (data?.galat) setGalat(data.galat);
        return;
      }

      setPesanan(data.pesanan as Pesanan);

      /* Simpan salinan di peramban pembeli supaya halaman Cek Pesanan tetap
         bisa menampilkannya walaupun memori server sudah dimulai ulang. */
      try {
        const kunci = "otomotif:pesanan";
        const lama = JSON.parse(window.localStorage.getItem(kunci) ?? "[]");
        const baru = [data.pesanan, ...(Array.isArray(lama) ? lama : [])].slice(0, 20);
        window.localStorage.setItem(kunci, JSON.stringify(baru));
      } catch {
        /* Diabaikan. */
      }

      kosongkan();
      setLangkah(4);
      window.scrollTo(0, 0);
    } catch {
      setGalatUmum("Pesanan gagal dikirim karena sambungan terputus.");
    } finally {
      setMengirim(false);
    }
  };

  /* ---- Keranjang kosong ---- */
  if (siap && isi.length === 0 && langkah !== 4) {
    return (
      <div className="mt-10 border border-rule bg-panel px-5 py-12 text-center">
        <p className="text-[1.05rem] font-medium">Keranjang masih kosong</p>
        <p className="mx-auto mt-2 max-w-[42ch] text-[0.9rem] leading-relaxed text-ink-2">
          Tambahkan barang dulu sebelum melanjutkan ke checkout.
        </p>
        <TransitionLink
          href="/katalog"
          className="mt-5 inline-flex h-11 items-center border border-ink px-5 text-[0.85rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
        >
          Lihat katalog
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <Stepper langkah={langkah} />

      {galatUmum && (
        <p role="alert" className="mt-6 border border-accent-ink bg-accent-soft px-4 py-3 text-[0.88rem] text-accent-ink">
          {galatUmum}
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-12">
        <div className="min-w-0">
          {langkah === 1 && (
            <LangkahAlamat
              alamat={alamat}
              setAlamat={setAlamat}
              galat={galat}
              situs={situs}
              setSitus={setSitus}
              lanjut={lanjutDariAlamat}
            />
          )}

          {langkah === 2 && (
            <LangkahPengiriman
              memuat={memuatOngkir}
              pilihan={pilihanKirim}
              terpilih={kirimTerpilih}
              setTerpilih={setKirimTerpilih}
              contoh={ongkirContoh}
              pesan={pesanOngkir}
              kembali={() => setLangkah(1)}
              lanjut={() => setLangkah(3)}
            />
          )}

          {langkah === 3 && (
            <LangkahRingkasan
              alamat={alamat}
              pilihan={pilihanKirim.find((p) => p.kode === kirimTerpilih) ?? null}
              item={isi}
              kembali={() => setLangkah(2)}
              kirim={kirimPesanan}
              mengirim={mengirim}
            />
          )}

          {langkah === 4 && pesanan && <LangkahKonfirmasi pesanan={pesanan} />}
        </div>

        {langkah !== 4 && (
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <RingkasanBiaya
                item={isi}
                subtotal={subtotal}
                ongkos={ongkos}
                total={total}
                adaOngkir={kirimTerpilih !== null && pilihanKirim.length > 0}
                ongkirContoh={ongkirContoh}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
function Stepper({ langkah }: { langkah: Langkah }) {
  return (
    <ol className="flex flex-wrap gap-x-2 gap-y-2">
      {([1, 2, 3, 4] as Langkah[]).map((n) => {
        const lewat = n < langkah;
        const kini = n === langkah;
        return (
          <li key={n} className="flex min-w-0 items-center gap-2">
            <span
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center text-[0.74rem] font-medium ${
                kini ? "bg-ink text-chalk" : lewat ? "bg-accent text-ink" : "border border-control text-ink-2"
              }`}
              data-tabular
            >
              {n}
            </span>
            <span className={`truncate text-[0.8rem] ${kini ? "text-ink" : "text-ink-2"}`}>
              {NAMA_LANGKAH[n]}
            </span>
            {n < 4 && <span aria-hidden="true" className="mx-1 hidden h-px w-6 bg-rule sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------------- */
function LangkahAlamat({
  alamat,
  setAlamat,
  galat,
  situs,
  setSitus,
  lanjut,
}: {
  alamat: typeof ALAMAT_KOSONG;
  setAlamat: (v: typeof ALAMAT_KOSONG) => void;
  galat: Record<string, string>;
  situs: string;
  setSitus: (v: string) => void;
  lanjut: () => void;
}) {
  const ubah = (k: keyof typeof ALAMAT_KOSONG) => (v: string) => setAlamat({ ...alamat, [k]: v });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        lanjut();
      }}
    >
      <h2 className="h-sub">Alamat pengiriman</h2>
      <p className="mt-3 max-w-[54ch] text-[0.92rem] leading-relaxed text-ink-2">
        Isi data penerima dan alamat tujuan. Semua isian diperiksa ulang di server sebelum pesanan dibuat.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Kolom label="Nama penerima" name="nama" nilai={alamat.nama} onUbah={ubah("nama")} galat={galat.nama} autoComplete="name" />
        <Kolom label="Nomor telepon" name="telepon" nilai={alamat.telepon} onUbah={ubah("telepon")} galat={galat.telepon} tipe="tel" autoComplete="tel" placeholder="081234567890" />
        <div className="sm:col-span-2">
          <Kolom label="Email" name="email" nilai={alamat.email} onUbah={ubah("email")} galat={galat.email} tipe="email" autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <Kolom label="Alamat lengkap" name="jalan" nilai={alamat.jalan} onUbah={ubah("jalan")} galat={galat.jalan} banyakBaris autoComplete="street-address" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" />
        </div>
        <Kolom label="Kota atau kabupaten" name="kota" nilai={alamat.kota} onUbah={ubah("kota")} galat={galat.kota} autoComplete="address-level2" />
        <Kolom label="Provinsi" name="provinsi" nilai={alamat.provinsi} onUbah={ubah("provinsi")} galat={galat.provinsi} autoComplete="address-level1" />
        <Kolom label="Kode pos" name="kodePos" nilai={alamat.kodePos} onUbah={ubah("kodePos")} galat={galat.kodePos} autoComplete="postal-code" />
        <div className="sm:col-span-2">
          <Kolom label="Catatan untuk kurir" name="catatan" nilai={alamat.catatan} onUbah={ubah("catatan")} galat={galat.catatan} banyakBaris wajib={false} />
        </div>
      </div>

      <Honeypot nilai={situs} onUbah={setSitus} />

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
        >
          Lanjut ke pengiriman
        </button>
        <TransitionLink
          href="/keranjang"
          className="inline-flex h-12 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
        >
          Kembali ke keranjang
        </TransitionLink>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------------- */
function LangkahPengiriman({
  memuat,
  pilihan,
  terpilih,
  setTerpilih,
  contoh,
  pesan,
  kembali,
  lanjut,
}: {
  memuat: boolean;
  pilihan: PilihanKirim[];
  terpilih: string | null;
  setTerpilih: (v: string) => void;
  contoh: boolean;
  pesan: string;
  kembali: () => void;
  lanjut: () => void;
}) {
  return (
    <div>
      <h2 className="h-sub">Cara pengiriman</h2>

      {contoh && (
        <div className="mt-4">
          <TandaContoh>Tarif contoh, bukan tarif kurir sungguhan</TandaContoh>
        </div>
      )}

      {pesan && <p className="mt-4 max-w-[56ch] text-[0.9rem] leading-relaxed text-ink-2">{pesan}</p>}

      {memuat ? (
        <p className="mt-7 text-[0.9rem] text-ink-2">Mengambil pilihan pengiriman&hellip;</p>
      ) : pilihan.length === 0 ? (
        <div className="mt-7 border border-accent-ink bg-accent-soft p-5">
          <p className="text-[0.92rem] leading-relaxed text-accent-ink">
            Belum ada pilihan pengiriman yang bisa ditampilkan, jadi pesanan belum bisa dilanjutkan dari
            layar ini.
          </p>
          <div className="mt-4">
            <WhatsAppLink gaya="garis" label="Tanya pengiriman lewat WhatsApp" />
          </div>
        </div>
      ) : (
        <fieldset className="mt-7">
          <legend className="sr-only">Pilih cara pengiriman</legend>
          <div className="grid gap-3">
            {pilihan.map((p) => {
              const aktif = p.kode === terpilih;
              return (
                <label
                  key={p.kode}
                  className={`flex cursor-pointer items-start gap-3.5 border p-4 transition-colors ${
                    aktif ? "border-ink bg-panel" : "border-control bg-panel hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="pengiriman"
                    value={p.kode}
                    checked={aktif}
                    onChange={() => setTerpilih(p.kode)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[0.98rem] font-medium">{p.nama}</span>
                      <span className="text-[0.98rem] font-medium" data-tabular>
                        {p.ongkos === 0 ? "Tanpa ongkos kirim" : rupiah(p.ongkos)}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.84rem] leading-relaxed text-ink-2">
                      {p.keterangan}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-4 text-[0.82rem] leading-relaxed text-ink-2">
            Perkiraan lama pengiriman belum ditentukan pemilik toko, jadi sengaja tidak ditampilkan di sini.
          </p>
        </fieldset>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={lanjut}
          disabled={!terpilih || pilihan.length === 0}
          className="inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:bg-off-bg disabled:text-ink-2"
        >
          Lanjut ke ringkasan
        </button>
        <button
          type="button"
          onClick={kembali}
          className="inline-flex h-12 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
function LangkahRingkasan({
  alamat,
  pilihan,
  item,
  kembali,
  kirim,
  mengirim,
}: {
  alamat: typeof ALAMAT_KOSONG;
  pilihan: PilihanKirim | null;
  item: ReturnType<typeof useKeranjang>["isi"];
  kembali: () => void;
  kirim: () => void;
  mengirim: boolean;
}) {
  return (
    <div>
      <h2 className="h-sub">Ringkasan pesanan</h2>
      <p className="mt-3 max-w-[54ch] text-[0.92rem] leading-relaxed text-ink-2">
        Periksa sekali lagi sebelum pesanan dibuat.
      </p>

      <section className="mt-7">
        <h3 className="eyebrow text-ink-2">Dikirim ke</h3>
        <div className="mt-3 border border-rule bg-panel p-4 text-[0.9rem] leading-relaxed">
          <p className="font-medium">{alamat.nama}</p>
          <p className="mt-1 text-ink-2">{alamat.telepon}</p>
          <p className="text-ink-2">{alamat.email}</p>
          <p className="mt-2">{alamat.jalan}</p>
          <p>
            {alamat.kota}, {alamat.provinsi} <span data-tabular>{alamat.kodePos}</span>
          </p>
          {alamat.catatan && <p className="mt-2 text-ink-2">Catatan: {alamat.catatan}</p>}
        </div>
      </section>

      <section className="mt-7">
        <h3 className="eyebrow text-ink-2">Barang</h3>
        <ul className="mt-3 border-t border-rule">
          {item.map((b) => (
            <li key={b.sku} className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
              <span className="min-w-0 text-[0.9rem]">
                {b.produk.nama}{" "}
                <span className="text-ink-2" data-tabular>
                  &times;{b.jumlah}
                </span>
              </span>
              <span className="shrink-0 text-[0.9rem]" data-tabular>
                {rupiah(b.subtotal)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-7">
        <h3 className="eyebrow text-ink-2">Pengiriman</h3>
        <p className="mt-3 text-[0.9rem]">
          {pilihan ? `${pilihan.nama} — ${pilihan.ongkos === 0 ? "tanpa ongkos kirim" : rupiah(pilihan.ongkos)}` : "Belum dipilih"}
        </p>
      </section>

      {/* Keterangan pembayaran yang apa adanya. */}
      <section className="mt-7 border border-ink bg-panel p-4">
        <h3 className="eyebrow text-ink-2">Pembayaran</h3>
        <p className="mt-2.5 text-[0.9rem] leading-relaxed">
          Pembayaran belum tersambung ke penyedia mana pun. Menekan tombol di bawah hanya membuat catatan
          pesanan, tidak menagih dan tidak memindahkan uang.
        </p>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-2">
          Situs ini tidak pernah meminta nomor kartu. Kalau nanti Xendit atau Midtrans sudah disambungkan,
          pembayaran dilakukan di halaman milik mereka.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={kirim}
          disabled={mengirim || !pilihan}
          className="inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:bg-off-bg disabled:text-ink-2"
        >
          {mengirim ? "Membuat pesanan…" : "Buat pesanan"}
        </button>
        <button
          type="button"
          onClick={kembali}
          className="inline-flex h-12 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
function LangkahKonfirmasi({ pesanan }: { pesanan: Pesanan }) {
  return (
    <div>
      <p className="eyebrow text-ink-2">Pesanan tercatat</p>
      <h2 className="h-sub mt-3">Kode pesanan Anda</h2>

      <div className="mt-5 inline-block bg-deep p-4">
        <SplitFlap
          teks={pesanan.kode}
          ukuran="sm"
          kecepatan={24}
          jedaAntarHuruf={32}
          label={`Kode pesanan ${pesanan.kode}`}
        />
      </div>

      {/* Papan di atas hanya tampilan. Kode aslinya ditulis ulang sebagai teks
          biasa supaya bisa langsung disalin, dan tetap terbaca kalau animasinya
          belum selesai berjalan. */}
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.78rem] text-ink-2">Salin kode ini:</span>
        <code
          className="border border-control bg-panel px-2.5 py-1 text-[0.95rem] tracking-[0.12em] select-all"
          data-tabular
        >
          {pesanan.kode}
        </code>
      </p>

      <p className="mt-5 max-w-[56ch] text-[0.94rem] leading-relaxed">
        Simpan kode di atas. Kode ini yang dipakai untuk membuka halaman{" "}
        <TransitionLink href="/cek-pesanan" className="underline underline-offset-4">
          Cek Pesanan
        </TransitionLink>
        .
      </p>

      {/* Pernyataan yang tidak boleh disamarkan. */}
      <div className="mt-7 border border-accent-ink bg-accent-soft p-5">
        <p className="eyebrow text-accent-ink">Belum ada pembayaran</p>
        <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink">{pesanan.pembayaran.pesan}</p>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-ink">
          Tidak ada uang yang berpindah dan tidak ada tagihan yang dibuat. Pesanan ini baru berupa catatan.
          Hubungi toko untuk melanjutkan.
        </p>
        <div className="mt-4">
          <WhatsAppLink gaya="garis" label="Lanjutkan lewat WhatsApp" />
        </div>
      </div>

      <section className="mt-8">
        <h3 className="eyebrow text-ink-2">Rincian</h3>
        <dl className="mt-3 border-t border-rule text-[0.9rem]">
          <BarisRincian label="Nama penerima" nilai={pesanan.pembeli.nama} />
          <BarisRincian
            label="Alamat"
            nilai={`${pesanan.alamat.jalan}, ${pesanan.alamat.kota}, ${pesanan.alamat.provinsi} ${pesanan.alamat.kodePos}`}
          />
          <BarisRincian label="Pengiriman" nilai={pesanan.pengiriman.nama} />
          <BarisRincian label="Subtotal" nilai={rupiah(pesanan.subtotal)} />
          <BarisRincian
            label="Ongkos kirim"
            nilai={`${rupiah(pesanan.pengiriman.ongkos)}${pesanan.ongkirContoh ? " (tarif contoh)" : ""}`}
          />
          <BarisRincian label="Total" nilai={rupiah(pesanan.total)} tebal />
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <TransitionLink
          href="/cek-pesanan"
          className="inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
        >
          Buka Cek Pesanan
        </TransitionLink>
        <TransitionLink
          href="/katalog"
          className="inline-flex h-12 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
        >
          Kembali ke katalog
        </TransitionLink>
      </div>
    </div>
  );
}

function BarisRincian({ label, nilai, tebal = false }: { label: string; nilai: string; tebal?: boolean }) {
  return (
    <div className="flex gap-4 border-b border-rule py-3">
      <dt className="w-36 shrink-0 text-ink-2">{label}</dt>
      <dd className={`min-w-0 flex-1 ${tebal ? "font-medium" : ""}`} data-tabular>
        {nilai}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
function RingkasanBiaya({
  item,
  subtotal,
  ongkos,
  total,
  adaOngkir,
  ongkirContoh,
}: {
  item: ReturnType<typeof useKeranjang>["isi"];
  subtotal: number;
  ongkos: number;
  total: number;
  adaOngkir: boolean;
  ongkirContoh: boolean;
}) {
  return (
    <div className="border border-ink bg-panel">
      <div className="border-b border-rule px-4 py-3">
        <p className="eyebrow text-ink-2">Ringkasan biaya</p>
      </div>
      <ul className="px-4 py-3">
        {item.map((b) => (
          <li key={b.sku} className="flex items-baseline justify-between gap-3 py-1.5 text-[0.86rem]">
            <span className="min-w-0 truncate">
              {b.produk.nama} <span className="text-ink-2">&times;{b.jumlah}</span>
            </span>
            <span className="shrink-0" data-tabular>
              {rupiah(b.subtotal)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="border-t border-rule px-4 py-3 text-[0.88rem]">
        <div className="flex justify-between py-1">
          <dt className="text-ink-2">Subtotal</dt>
          <dd data-tabular>{rupiah(subtotal)}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-ink-2">Ongkos kirim</dt>
          <dd data-tabular>{adaOngkir ? rupiah(ongkos) : "Belum dihitung"}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-rule pt-3">
          <dt className="font-medium">Total</dt>
          <dd className="text-[1.05rem] font-medium" data-tabular>
            {rupiah(total)}
          </dd>
        </div>
      </dl>
      <div className="border-t border-rule px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <TandaContoh>Harga contoh</TandaContoh>
          {ongkirContoh && <TandaContoh>Ongkir contoh</TandaContoh>}
        </div>
      </div>
    </div>
  );
}
