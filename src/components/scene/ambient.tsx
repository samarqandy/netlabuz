/* =========================================================================
 * Ambient — sayt orqasidagi muhit fon.
 *
 * Avval bu yerda to'liq ekranli WebGL shader (raw GLSL, 450 qator) ishlagan.
 * O'lchov: u hero'da kadr tezligini ~12 FPS ga tushirardi va yangi topologiya
 * bilan vizual raqobatlashardi.
 *
 * ⚠️ Almashtirishda ikkinchi tuzoqqa tushdik va uni ham o'lchab topdik:
 * `blur-[150px]` qo'yilgan katta `fixed` doiralar — animatsiyasiz ham —
 * sahifani 21 FPS dan 7 FPS ga tushirardi. Blur filtri har kadrda qayta
 * hisoblanadi. Shuning uchun bu yerda blur umuman yo'q: aynan shu
 * ko'rinishni `radial-gradient` beradi va u deyarli bepul.
 *
 * JavaScript ham yo'q.
 * ========================================================================= */
export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Texno-grid */}
      <div className="absolute inset-0 bg-grid-tech opacity-[0.55] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_at_50%_28%,black_12%,transparent_72%)]" />
      {/* Yumshoq yorug'lik — blur emas, gradient */}
      <div className="ambient-glow absolute inset-0" />
    </div>
  );
}
