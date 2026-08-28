"use client";

/* ============================================================================
 * FOOTER
 * ----------------------------------------------------------------------------
 * Setiap halaman berakhir dengan satu ajakan lanjut. Tujuannya bertukar
 * sendiri kalau pembaca sudah berada di halaman tujuan itu, jadi tidak pernah
 * ada tombol yang mengajak ke tempat yang sedang dibuka.
 * ========================================================================== */

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { TombolAturPenyimpanan } from "@/components/layout/cookie-banner";
import { TandaContoh } from "@/components/ui/bits";
import { NAV_UTAMA, NAV_LEGAL } from "@/lib/nav";
import { NAMA_TOKO, KONTAK, belumDiisi, DATA_CONTOH } from "@/lib/store-config";

/* Urutan pilihan ajakan. Yang dipakai adalah yang pertama dan bukan halaman
   yang sedang dibuka. */
const PILIHAN_CTA = [
  { href: "/katalog", label: "Lihat katalog", headline: "Cari komponen yang cocok dengan kendaraan Anda" },
  { href: "/cek-kecocokan", label: "Cek kecocokan kendaraan", headline: "Pastikan dulu barangnya muat sebelum memesan" },
  { href: "/kontak", label: "Hubungi toko", headline: "Masih ragu soal ukuran atau kecocokan" },
];

export function Footer() {
  const pathname = usePathname();

  const cta =
    PILIHAN_CTA.find((c) => !(pathname === c.href || pathname.startsWith(`${c.href}/`))) ?? PILIHAN_CTA[0];

  return (
    <footer className="on-deep mt-24 bg-deep text-chalk">
      {/* Ajakan penutup */}
      <section className="grid-field-deep border-b border-[color:var(--color-control-deep)]">
        <div className="shell py-16 md:py-20">
          <p className="eyebrow text-chalk-2">Langkah berikutnya</p>
          <h2 className="h-section mt-4 text-chalk">{cta.headline}</h2>
          <p className="mt-4 max-w-[54ch] text-[0.98rem] leading-relaxed text-chalk-2">
            Pilih merek, model, dan tahun kendaraan, lalu katalog hanya menampilkan yang cocok. Kalau masih
            ragu, tanyakan dulu sebelum memesan.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <TransitionLink
              href={cta.href}
              className="inline-flex h-12 items-center gap-2.5 bg-accent px-6 text-[0.88rem] font-medium text-ink transition-colors hover:bg-chalk"
            >
              {cta.label}
              <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true">
                <path d="M0 4.5h12M8.5 1L12 4.5L8.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </TransitionLink>
            <WhatsAppLink
              gaya="garis"
              className="border-chalk text-chalk hover:bg-chalk hover:text-ink"
              label="Tanya lewat WhatsApp"
            />
          </div>
        </div>
      </section>

      {/* Keterangan toko */}
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 64 64" width="22" height="22" aria-hidden="true">
              <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="6" />
              <circle cx="32" cy="32" r="7.5" fill="currentColor" />
              <rect x="29" y="1.5" width="6" height="14" fill="var(--color-accent)" />
              <rect x="29" y="48.5" width="6" height="14" fill="var(--color-accent)" />
            </svg>
            <span className="text-[0.98rem] font-medium">{NAMA_TOKO}</span>
          </div>
          <p className="mt-3.5 max-w-[34ch] text-[0.86rem] leading-relaxed text-chalk-2">
            Toko online sparepart, aksesoris, oli, audio, dan produk perawatan kendaraan, dengan pengecekan
            kecocokan berdasarkan merek, model, dan tahun.
          </p>
          {DATA_CONTOH && (
            <div className="mt-4">
              <TandaContoh>Seluruh produk dan harga adalah data contoh</TandaContoh>
            </div>
          )}
        </div>

        <nav aria-label="Menu footer">
          <p className="eyebrow text-chalk-2">Halaman</p>
          <ul className="mt-4 grid gap-2.5">
            {NAV_UTAMA.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="text-[0.88rem] text-chalk-2 transition-colors hover:text-chalk">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-chalk-2">Kontak</p>
          <ul className="mt-4 grid gap-3 text-[0.88rem]">
            <BarisKontak label="WhatsApp" nilai={KONTAK.whatsapp} />
            <BarisKontak label="Alamat" nilai={KONTAK.alamat} />
            <BarisKontak label="Jam operasional" nilai={KONTAK.jamOperasional} />
            <BarisKontak label="Email" nilai={KONTAK.email} />
          </ul>
        </div>

        <div>
          <p className="eyebrow text-chalk-2">Ketentuan</p>
          <ul className="mt-4 grid gap-2.5 text-[0.88rem]">
            {NAV_LEGAL.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="text-chalk-2 transition-colors hover:text-chalk">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
            <li>
              <TombolAturPenyimpanan className="text-chalk-2 hover:text-chalk" />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--color-control-deep)]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-5 text-[0.78rem] text-chalk-2">
          <p>
            &copy; {new Date().getFullYear()} {NAMA_TOKO}
          </p>
          <p>Nama toko masih sementara dan akan diganti.</p>
        </div>
      </div>
    </footer>
  );
}

function BarisKontak({ label, nilai }: { label: string; nilai: string | null }) {
  const kosong = belumDiisi(nilai);
  return (
    <li>
      <span className="block text-[0.72rem] tracking-wide text-chalk-2 uppercase">{label}</span>
      {kosong ? (
        <span className="mt-0.5 inline-flex items-center gap-1.5 text-chalk-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 border border-current" />
          Belum diisi
        </span>
      ) : (
        <span className="mt-0.5 block text-chalk">{nilai}</span>
      )}
    </li>
  );
}
