"use client";

/* ============================================================================
 * FORM KONTAK
 * ----------------------------------------------------------------------------
 * Isian diperiksa di browser supaya pembaca tahu lebih cepat, lalu diperiksa
 * ulang di server dengan aturan yang sama. Jawaban dari server disampaikan
 * apa adanya: selama tujuan pengiriman pesan belum diatur pemilik toko,
 * layar tidak berpura-pura pesan sudah terkirim.
 * ========================================================================== */

import { useState } from "react";
import { Kolom, Honeypot } from "@/components/ui/bits";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { skemaKontak, petaGalat } from "@/lib/validation";

export function ContactForm() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");
  const [situs, setSitus] = useState("");
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [mengirim, setMengirim] = useState(false);
  const [jawaban, setJawaban] = useState<{ ok: boolean; terkirim: boolean; pesan: string } | null>(null);

  const kirim = async (e: React.FormEvent) => {
    e.preventDefault();
    setJawaban(null);

    const hasil = skemaKontak.safeParse({ nama, email, pesan, situs });
    if (!hasil.success) {
      setGalat(petaGalat(hasil.error));
      return;
    }
    setGalat({});
    setMengirim(true);

    try {
      const jawab = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, pesan, situs }),
      });
      const data = await jawab.json();
      if (!jawab.ok || !data.ok) {
        if (data?.galat) setGalat(data.galat);
        setJawaban({ ok: false, terkirim: false, pesan: data?.pesan ?? "Pesan gagal dikirim." });
        return;
      }
      setJawaban({ ok: true, terkirim: Boolean(data.terkirim), pesan: data.pesan });
    } catch {
      setJawaban({ ok: false, terkirim: false, pesan: "Pesan gagal dikirim karena sambungan terputus." });
    } finally {
      setMengirim(false);
    }
  };

  return (
    <form onSubmit={kirim} noValidate className="border border-rule bg-panel p-5 sm:p-6">
      <h2 className="h-sub">Kirim pesan</h2>
      <p className="mt-3 max-w-[52ch] text-[0.9rem] leading-relaxed text-ink-2">
        Sebutkan kendaraan Anda dan barang yang dicari supaya lebih cepat dibantu.
      </p>

      <div className="mt-6 grid gap-5">
        <Kolom label="Nama" name="nama" nilai={nama} onUbah={setNama} galat={galat.nama} autoComplete="name" />
        <Kolom label="Email" name="email" nilai={email} onUbah={setEmail} galat={galat.email} tipe="email" autoComplete="email" />
        <Kolom
          label="Pesan"
          name="pesan"
          nilai={pesan}
          onUbah={setPesan}
          galat={galat.pesan}
          banyakBaris
          placeholder="Contoh: saya cari kampas rem depan untuk Toyota Avanza 2019."
        />
      </div>

      <Honeypot nilai={situs} onUbah={setSitus} />

      {jawaban && (
        <div
          role="status"
          className={`mt-5 border p-4 text-[0.88rem] leading-relaxed ${
            jawaban.ok && jawaban.terkirim
              ? "border-ok bg-ok-bg text-ok"
              : "border-accent-ink bg-accent-soft text-ink"
          }`}
        >
          {jawaban.pesan}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={mengirim}
          className="inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink disabled:bg-off-bg disabled:text-ink-2"
        >
          {mengirim ? "Mengirim…" : "Kirim pesan"}
        </button>
        <WhatsAppLink gaya="garis" label="Atau tanya lewat WhatsApp" />
      </div>
    </form>
  );
}
