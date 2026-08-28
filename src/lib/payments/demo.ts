/* Mode simulasi. Tidak menghubungi jaringan mana pun dan tidak memindahkan uang. */
import type { AdapterPembayaran, HasilPembayaran, PermintaanPembayaran } from "./types";

export const adapterDemo: AdapterPembayaran = {
  mode: "demo",
  simulasi: true,
  namaTampilan: "Mode demo (simulasi)",

  async buatPembayaran(permintaan: PermintaanPembayaran): Promise<HasilPembayaran> {
    return {
      simulasi: true,
      mode: "demo",
      status: "siap",
      pesan:
        "Pesanan tercatat dalam mode demo. Tidak ada pembayaran yang diproses dan tidak ada uang yang berpindah.",
      urlPembayaran: null,
    };
  },
};
