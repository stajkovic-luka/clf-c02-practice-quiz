import { DOMAINS, DOMAIN_IDS } from '../domains';

/**
 * Početna strana: izbor moda kviza — kompletan (sva pitanja, izmešano)
 * ili vežbanje po jednoj CLF-C02 oblasti.
 */
export default function HomeScreen({ questions, onStart }) {
  const total = questions.length;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:pt-16">
      {/* --- Zaglavlje --- */}
      <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
        AWS Certified Cloud Practitioner
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-50 sm:text-5xl">
        CLF-C02 Quiz
      </h1>
      <p className="mt-3 text-neutral-400">
        Pitanja na engleskom — kao na pravom ispitu. Objašnjenja na srpskom, uz link
        do zvanične AWS dokumentacije kod svakog odgovora.
      </p>

      {/* Info traka */}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-neutral-500">
        <span>{total} pitanja</span>
        <span aria-hidden="true">·</span>
        <span>4 oblasti</span>
        <span aria-hidden="true">·</span>
        <span>pravi ispit: 65 pitanja / 90 min / 100 USD</span>
      </div>

      {/* --- Glavni CTA: kompletan kviz --- */}
      <section
        aria-label="Kompletan kviz"
        className="mt-8 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-neutral-900 to-neutral-900 p-6 sm:p-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-50">Kompletan kviz</h2>
            <p className="mt-1 max-w-md text-sm text-neutral-400">
              Svih {total} pitanja iz sve četiri oblasti, nasumičan redosled pitanja i opcija —
              simulacija punog ispita.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStart('all')}
            disabled={total === 0}
            className="shrink-0 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Pokreni kviz →
          </button>
        </div>
      </section>

      {/* --- Vežbanje po oblastima --- */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        Ili vežbaj po oblastima
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DOMAIN_IDS.map((id) => {
          const d = DOMAINS[id];
          const count = questions.filter((q) => q.Domain === id).length;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onStart(id)}
              disabled={count === 0}
              className={`rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${d.accentBorder}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${d.chip}`}
                >
                  {d.code}
                </span>
                <span className="font-mono text-xs text-neutral-500">{d.weight} ispita</span>
              </div>
              <h3 className="mt-3 font-semibold text-neutral-100">{d.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">{d.description}</p>
              <p className="mt-3 font-mono text-xs text-neutral-500">{count} pitanja</p>
            </button>
          );
        })}
      </div>

      {/* --- Podnožje --- */}
      <footer className="mt-12 border-t border-neutral-800/60 pt-5 text-xs leading-relaxed text-neutral-500">
        Sadržaj je usklađen sa zvaničnim{' '}
        <a
          href="https://aws.amazon.com/certification/certified-cloud-practitioner/"
          target="_blank"
          rel="noreferrer"
          className="text-orange-400 underline decoration-orange-400/40 underline-offset-2 hover:decoration-orange-400"
        >
          CLF-C02 exam guide-om
        </a>
        . Besplatna dodatna praksa:{' '}
        <a
          href="https://skillbuilder.aws/"
          target="_blank"
          rel="noreferrer"
          className="text-orange-400 underline decoration-orange-400/40 underline-offset-2 hover:decoration-orange-400"
        >
          AWS Skill Builder
        </a>
        .
      </footer>
    </main>
  );
}
