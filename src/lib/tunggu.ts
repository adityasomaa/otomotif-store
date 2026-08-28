/* ============================================================================
 * PENUNGGU WAKTU YANG TIDAK BISA NYANGKUT
 * ----------------------------------------------------------------------------
 * requestAnimationFrame berhenti dipanggil ketika tab dipindah ke belakang.
 * Kalau urutan transisi halaman hanya bergantung padanya, tirai bisa berhenti
 * di tengah dan tidak pernah dibuka lagi.
 *
 * Jadi keduanya dijalankan berbarengan dan yang lebih dulu selesai menang:
 *   - requestAnimationFrame memberi waktu yang pas dengan gambar di layar,
 *   - setTimeout tetap jalan walaupun tab sedang tidak terlihat.
 * ========================================================================== */

export function tunggu(ms: number): Promise<void> {
  return new Promise((selesai) => {
    if (typeof window === "undefined") {
      setTimeout(selesai, ms);
      return;
    }

    let sudah = false;
    let idRaf = 0;
    let idTimeout: ReturnType<typeof setTimeout>;

    const rampung = () => {
      if (sudah) return;
      sudah = true;
      clearTimeout(idTimeout);
      cancelAnimationFrame(idRaf);
      selesai();
    };

    /* Jaring pengaman: tetap berdetak walaupun tab disembunyikan. */
    idTimeout = setTimeout(rampung, ms);

    /* Jalur utama: mengikuti gambar di layar selama tab terlihat. */
    const mulai = performance.now();
    const langkah = (sekarang: number) => {
      if (sekarang - mulai >= ms) rampung();
      else idRaf = requestAnimationFrame(langkah);
    };
    idRaf = requestAnimationFrame(langkah);
  });
}

/** Menunggu satu gambar berikutnya, dengan jaring pengaman yang sama. */
export function tungguSatuFrame(): Promise<void> {
  return tunggu(16);
}
