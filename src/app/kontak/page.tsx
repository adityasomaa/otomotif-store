import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { KONTAK, belumDiisi, NAMA_TOKO } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi toko untuk menanyakan ketersediaan barang, kecocokan dengan kendaraan, atau status pesanan.",
  alternates: { canonical: "/kontak" },
  openGraph: {
    title: `Kontak — ${NAMA_TOKO}`,
    description: "Tanyakan ketersediaan barang, kecocokan kendaraan, atau status pesanan.",
    url: "/kontak",
  },
};

const DAFTAR_KONTAK: { label: string; nilai: string | null; catatan: string }[] = [
  { label: "WhatsApp", nilai: KONTAK.whatsapp, catatan: "Nomor WhatsApp toko" },
  { label: "Email", nilai: KONTAK.email, catatan: "Email untuk urusan pesanan" },
  { label: "Alamat", nilai: KONTAK.alamat, catatan: "Alamat toko atau gudang" },
  { label: "Jam operasional", nilai: KONTAK.jamOperasional, catatan: "Hari dan jam layanan" },
  { label: "Instagram", nilai: KONTAK.instagram, catatan: "Akun Instagram toko" },
];

export default function HalamanKontak() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Kontak", href: "/kontak" },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Kontak</p>
        <h1 className="h-display mt-4">Hubungi toko</h1>
        <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed text-ink-2">
          Untuk menanyakan ketersediaan barang, kecocokan dengan kendaraan, atau status pesanan. Sebutkan
          merek, model, dan tahun kendaraan Anda supaya lebih cepat dibantu.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="data-kontak">
          <h2 id="data-kontak" className="eyebrow text-ink-2">
            Data kontak
          </h2>

          <dl className="mt-4 border-t border-rule">
            {DAFTAR_KONTAK.map((k) => {
              const kosong = belumDiisi(k.nilai);
              return (
                <div key={k.label} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-rule py-4">
                  <dt className="w-40 shrink-0 text-[0.86rem] text-ink-2">{k.label}</dt>
                  <dd className="min-w-0 flex-1 text-[0.92rem]">
                    {kosong ? (
                      <span className="inline-flex items-center gap-2 text-ink-2">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 border border-current" />
                        Belum diisi
                      </span>
                    ) : (
                      k.nilai
                    )}
                    <span className="mt-0.5 block text-[0.78rem] text-ink-2">{k.catatan}</span>
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-6 border border-control bg-panel p-4">
            <p className="eyebrow text-ink-2">Catatan</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-2">
              Data kontak di atas sengaja dikosongkan sampai dikonfirmasi pemilik toko. Tidak ada nomor,
              alamat, atau jam operasional yang dikarang di situs ini.
            </p>
          </div>
        </section>

        <ContactForm />
      </div>

      <section aria-labelledby="sebelum-tanya" className="mt-24">
        <SectionHeader
          urut="01"
          judul="Sebelum bertanya"
          headline="Cek kecocokan dulu, sering langsung terjawab"
          deskripsi="Banyak pertanyaan soal ukuran dan kecocokan sudah terjawab di halaman produk. Pilih kendaraan Anda, lalu lihat tabel kendaraan yang cocok di tiap barang."
          cta={{ label: "Buka cek kecocokan", href: "/cek-kecocokan" }}
          sebagai="h2"
        />
      </section>
    </div>
  );
}
