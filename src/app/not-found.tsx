import { TransitionLink } from "@/components/ui/transition-link";

export default function TidakDitemukan() {
  return (
    <div className="shell flex min-h-[60svh] flex-col justify-center py-20">
      <p className="eyebrow text-ink-2">Halaman tidak ditemukan</p>
      <h1 className="h-display mt-4">Alamat ini tidak ada</h1>
      <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink-2">
        Halaman yang Anda tuju mungkin sudah dipindahkan, atau alamatnya salah ketik. Coba mulai lagi dari
        katalog.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <TransitionLink
          href="/katalog"
          className="inline-flex h-12 items-center bg-ink px-6 text-[0.88rem] font-medium text-chalk transition-colors hover:bg-accent hover:text-ink"
        >
          Buka katalog
        </TransitionLink>
        <TransitionLink
          href="/"
          className="inline-flex h-12 items-center border border-control px-5 text-[0.85rem] transition-colors hover:border-ink"
        >
          Kembali ke home
        </TransitionLink>
      </div>
    </div>
  );
}
