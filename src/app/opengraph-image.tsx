/* ============================================================================
 * OG IMAGE
 * ----------------------------------------------------------------------------
 * Memakai wordmark toko dan bahasa visual yang sama dengan situsnya: kisi
 * garis teknis, satu warna aksen, tanpa foto stok dan tanpa logo merek
 * kendaraan mana pun.
 *
 * Hurufnya Neue Montreal yang sama dengan situs, dibaca dari berkas TTF di
 * dalam proyek karena pembuat gambar ini tidak bisa membaca WOFF2.
 * ========================================================================== */

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NAMA_TOKO } from "@/lib/store-config";

export const alt = `${NAMA_TOKO} — sparepart, aksesoris, oli, dan audio kendaraan`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const huruf = await readFile(path.join(process.cwd(), "src/fonts/NeueMontreal-Medium.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0f12",
          color: "#f4f3ef",
          padding: 72,
          fontFamily: "Neue Montreal",
          /* Kisi garis, bukan tekstur bintik. */
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        {/* Siku sudut */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                borderRadius: 999,
                border: "9px solid #f4f3ef",
                position: "relative",
              }}
            />
            <div style={{ display: "flex", width: 14, height: 64, background: "#ff5a1f" }} />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a9b0ba",
            }}
          >
            Katalog otomotif
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, letterSpacing: -3, lineHeight: 1 }}>
            {NAMA_TOKO}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 34,
              lineHeight: 1.3,
              color: "#a9b0ba",
              maxWidth: 900,
            }}
          >
            Sparepart, aksesoris, oli, audio, dan perawatan kendaraan, dengan pengecekan kecocokan
            berdasarkan merek, model, dan tahun.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 180, height: 6, background: "#ff5a1f" }} />
          <div style={{ display: "flex", flex: 1, height: 1, background: "#606771" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Neue Montreal", data: huruf, style: "normal", weight: 500 }],
    }
  );
}
