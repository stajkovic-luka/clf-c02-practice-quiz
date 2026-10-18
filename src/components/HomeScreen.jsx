import { DOMAINS, DOMAIN_IDS } from '../domains';
import { SIMULATION_QUOTAS } from '../utils/quiz';

/** Početni ekran nudi odvojene ulaze u učenje i ispitnu simulaciju. */
export default function HomeScreen({ questions, onStart }) {
  const total = questions.length;
  const canSimulate = DOMAIN_IDS.every((id) =>
    questions.filter((q) => q.Domain === id).length >= SIMULATION_QUOTAS[id]
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:pt-16">
      <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
        AWS Certified Cloud Practitioner
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-50 sm:text-5xl">
        CLF-C02 Quiz
      </h1>
      <p className="mt-3 text-neutral-400">
        Pitanja na engleskom, objašnjenja na srpskom i zvanični AWS izvori. Izaberi način rada.
      </p>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-neutral-400">
        <span>{total} pitanja u bazi</span>
        <span>4 oblasti</span>
        <span>65 pitanja / 90 min u simulaciji</span>
      </div>

      <section aria-labelledby="practice-heading" className="mt-8 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-neutral-900 to-neutral-900 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="practice-heading" className="text-xl font-semibold text-neutral-50">Practice Mode</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-300">
              Uči svojim tempom: potvrdi odgovor i odmah vidi objašnjenje, ili izaberi Show Answer.
              Štoperica beleži trajanje sesije.
            </p>
          </div>
          <button type="button" onClick={() => onStart('practice', 'all')} disabled={total === 0}
            className="shrink-0 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40">
            Cela baza →
          </button>
        </div>
        <h3 className="mt-7 text-sm font-semibold text-neutral-200">Ili izaberi domen</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {DOMAIN_IDS.map((id) => {
            const domain = DOMAINS[id];
            const count = questions.filter((q) => q.Domain === id).length;
            return (
              <button key={id} type="button" onClick={() => onStart('practice', id)} disabled={count === 0}
                className={`rounded-xl border border-neutral-700 bg-neutral-900/70 p-4 text-left transition-colors disabled:opacity-40 ${domain.accentBorder}`}>
                <span className={`rounded border px-2 py-0.5 font-mono text-xs ${domain.chip}`}>{domain.code}</span>
                <span className="ml-2 text-sm font-medium text-neutral-100">{domain.name}</span>
                <span className="mt-2 block text-xs text-neutral-400">{count} pitanja</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="simulation-heading" className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="simulation-heading" className="text-xl font-semibold text-neutral-50">Simulation Mode</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-300">
              Nasumičnih 65 pitanja, 90 minuta. Preskači pitanja i označi ih za pregled.
              Odgovori i objašnjenja vide se tek nakon predaje ili isteka vremena.
            </p>
          </div>
          <button type="button" onClick={() => onStart('simulation')} disabled={!canSimulate}
            className="shrink-0 rounded-xl bg-sky-400 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40">
            Start Exam →
          </button>
        </div>
        <p className="mt-5 text-xs text-neutral-400">
          Raspodela: D1 16 · D2 19 · D3 22 · D4 8. Najbliži celi brojevi AWS težinama 24% / 30% / 34% / 12%.
        </p>
        {!canSimulate && <p className="mt-2 text-sm text-amber-300">Baza nema dovoljno pitanja u svakom domenu za simulaciju.</p>}
      </section>

      <footer className="mt-12 border-t border-neutral-800/60 pt-5 text-xs leading-relaxed text-neutral-400">
        Oblasti i težine: <a href="https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html"
          target="_blank" rel="noreferrer" className="text-orange-400 underline underline-offset-2">AWS CLF-C02 exam guide</a>.
        Dodatna praksa: <a href="https://skillbuilder.aws/" target="_blank" rel="noreferrer"
          className="text-orange-400 underline underline-offset-2">AWS Skill Builder</a>.
      </footer>
    </main>
  );
}
