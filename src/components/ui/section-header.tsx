/* ============================================================================
 * KEPALA SECTION
 * ----------------------------------------------------------------------------
 * Semua section di situs ini memakai komponen yang sama, dengan empat bagian
 * dalam urutan yang selalu sama:
 *
 *   1. judul section   label pendek
 *   2. headline        kalimat utama
 *   3. deskripsi       satu paragraf singkat
 *   4. CTA             satu ajakan lanjut
 * ========================================================================== */

import { TransitionLink } from "@/components/ui/transition-link";

type Props = {
  judul: string;
  headline: string;
  deskripsi: string;
  cta: { label: string; href: string };
  /** Nomor urut kecil bergaya lembar spesifikasi, misalnya "01". */
  urut?: string;
  diAtasGelap?: boolean;
  /** Tingkat heading yang benar untuk urutan halaman. */
  sebagai?: "h2" | "h3";
  className?: string;
};

export function SectionHeader({
  judul,
  headline,
  deskripsi,
  cta,
  urut,
  diAtasGelap = false,
  sebagai: Heading = "h2",
  className = "",
}: Props) {
  const warnaJudul = diAtasGelap ? "text-chalk-2" : "text-ink-2";
  const warnaDeskripsi = diAtasGelap ? "text-chalk-2" : "text-ink-2";
  const warnaCta = diAtasGelap
    ? "border-chalk text-chalk hover:bg-chalk hover:text-ink"
    : "border-ink text-ink hover:bg-ink hover:text-chalk";

  return (
    <div className={`max-w-full ${className}`}>
      {/* 1. judul section */}
      <div className={`flex items-center gap-3 ${warnaJudul}`}>
        {urut && (
          <span className="eyebrow tabular-nums" data-tabular>
            {urut}
          </span>
        )}
        <span className="eyebrow">{judul}</span>
        <span
          aria-hidden="true"
          className={`h-px flex-1 ${diAtasGelap ? "bg-control-deep" : "bg-rule"}`}
        />
      </div>

      {/* 2. headline */}
      <Heading className={`h-section mt-5 ${diAtasGelap ? "text-chalk" : "text-ink"}`}>{headline}</Heading>

      {/* 3. deskripsi singkat */}
      <p className={`mt-4 max-w-[58ch] text-[0.98rem] leading-relaxed ${warnaDeskripsi}`}>{deskripsi}</p>

      {/* 4. CTA */}
      <TransitionLink
        href={cta.href}
        className={`mt-6 inline-flex h-11 items-center gap-2.5 border px-5 text-[0.85rem] font-medium transition-colors ${warnaCta}`}
      >
        {cta.label}
        <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true">
          <path d="M0 4.5h12M8.5 1L12 4.5L8.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </TransitionLink>
    </div>
  );
}
