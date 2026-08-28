import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ConsentProvider } from "@/components/providers/consent-provider";
import { VehicleProvider } from "@/components/providers/vehicle-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { OverlayProvider } from "@/components/providers/overlay-provider";
import { TransitionProvider } from "@/components/providers/transition-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Curtain } from "@/components/motion/curtain";
import { Header } from "@/components/layout/header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { CartDrawer, CartBar } from "@/components/cart/cart-drawer";
import { NAMA_TOKO, DESKRIPSI_TOKO, DOMAIN } from "@/lib/store-config";

/* Neue Montreal, diubah ke WOFF2 dan disajikan dari server sendiri.
   Tidak ada permintaan ke penyedia font pihak ketiga. */
const neue = localFont({
  src: [
    { path: "../fonts/NeueMontreal-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/NeueMontreal-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/NeueMontreal-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-neue",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: `${NAMA_TOKO} — Sparepart, Aksesoris, Oli, dan Audio Kendaraan`,
    template: `%s — ${NAMA_TOKO}`,
  },
  description: DESKRIPSI_TOKO,
  applicationName: NAMA_TOKO,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: DOMAIN,
    siteName: NAMA_TOKO,
    title: `${NAMA_TOKO} — Sparepart, Aksesoris, Oli, dan Audio Kendaraan`,
    description: DESKRIPSI_TOKO,
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAMA_TOKO} — Sparepart, Aksesoris, Oli, dan Audio Kendaraan`,
    description: DESKRIPSI_TOKO,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={neue.variable}>
      <body>
        <ConsentProvider>
          <VehicleProvider>
            <CartProvider>
              <OverlayProvider>
                <TransitionProvider>
                  {/* Skip link duduk di lapisan paling atas supaya selalu bisa
                      dijangkau lebih dulu dengan papan ketik. */}
                  <a
                    href="#isi-utama"
                    className="layer-skip sr-only bg-ink px-4 py-3 text-[0.85rem] font-medium text-chalk focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
                  >
                    Lompat ke isi utama
                  </a>

                  <LenisProvider />
                  <Curtain />

                  <Header />
                  <MobileMenu />

                  <main id="isi-utama" className="layer-content relative">
                    {children}
                  </main>

                  <Footer />

                  <CartBar />
                  <CartDrawer />
                  <CookieBanner />
                </TransitionProvider>
              </OverlayProvider>
            </CartProvider>
          </VehicleProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
