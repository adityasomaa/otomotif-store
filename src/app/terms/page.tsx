import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { TandaContoh } from "@/components/ui/bits";
import { NAMA_TOKO } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description:
    "Ketentuan penggunaan situs, cara pemesanan, serta bagian ketentuan pengiriman, retur, dan pembayaran yang masih menunggu keputusan pemilik toko.",
  alternates: { canonical: "/terms" },
};

export default function HalamanTerms() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Syarat dan Ketentuan", href: "/terms" },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Ketentuan</p>
        <h1 className="h-display mt-4">Syarat dan Ketentuan</h1>
        <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
          Ketentuan ini mengatur penggunaan situs {NAMA_TOKO} dan proses pemesanan melalui situs.
        </p>
        <div className="mt-5">
          <TandaContoh nada="kosong">
            Sebagian ketentuan belum diisi pemilik toko dan ditandai di bawah
          </TandaContoh>
        </div>
      </header>

      <div className="mt-12 max-w-[70ch]">
        <Pasal judul="1. Cakupan">
          <p>
            Ketentuan ini berlaku untuk seluruh halaman dan fitur di situs ini, termasuk katalog produk,
            pengecekan kecocokan kendaraan, keranjang belanja, dan proses pemesanan.
          </p>
        </Pasal>

        <Pasal judul="2. Informasi produk dan harga">
          <p>
            Seluruh produk, harga, dan daftar kecocokan kendaraan yang ditampilkan saat ini adalah data
            contoh untuk keperluan pengembangan situs, dan ditandai demikian di layar. Data itu akan
            diganti dengan katalog sebenarnya oleh pemilik toko.
          </p>
          <p>
            Daftar kecocokan kendaraan disediakan sebagai alat bantu. Ketidakhadiran suatu kendaraan pada
            daftar tidak selalu berarti barang tidak dapat dipakai, dan sebaliknya. Pembeli disarankan
            memastikan kembali sebelum memesan.
          </p>
        </Pasal>

        <Pasal judul="3. Pemesanan">
          <p>
            Pesanan dibuat dengan mengisi alamat pengiriman, memilih cara pengiriman, lalu menyetujui
            ringkasan pesanan. Setelah itu pembeli menerima kode pesanan yang dapat dipakai pada halaman
            Cek Pesanan.
          </p>
          <p>
            Pesanan yang tercatat belum berarti disetujui. Ketersediaan barang dapat berubah, dan pemilik
            toko dapat menghubungi pembeli bila ada penyesuaian.
          </p>
        </Pasal>

        <Pasal judul="4. Pembayaran" belum>
          <p>
            Pada versi situs saat ini, pembayaran daring belum diaktifkan. Menyelesaikan proses pemesanan
            hanya membuat catatan pesanan dan tidak menimbulkan tagihan maupun perpindahan dana.
          </p>
          <p>
            <strong>Ketentuan pembayaran akan diisi oleh pemilik toko</strong>, mencakup metode
            pembayaran yang diterima, batas waktu pembayaran, dan tata cara konfirmasi. Bagian ini sengaja
            dikosongkan dan tidak diisi dengan perkiraan.
          </p>
          <p>
            Situs ini tidak pernah meminta nomor kartu, tanggal kedaluwarsa, atau kode CVV pada form mana
            pun.
          </p>
        </Pasal>

        <Pasal judul="5. Pengiriman" belum>
          <p>
            Pilihan pengiriman yang tampil saat ini menggunakan tarif contoh untuk keperluan pengujian
            tampilan, dan ditandai demikian di layar.
          </p>
          <p>
            <strong>Ketentuan pengiriman akan diisi oleh pemilik toko</strong>, mencakup wilayah yang
            dilayani, jasa pengiriman yang dipakai, cara penghitungan ongkos kirim, perkiraan waktu
            pengiriman, dan penanganan barang yang rusak atau hilang dalam pengiriman. Bagian ini sengaja
            dikosongkan.
          </p>
        </Pasal>

        <Pasal judul="6. Retur dan penukaran" belum>
          <p>
            <strong>Ketentuan retur dan penukaran akan diisi oleh pemilik toko</strong>, mencakup jangka
            waktu pengajuan, kondisi barang yang dapat diterima kembali, biaya yang ditanggung masing
            masing pihak, dan tata cara pengajuannya. Bagian ini sengaja dikosongkan dan tidak diisi
            dengan perkiraan.
          </p>
        </Pasal>

        <Pasal judul="7. Penggunaan situs">
          <p>
            Pengguna tidak diperkenankan mengganggu jalannya situs, mengambil data secara otomatis dalam
            jumlah besar, atau memakai situs untuk keperluan yang melanggar hukum yang berlaku.
          </p>
        </Pasal>

        <Pasal judul="8. Merek pihak lain">
          <p>
            Nama merek kendaraan yang disebut pada daftar kecocokan dipakai semata mata untuk menerangkan
            kesesuaian barang. Penyebutan itu tidak menyatakan adanya hubungan, kerja sama, atau
            persetujuan dari pemilik merek tersebut.
          </p>
        </Pasal>

        <Pasal judul="9. Batasan tanggung jawab">
          <p>
            Situs disediakan sebagaimana adanya. Selama data pada situs masih berupa data contoh, isi
            katalog tidak dapat dijadikan dasar keputusan pembelian yang mengikat.
          </p>
        </Pasal>

        <Pasal judul="10. Perubahan ketentuan">
          <p>
            Ketentuan ini dapat diperbarui, terutama pada bagian yang saat ini masih menunggu keputusan
            pemilik toko. Versi terbaru selalu ditampilkan di halaman ini.
          </p>
        </Pasal>
      </div>

      <section aria-labelledby="terms-lanjut" className="mt-24">
        <SectionHeader
          urut="01"
          judul="Halaman terkait"
          headline="Penjelasan data pribadi ada di kebijakan privasi"
          deskripsi="Halaman itu menjelaskan data apa yang disimpan di peramban Anda, data apa yang Anda kirimkan sendiri, dan bagaimana mengaturnya."
          cta={{ label: "Baca kebijakan privasi", href: "/privacy" }}
          sebagai="h2"
        />
      </section>
    </div>
  );
}

function Pasal({
  judul,
  children,
  belum = false,
}: {
  judul: string;
  children: React.ReactNode;
  belum?: boolean;
}) {
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="h-sub">{judul}</h2>
        {belum && <TandaContoh nada="kosong">Menunggu isian pemilik toko</TandaContoh>}
      </div>
      <div className="mt-4 grid gap-4 text-[0.95rem] leading-relaxed text-ink-2 [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}
