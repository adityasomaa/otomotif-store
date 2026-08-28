"use client";

/* ============================================================================
 * TOMBOL TANYA LEWAT WHATSAPP
 * ----------------------------------------------------------------------------
 * Satu komponen ini dipakai oleh semua tombol WhatsApp di situs, jadi isi
 * pesannya selalu disusun dengan cara yang sama.
 *
 * Pesan otomatis berisi:
 *   - nama produk dan kode produknya
 *   - kendaraan yang sedang dipilih pembeli, kalau ada
 *   - alamat halaman tempat tombol ditekan
 *
 * Selama nomor WhatsApp toko belum diisi di src/lib/store-config.ts, tombol
 * tetap bisa ditekan dan menampilkan pesan yang akan dikirim, dengan
 * keterangan jujur bahwa nomornya memang belum ada. Tidak ada nomor yang
 * dikarang di mana pun.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { nomorWhatsApp, NAMA_TOKO } from "@/lib/store-config";
import { useKendaraan } from "@/components/providers/vehicle-provider";
import { useOverlay } from "@/components/providers/overlay-provider";

type Props = {
  /** Konteks produk. Boleh dikosongkan untuk pertanyaan umum. */
  produk?: { nama: string; sku: string } | null;
  label?: string;
  /** "utama" mengisi bidang, "garis" hanya bergaris tepi. */
  gaya?: "utama" | "garis" | "polos";
  className?: string;
};

export function WhatsAppLink({ produk = null, label = "Tanya lewat WhatsApp", gaya = "garis", className = "" }: Props) {
  const { kendaraan } = useKendaraan();
  const { setTerbuka } = useOverlay();
  const [dialogTerbuka, setDialogTerbuka] = useState(false);
  const [alamatHalaman, setAlamatHalaman] = useState("");
  const tombolTutupRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setAlamatHalaman(window.location.href);
  }, []);

  const nomor = nomorWhatsApp();

  const barisPesan = [
    `Halo ${NAMA_TOKO}, saya mau tanya.`,
    "",
    ...(produk ? [`Produk: ${produk.nama}`, `Kode produk: ${produk.sku}`] : ["Pertanyaan umum."]),
    ...(kendaraan
      ? [`Kendaraan saya: ${kendaraan.merek} ${kendaraan.model} ${kendaraan.tahun}`]
      : ["Kendaraan saya: belum saya pilih di website."]),
    ...(alamatHalaman ? ["", `Halaman: ${alamatHalaman}`] : []),
  ];
  const pesan = barisPesan.join("\n");

  const kelasDasar =
    "inline-flex h-11 items-center justify-center gap-2.5 px-5 text-[0.85rem] font-medium transition-colors";
  const kelasGaya =
    gaya === "utama"
      ? "bg-ink text-chalk hover:bg-accent hover:text-ink"
      : gaya === "garis"
        ? "border border-ink text-ink hover:bg-ink hover:text-chalk"
        : "text-ink underline underline-offset-4 hover:text-accent-ink";

  const isi = (
    <>
      <IkonWhatsApp />
      {label}
    </>
  );

  /* Nomor sudah ada: tautan biasa ke WhatsApp. */
  if (nomor) {
    return (
      <a
        href={`https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${kelasDasar} ${kelasGaya} ${className}`}
      >
        {isi}
      </a>
    );
  }

  /* Nomor belum diisi: tampilkan pesan yang akan dikirim, apa adanya. */
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDialogTerbuka(true);
          setTerbuka("modal", true);
        }}
        className={`${kelasDasar} ${kelasGaya} ${className}`}
      >
        {isi}
      </button>

      {dialogTerbuka && (
        <DialogNomorBelumDiisi
          pesan={pesan}
          tutupRef={tombolTutupRef}
          tutup={() => {
            setDialogTerbuka(false);
            setTerbuka("modal", false);
          }}
        />
      )}
    </>
  );
}

function DialogNomorBelumDiisi({
  pesan,
  tutup,
  tutupRef,
}: {
  pesan: string;
  tutup: () => void;
  tutupRef: React.RefObject<HTMLButtonElement | null>;
}) {
  useEffect(() => {
    tutupRef.current?.focus();
    const saatTekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
    };
    window.addEventListener("keydown", saatTekan);
    return () => window.removeEventListener("keydown", saatTekan);
  }, [tutup, tutupRef]);

  return (
    <div className="layer-overlay fixed inset-0 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Tutup"
        onClick={tutup}
        className="absolute inset-0 bg-ink/55"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-judul"
        className="relative w-full max-w-lg border border-ink bg-panel p-6 sm:p-7"
      >
        <p className="eyebrow text-accent-ink">Belum diisi</p>
        <h2 id="wa-judul" className="h-sub mt-2">
          Nomor WhatsApp toko belum ada
        </h2>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">
          Tombol ini sudah berfungsi. Yang belum ada hanya nomor tujuannya. Begitu nomor toko diisi,
          tombol ini langsung membuka WhatsApp dengan pesan di bawah sudah terisi otomatis.
        </p>

        <p className="eyebrow mt-6 text-ink-2">Pesan yang akan terkirim</p>
        <pre className="mt-2 max-h-56 overflow-auto border border-rule bg-paper p-3.5 text-[0.82rem] leading-relaxed whitespace-pre-wrap text-ink">
          {pesan}
        </pre>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            ref={tutupRef}
            type="button"
            onClick={tutup}
            className="inline-flex h-11 items-center border border-ink px-5 text-[0.85rem] font-medium transition-colors hover:bg-ink hover:text-chalk"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function IkonWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path
        d="M8 1.6a6.4 6.4 0 0 0-5.5 9.66L1.6 14.4l3.23-.85A6.4 6.4 0 1 0 8 1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M5.7 5.2c.2-.1.5 0 .6.2l.5 1c.1.2 0 .4-.1.5l-.3.3c-.1.1-.1.2 0 .4.3.5.8 1 1.3 1.3.1.1.3.1.4 0l.3-.3c.1-.2.3-.2.5-.1l1 .5c.2.1.3.4.2.6-.2.5-.7.9-1.2.9-1.7 0-3.6-1.9-3.6-3.6 0-.5.4-1 .9-1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
