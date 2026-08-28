import type { Metadata } from "next";
import { FitmentChecker } from "@/components/fitment/fitment-checker";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { NAMA_TOKO } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Cek Kecocokan Sparepart dengan Kendaraan",
  description:
    "Cek kecocokan sparepart dan aksesoris dengan kendaraan Anda berdasarkan merek, model, dan tahun sebelum memesan.",
  alternates: { canonical: "/cek-kecocokan" },
  openGraph: {
    title: `Cek Kecocokan Kendaraan — ${NAMA_TOKO}`,
    description:
      "Pilih merek, model, dan tahun kendaraan untuk melihat barang mana saja yang cocok.",
    url: "/cek-kecocokan",
  },
};

export default function HalamanCekKecocokan() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Cek Kecocokan", href: "/cek-kecocokan" },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Cek kecocokan</p>
        <h1 className="h-display mt-4">Pastikan barangnya muat</h1>
        <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed text-ink-2">
          Kesalahan paling sering saat membeli sparepart adalah barangnya tidak muat di kendaraan. Pilih
          merek, model, dan tahun kendaraan Anda di sini, lalu katalog dan halaman produk akan mengikuti
          pilihan itu.
        </p>
      </header>

      <FitmentChecker />

      <section aria-labelledby="cara-kerja" className="mt-24">
        <SectionHeader
          urut="01"
          judul="Cara kerjanya"
          headline="Sekali pilih, terbawa ke seluruh halaman"
          deskripsi="Pilihan kendaraan Anda tersimpan di peramban dan dipakai ulang di katalog, halaman produk, dan keranjang. Di tiap halaman produk ada tabel kendaraan yang cocok, lengkap dengan penanda apakah kendaraan Anda termasuk."
          cta={{ label: "Buka katalog", href: "/katalog" }}
          sebagai="h2"
        />
      </section>
    </div>
  );
}
