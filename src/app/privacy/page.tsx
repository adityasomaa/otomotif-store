import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { NAMA_TOKO, KONTAK, belumDiisi } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Penjelasan data apa saja yang dikumpulkan situs ini, untuk apa dipakai, dan bagaimana disimpan.",
  alternates: { canonical: "/privacy" },
};

export default function HalamanPrivasi() {
  return (
    <div className="shell py-10 md:py-14">
      <Breadcrumbs
        jalur={[
          { nama: "Home", href: "/" },
          { nama: "Kebijakan Privasi", href: "/privacy" },
        ]}
      />

      <header className="mt-6">
        <p className="eyebrow text-ink-2">Ketentuan</p>
        <h1 className="h-display mt-4">Kebijakan Privasi</h1>
        <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
          Halaman ini menjelaskan data apa saja yang dikumpulkan {NAMA_TOKO} melalui situs ini, untuk apa
          data itu dipakai, dan berapa lama disimpan.
        </p>
      </header>

      <div className="mt-12 max-w-[70ch]">
        <Pasal judul="Data yang disimpan di peramban Anda">
          <p>Situs ini menyimpan beberapa hal langsung di peramban Anda, bukan di server:</p>
          <ul>
            <li>
              <strong>Isi keranjang belanja.</strong> Berupa kode produk dan jumlahnya, supaya belanja bisa
              dilanjutkan setelah halaman ditutup.
            </li>
            <li>
              <strong>Kendaraan yang Anda pilih.</strong> Merek, model, dan tahun, supaya katalog bisa
              menyaring barang yang cocok.
            </li>
            <li>
              <strong>Pilihan Anda pada banner penyimpanan.</strong> Supaya banner tidak muncul terus.
            </li>
            <li>
              <strong>Salinan pesanan yang Anda buat.</strong> Supaya halaman Cek Pesanan tetap bisa
              menampilkannya dari perangkat yang sama.
            </li>
          </ul>
          <p>
            Kalau Anda menolak kategori preferensi di banner penyimpanan, pilihan kendaraan hanya disimpan
            selama tab masih terbuka dan catatan lama yang sudah tersimpan dihapus.
          </p>
        </Pasal>

        <Pasal judul="Data yang Anda kirimkan sendiri">
          <p>
            Data berikut hanya tercatat kalau Anda mengisinya: nama, email, nomor telepon, dan alamat
            pengiriman pada saat checkout, serta nama, email, dan isi pesan pada form kontak. Data itu
            dipakai untuk memproses dan menjawab pesanan atau pertanyaan Anda.
          </p>
        </Pasal>

        <Pasal judul="Pelacak pihak ketiga">
          <p>
            Situs ini tidak memasang layanan analitik, piksel iklan, atau pelacak pihak ketiga lain. Huruf
            yang dipakai situs ini disajikan dari server situs sendiri, jadi membuka halaman ini tidak
            mengirim permintaan ke penyedia font luar.
          </p>
        </Pasal>

        <Pasal judul="Pembayaran">
          <p>
            Situs ini tidak pernah meminta nomor kartu, tanggal kedaluwarsa, atau kode CVV, dan tidak
            menyimpan data kartu dalam bentuk apa pun. Bila nanti pembayaran daring diaktifkan, prosesnya
            dilakukan di halaman milik penyedia pembayaran, dan kebijakan privasi mereka berlaku pada
            bagian itu.
          </p>
        </Pasal>

        <Pasal judul="Berapa lama data disimpan">
          <p>
            Data yang tersimpan di peramban bertahan sampai Anda menghapusnya, atau sampai Anda mengubah
            pilihan di banner penyimpanan. Lama penyimpanan data pesanan di sisi toko akan ditentukan
            pemilik toko dan dicantumkan di sini setelah dikonfirmasi.
          </p>
        </Pasal>

        <Pasal judul="Hak Anda">
          <p>
            Anda dapat meminta salinan, perbaikan, atau penghapusan data yang Anda kirimkan, dan dapat
            menghapus sendiri data yang tersimpan di peramban lewat pengaturan peramban atau tombol{" "}
            <em>Atur penyimpanan peramban</em> di footer.
          </p>
        </Pasal>

        <Pasal judul="Menghubungi kami">
          <p>
            {belumDiisi(KONTAK.email) && belumDiisi(KONTAK.whatsapp) ? (
              <>
                Saluran resmi untuk permintaan terkait data pribadi belum diisi pemilik toko dan akan
                dicantumkan di sini setelah tersedia.
              </>
            ) : (
              <>Permintaan terkait data pribadi dapat dikirim melalui kontak yang tercantum di footer.</>
            )}
          </p>
        </Pasal>

        <Pasal judul="Perubahan kebijakan">
          <p>
            Kebijakan ini dapat diperbarui bila cara kerja situs berubah. Versi terbaru selalu ditampilkan
            di halaman ini.
          </p>
        </Pasal>
      </div>

      <section aria-labelledby="privasi-lanjut" className="mt-24">
        <SectionHeader
          urut="01"
          judul="Halaman terkait"
          headline="Ketentuan lain ada di halaman syarat dan ketentuan"
          deskripsi="Halaman itu menjelaskan cakupan layanan, cara pemesanan, serta bagian mana yang masih menunggu keputusan pemilik toko."
          cta={{ label: "Baca syarat dan ketentuan", href: "/terms" }}
          sebagai="h2"
        />
      </section>
    </div>
  );
}

function Pasal({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="h-sub">{judul}</h2>
      <div className="mt-4 grid gap-4 text-[0.95rem] leading-relaxed text-ink-2 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink [&_ul]:grid [&_ul]:gap-2">
        {children}
      </div>
    </section>
  );
}
