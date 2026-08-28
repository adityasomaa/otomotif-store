"use client";

/* ============================================================================
 * MENU MOBILE
 * ----------------------------------------------------------------------------
 * Panel penuh yang duduk di atas isi halaman dan di atas bar keranjang
 * melayang, tapi tetap di bawah drawer keranjang, modal, dan cookie banner
 * ada di atasnya sendiri. Scroll halaman dikunci lewat pengatur lapisan
 * bersama, jadi tidak ada dua tempat yang saling berebut mengunci.
 * ========================================================================== */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import { useOverlay } from "@/components/providers/overlay-provider";
import { VehicleChip } from "@/components/fitment/vehicle-picker";
import { NAV_UTAMA, NAV_LEGAL } from "@/lib/nav";

export function MobileMenu() {
  const { terbuka, setTerbuka } = useOverlay();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  const buka = terbuka.menu;

  /* Fokus masuk ke panel begitu terbuka, supaya pembaca layar ikut pindah. */
  useEffect(() => {
    if (buka) panelRef.current?.focus();
  }, [buka]);

  if (!buka) return null;

  return (
    <div
      id="menu-mobile"
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu utama"
      className="layer-menu fixed inset-x-0 top-(--header-h) bottom-0 flex flex-col overflow-y-auto border-t border-rule bg-paper lg:hidden"
    >
      <nav aria-label="Menu utama mobile" className="shell flex-1 pt-6 pb-8">
        <ul className="flex flex-col">
          {NAV_UTAMA.map((item, i) => {
            const aktif = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="border-b border-rule">
                <TransitionLink
                  href={item.href}
                  sebelumPindah={() => setTerbuka("menu", false)}
                  aria-current={aktif ? "page" : undefined}
                  className="flex items-baseline justify-between gap-4 py-4"
                >
                  <span className={`text-[1.5rem] tracking-tight ${aktif ? "text-ink" : "text-ink-2"}`}>
                    {item.label}
                  </span>
                  <span className="eyebrow tabular-nums text-ink-2" data-tabular>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ul>

        <div className="mt-7">
          <VehicleChip />
        </div>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
          {NAV_LEGAL.map((item) => (
            <li key={item.href}>
              <TransitionLink
                href={item.href}
                sebelumPindah={() => setTerbuka("menu", false)}
                className="text-[0.82rem] text-ink-2 underline underline-offset-4 hover:text-ink"
              >
                {item.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
