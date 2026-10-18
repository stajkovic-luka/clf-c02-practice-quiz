import { useEffect, useRef, useState } from 'react';
import { DOMAINS } from '../domains';
import { buildResults, secondsSince } from '../utils/quiz';

const letter = (index) => String.fromCharCode(65 + index);
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

/** Učenje: svako pitanje se potvrđuje ili otkriva pre prelaska dalje. */
export default function PracticeScreen({ questions, onFinish, onExit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [resolved, setResolved] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());
  const finished = useRef(false);
  const q = questions[index];
  const selected = answers[q.id] ?? [];
  const status = resolved[q.id];
  const required = q.correctIndices.length;
  const completeCount = Object.keys(resolved).length;
  const isCorrect = selected.length === required && selected.every((choice) => q.correctIndices.includes(choice));

  useEffect(() => {
    const update = () => setElapsed(secondsSince(startedAt.current));
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  function choose(option) {
    if (status) return;
    setAnswers((current) => {
      const previous = current[q.id] ?? [];
      const next = required === 1
        ? [option]
        : previous.includes(option)
          ? previous.filter((choice) => choice !== option)
          : previous.length < required ? [...previous, option] : previous;
      return { ...current, [q.id]: next };
    });
  }

  function finish(nextResolved = resolved) {
    if (finished.current) return;
    finished.current = true;
    const revealedIds = Object.entries(nextResolved).filter(([, value]) => value === 'shown').map(([id]) => Number(id));
    onFinish({
      results: buildResults(questions, answers, [], revealedIds),
      elapsedSeconds: secondsSince(startedAt.current),
      timedOut: false,
    });
  }

  function advance() {
    if (!status) return;
    if (index === questions.length - 1) finish();
    else setIndex(index + 1);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${DOMAINS[q.domain].chip}`}>
          Practice · {DOMAINS[q.domain].code}
        </span>
        <span className="font-mono text-sm text-neutral-300" role="timer" aria-label="Trajanje vežbe">{formatTime(elapsed)}</span>
      </div>
      <p className="mt-3 text-sm text-neutral-300">Pitanje {index + 1}/{questions.length} · Obrađeno {completeCount}/{questions.length}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800" role="progressbar" aria-label="Obrađena pitanja"
        aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={completeCount}>
        <div className="h-full bg-orange-500 transition-all" style={{ width: `${completeCount / questions.length * 100}%` }} />
      </div>

      <fieldset className="mt-7" disabled={Boolean(status)}>
        <legend className="text-lg font-medium leading-relaxed text-neutral-100 sm:text-xl">{q.text}</legend>
        <p className="mt-2 text-sm text-orange-300" id="practice-answer-hint">
          {required === 1 ? 'Izaberi jedan odgovor.' : `Izaberi ${required} odgovora.`}
        </p>
        <div className="mt-5 space-y-3" aria-describedby="practice-answer-hint">
          {q.options.map((option, choice) => {
            const checked = selected.includes(choice);
            const limitReached = required > 1 && selected.length >= required && !checked;
            const correct = status && q.correctIndices.includes(choice);
            return (
              <label key={choice} className={`flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed ${correct ? 'border-emerald-500/70 bg-emerald-500/10' : checked && status ? 'border-red-500/70 bg-red-500/10' : checked ? 'border-orange-400 bg-orange-500/10' : 'border-neutral-700 bg-neutral-900/60'} ${status || limitReached ? '' : 'cursor-pointer hover:border-orange-500/60'}`}>
                <input type={required === 1 ? 'radio' : 'checkbox'} name={`practice-${q.id}`} checked={checked}
                  disabled={Boolean(status) || limitReached} onChange={() => choose(choice)}
                  className="mt-1 h-4 w-4 shrink-0 accent-orange-500" />
                <span className="font-mono text-neutral-400" aria-hidden="true">{letter(choice)}.</span>
                <span className="text-neutral-100">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {!status && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setResolved((current) => ({ ...current, [q.id]: 'submitted' }))}
            disabled={selected.length !== required}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-neutral-950 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40">
            Potvrdi odgovor
          </button>
          <button type="button" onClick={() => setResolved((current) => ({ ...current, [q.id]: 'shown' }))}
            className="rounded-xl border border-neutral-600 px-5 py-3 font-medium text-neutral-100 hover:border-neutral-400">
            Show Answer
          </button>
        </div>
      )}

      {status && (
        <section aria-live="polite" className={`mt-6 rounded-xl border p-5 ${status === 'shown' ? 'border-sky-500/40 bg-sky-500/5' : isCorrect ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <h2 className="font-semibold text-neutral-100">
            {status === 'shown' ? 'Prikazan odgovor' : isCorrect ? 'Tačno!' : 'Netačno.'}
          </h2>
          <p className="mt-2 text-sm text-emerald-300">
            <span className="font-semibold">Tačan odgovor:</span> {q.correctIndices.map((choice) => q.options[choice]).join(' · ')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">{q.explanation}</p>
          {q.reference && <a href={q.reference} target="_blank" rel="noreferrer"
            className="mt-3 inline-block text-xs text-orange-400 underline underline-offset-2">Zvanična AWS dokumentacija ↗</a>}
        </section>
      )}

      <nav aria-label="Navigacija kroz vežbu" className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => { if (window.confirm('Prekinuti ovu vežbu? Napredak se neće sačuvati.')) onExit(); }}
          className="text-sm text-neutral-300 hover:text-white">← Prekini</button>
        <div className="flex gap-2">
          <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}
            className="rounded-lg border border-neutral-600 px-4 py-2 text-sm disabled:opacity-40">Prethodno</button>
          <button type="button" disabled={!status} onClick={advance}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40">
            {index === questions.length - 1 ? 'Završi Practice' : 'Sledeće'}
          </button>
        </div>
      </nav>
    </main>
  );
}
