import { DOMAINS, DOMAIN_IDS } from '../domains';
import { SIMULATION_PASS_SCORE } from '../utils/quiz';

/** Poruka prema ostvarenom procentu. */
function scoreMessage(pct) {
  if (pct >= 90) return 'Odličan rezultat na ovoj vežbi. Pregledaj preostale greške.';
  if (pct >= 75) return 'Odličan rezultat! Prođi kroz greške ispod i ponovi kviz sutra.';
  if (pct >= 60) return 'Solidno — ali za sigurno polaganje ciljaj stabilno preko 75% kod kuće.';
  return 'Još treba rada — pročitaj objašnjenja, pa kreni od oblasti sa najnižim skorom.';
}

/**
 * Završni ekran: ukupan skor, prosek po oblastima i pregled pogrešnih
 * odgovora sa objašnjenjima, uz opcije za ponovno pokretanje.
 */
export default function ResultsScreen({ report, session, onRestart, onHome }) {
  const { results, elapsedSeconds, timedOut, scaledScore } = report;
  const total = results.length;
  const correct = results.filter((r) => r.wasCorrect).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const simulation = session.type === 'simulation';
  const passed = simulation && scaledScore >= SIMULATION_PASS_SCORE;
  const review = simulation ? results : results.filter((r) => !r.wasCorrect || r.revealed);
  const duration = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`;

  // Statistika po oblastima — samo oblasti koje su bile u ovom kvizu.
  const byDomain = DOMAIN_IDS.map((id) => {
    const rs = results.filter((r) => r.domain === id);
    return {
      id,
      total: rs.length,
      correct: rs.filter((r) => r.wasCorrect).length,
    };
  }).filter((d) => d.total > 0);

  const modeLabel = simulation
    ? 'Simulation Mode · Exam Report'
    : session.domain === 'all' ? 'Practice Mode · cela baza' : `Practice Mode · ${DOMAINS[session.domain].code} · ${DOMAINS[session.domain].name}`;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:pt-14">
      {/* --- Glavni skor --- */}
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">{modeLabel}</p>

      <section className="mt-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
        {simulation ? (
          <div>
            <p className="text-sm font-semibold text-neutral-300">Tvoj rezultat:</p>
            <p className="mt-1 text-5xl font-bold tracking-tight text-neutral-50 sm:text-6xl">
              {scaledScore} <span className="text-2xl text-neutral-400 sm:text-3xl">/ 1000</span>
            </p>
            <span className={`mt-5 inline-flex rounded-lg border px-5 py-2 text-2xl font-black tracking-widest ${passed ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300' : 'border-red-400 bg-red-500/15 text-red-300'}`}>
              {passed ? 'PASS' : 'FAIL'}
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
              <span className="text-5xl font-bold tracking-tight text-neutral-50">{pct}%</span>
              <span className="pb-1 font-mono text-sm text-neutral-400">{correct}/{total} tačnih odgovora</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </>
        )}
        <p className="mt-3 text-sm font-semibold text-neutral-100">
          {simulation ? passed ? 'Položeno u simulaciji' : 'Nije položeno u simulaciji' : 'Vežba završena'}
          {' · '}{timedOut ? 'vreme je isteklo · ' : ''}trajanje {duration}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300">
          {simulation ? `Prag prolaza: ${SIMULATION_PASS_SCORE} / 1000.` : scoreMessage(pct)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          {simulation
            ? 'Ovo je lokalna procena prema linearnoj formuli za 50 skrivenih bodovanih pitanja. AWS zvanični skor statistički izjednačava između verzija ispita, pa rezultat može biti drugačiji.'
            : 'Prikazan je procenat tačnih odgovora u vežbi.'}
        </p>
      </section>

      {/* --- Statistika po oblastima --- */}
      {(simulation || byDomain.length > 1) && (
        <section aria-label="Rezultat po oblastima" className="mt-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            {simulation ? 'Po oblastima · svih 65 pitanja' : 'Po oblastima'}
          </h2>
          {byDomain.map((d) => {
            const meta = DOMAINS[d.id];
            const dpct = Math.round((d.correct / d.total) * 100);
            return (
              <div key={d.id} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-neutral-300">
                    <span className={`mr-2 rounded border px-1.5 py-0.5 font-mono text-xs ${meta.chip}`}>
                      {meta.code}
                    </span>
                    {meta.name}
                    <span className="ml-2 font-mono text-xs text-neutral-500">{meta.weight} ispita</span>
                  </span>
                  <span className="font-mono text-xs text-neutral-500">
                    {d.correct}/{d.total} ({dpct}%)
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-800">
                  <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${dpct}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* --- Pregled odgovora --- */}
      <section aria-label="Pregled odgovora" className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          {simulation ? 'Sva pitanja i odgovori' : 'Netačna i prikazana pitanja'}
        </h2>

        {review.length === 0 ? (
          <p className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-300">
            Svi odgovori su tačni — svaka čast! 🏆
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {review.map((r) => (
              <details
                key={r.id}
                className="group rounded-xl border border-neutral-800 bg-neutral-900/40 open:border-red-500/30 open:bg-red-500/5"
              >
                <summary className="cursor-pointer list-none p-4 text-sm text-neutral-300 transition-colors hover:text-neutral-100">
                  <span className="mr-2 font-mono text-xs text-neutral-500 group-open:hidden">▸</span>
                  <span className="mr-2 hidden font-mono text-xs text-neutral-500 group-open:inline">▾</span>
                  <span className="mr-2 font-mono text-xs text-neutral-400">{r.number}.</span>
                  {r.marked ? '★ ' : ''}{r.questionText}
                  <span className={`ml-2 font-mono text-xs ${r.wasCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.wasCorrect ? 'Tačno' : r.revealed ? 'Prikazano' : 'Netačno'}
                  </span>
                </summary>
                <div className="border-t border-neutral-800/60 p-4 text-sm leading-relaxed">
                  <p className={r.wasCorrect ? 'text-emerald-400' : 'text-red-400'}>
                    <span className="font-semibold">Tvoj odgovor:</span> {r.userAnswer}
                  </p>
                  <p className="mt-1.5 text-emerald-400">
                    <span className="font-semibold">Tačan odgovor:</span> {r.correctAnswer}
                  </p>
                  <p className="mt-3 text-neutral-300">{r.explanation}</p>
                  {r.reference && (
                    <a
                      href={r.reference}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs text-orange-400 underline decoration-orange-400/40 underline-offset-2 hover:decoration-orange-400"
                    >
                      Zvanična AWS dokumentacija ↗
                    </a>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* --- Akcije --- */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-orange-400"
        >
          {simulation ? 'Nova simulacija ↻' : 'Ponovi vežbu ↻'}
        </button>
        <button
          type="button"
          onClick={onHome}
          className="rounded-xl border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
        >
          Nazad na početak
        </button>
      </div>
    </main>
  );
}
