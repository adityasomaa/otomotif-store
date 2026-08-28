/* Tarif contoh. Angkanya dibuat-buat untuk keperluan tampilan saja dan
   ditandai sebagai contoh di setiap tempat yang menampilkannya.
   Tidak ada janji lama pengiriman di sini, karena itu belum ditentukan. */
import type { AdapterOngkir, HasilOngkir, PermintaanOngkir } from "./types";

export const adapterOngkirDemo: AdapterOngkir = {
  mode: "demo",
  contoh: true,
  namaTampilan: "Tarif contoh (bukan tarif kurir sungguhan)",

  async hitung(permintaan: PermintaanOngkir): Promise<HasilOngkir> {
    const kg = Math.max(1, Math.ceil(permintaan.beratGram / 1000));

    return {
      contoh: true,
      mode: "demo",
      status: "siap",
      pesan:
        "Angka di bawah adalah tarif contoh untuk menguji tampilan. Tarif sebenarnya akan muncul setelah layanan pengiriman disambungkan.",
      pilihan: [
        {
          kode: "reguler",
          nama: "Reguler",
          ongkos: 12000 * kg,
          keterangan: `Tarif contoh, dihitung dari berat ${kg} kg.`,
        },
        {
          kode: "kargo",
          nama: "Kargo",
          ongkos: 8000 * kg,
          keterangan: `Tarif contoh untuk barang berat, dihitung dari berat ${kg} kg.`,
        },
        {
          kode: "ambil-sendiri",
          nama: "Ambil di toko",
          ongkos: 0,
          keterangan: "Tanpa ongkos kirim. Alamat dan jam pengambilan belum diisi.",
        },
      ],
    };
  },
};
