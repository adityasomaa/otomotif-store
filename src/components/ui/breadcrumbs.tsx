import { TransitionLink } from "@/components/ui/transition-link";
import { JsonLd, skemaRemah } from "@/lib/structured-data";

/* ============================================================================
 * REMAH NAVIGASI
 * Tampil di layar sekaligus dikirim sebagai BreadcrumbList untuk mesin pencari.
 * ========================================================================== */

export function Breadcrumbs({ jalur }: { jalur: { nama: string; href: string }[] }) {
  return (
    <>
      <JsonLd data={skemaRemah(jalur)} />
      <nav aria-label="Remah navigasi" className="min-w-0">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.78rem] text-ink-2">
          {jalur.map((j, i) => {
            const terakhir = i === jalur.length - 1;
            return (
              <li key={j.href} className="flex items-center gap-2">
                {terakhir ? (
                  <span aria-current="page" className="text-ink">
                    {j.nama}
                  </span>
                ) : (
                  <TransitionLink href={j.href} className="underline underline-offset-4 hover:text-ink">
                    {j.nama}
                  </TransitionLink>
                )}
                {!terakhir && (
                  <span aria-hidden="true" className="text-rule">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
