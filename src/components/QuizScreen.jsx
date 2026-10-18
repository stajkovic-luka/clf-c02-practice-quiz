import { useEffect, useRef, useState } from 'react';
import { DOMAINS } from '../domains';
import { buildResults, calculateSimulationScore, secondsSince, secondsUntil, SIMULATION_SECONDS } from '../utils/quiz';

const letter = (index) => String.fromCharCode(65 + index);
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

/** Simulation Mode: slobodna navigacija, bez otkrivanja odgovora do predaje. */
export default function QuizScreen({ questions, onFinish, onExit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [remaining, setRemaining] = useState(SIMULATION_SECONDS);
  const startedAt = useRef(Date.now());
  const deadline = useRef(startedAt.current + SIMULATION_SECONDS * 1000);
  const submitted = useRef(false);
  const submitRef = useRef(null);
  const q = questions[index];
  const selected = answers[q.id] ?? [];
  const required = q.correctIndices.length;
  const answeredCount = questions.filter((item) => (answers[item.id]?.length ?? 0) === item.correctIndices.length).length;
  const domain = DOMAINS[q.domain];

  function submitExam(timedOut = false) {
    if (submitted.current) return;
    const unanswered = questions.length - answeredCount;
    if (!timedOut && unanswered && !window.confirm(`${unanswered} pitanja nema kompletan odgovor. Predati ispit?`)) return;
    submitted.current = true;
    const results = buildResults(questions, answers, marked);
    onFinish({
      results,
      scaledScore: calculateSimulationScore(questions, results),
      elapsedSeconds: Math.min(SIMULATION_SECONDS, secondsSince(startedAt.current)),
      timedOut,
    });
  }
  submitRef.current = submitExam;

  useEffect(() => {
    const update = () => {
      const next = secondsUntil(deadline.current);
      setRemaining(next);
      if (next === 0) submitRef.current(true);
    };
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('focus', update);
    update();
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('focus', update);
    };
  }, []);

  function choose(option) {
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

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${domain.chip}`}>
          Simulation · {domain.code}
        </span>
        <span className={`font-mono text-sm ${remaining <= 300 ? 'text-red-300' : 'text-neutral-200'}`}
          role="timer" aria-label="Preostalo vreme">{formatTime(remaining)}</span>
      </div>
      <p className="mt-3 text-sm text-neutral-300">Pitanje {index + 1}/{questions.length} · Odgovoreno {answeredCount} · Za pregled {marked.length}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800" role="progressbar"
        aria-label="Odgovorena pitanja" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}>
        <div className="h-full bg-sky-400 transition-all" style={{ width: `${answeredCount / questions.length * 100}%` }} />
      </div>
      {remaining <= 300 && <p className="mt-2 text-sm text-red-300">Preostalo je manje od 5 minuta.</p>}

      <fieldset className="mt-7">
        <legend className="text-lg font-medium leading-relaxed text-neutral-100 sm:text-xl">{q.text}</legend>
        <p className="mt-2 text-sm text-sky-300" id="simulation-answer-hint">
          {required === 1 ? 'Izaberi jedan odgovor.' : `Izaberi ${required} odgovora.`}
        </p>
        <div className="mt-5 space-y-3" aria-describedby="simulation-answer-hint">
          {q.options.map((option, choice) => {
            const checked = selected.includes(choice);
            const limitReached = required > 1 && selected.length >= required && !checked;
            return (
              <label key={choice} className={`flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed transition-colors sm:text-[0.95rem] ${checked ? 'border-sky-400 bg-sky-500/10' : 'border-neutral-700 bg-neutral-900/60 hover:border-sky-500/60'} ${limitReached ? 'opacity-60' : 'cursor-pointer'}`}>
                <input type={required === 1 ? 'radio' : 'checkbox'} name={`simulation-${q.id}`}
                  checked={checked} disabled={limitReached} onChange={() => choose(choice)}
                  className="mt-1 h-4 w-4 shrink-0 accent-sky-400" />
                <span className="font-mono text-neutral-400" aria-hidden="true">{letter(choice)}.</span>
                <span className="text-neutral-100">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <button type="button" aria-pressed={marked.includes(q.id)}
        onClick={() => setMarked((current) => current.includes(q.id) ? current.filter((id) => id !== q.id) : [...current, q.id])}
        className="mt-5 rounded-lg border border-amber-500/50 px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10">
        {marked.includes(q.id) ? '★ Ukloni oznaku' : '☆ Mark for review'}
      </button>

      <nav aria-label="Navigacija kroz ispit" className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => { if (window.confirm('Prekinuti ispit? Odgovori se neće sačuvati.')) onExit(); }}
          className="text-sm text-neutral-300 hover:text-white">← Prekini</button>
        <div className="flex gap-2">
          <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}
            className="rounded-lg border border-neutral-600 px-4 py-2 text-sm disabled:opacity-40">Prethodno</button>
          <button type="button" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}
            className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-neutral-950 disabled:opacity-40">Sledeće</button>
        </div>
      </nav>

      <details className="mt-7 rounded-xl border border-neutral-700 bg-neutral-900/50 p-4">
        <summary className="cursor-pointer text-sm font-semibold">Pregled svih 65 pitanja</summary>
        <p className="mt-2 text-xs text-neutral-300">Plavo: odgovoreno · Zvezdica: označeno za pregled</p>
        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-10">
          {questions.map((item, position) => (
            <button key={item.id} type="button" onClick={() => setIndex(position)}
              aria-label={`Pitanje ${position + 1}${marked.includes(item.id) ? ', označeno' : ''}${(answers[item.id]?.length ?? 0) === item.correctIndices.length ? ', odgovoreno' : ''}`}
              aria-current={position === index ? 'step' : undefined}
              className={`min-h-10 rounded-md border text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${position === index ? 'border-white' : 'border-neutral-600'} ${(answers[item.id]?.length ?? 0) === item.correctIndices.length ? 'bg-sky-400 text-neutral-950' : 'bg-neutral-800 text-neutral-200'}`}>
              {position + 1}{marked.includes(item.id) ? '★' : ''}
            </button>
          ))}
        </div>
      </details>
      <button type="button" onClick={() => submitExam(false)}
        className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-neutral-950 hover:bg-emerald-400">
        Submit Exam
      </button>
    </main>
  );
}
