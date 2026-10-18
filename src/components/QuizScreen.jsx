import { useEffect, useState } from 'react';
import { DOMAINS } from '../domains';

const letter = (i) => String.fromCharCode(65 + i);
const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

/** Ispitni tok: odgovori i oznake ostaju dostupni za pregled do predaje. */
export default function QuizScreen({ questions, onFinish, onExit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [seconds, setSeconds] = useState({});
  const q = questions[index];
  const selected = answers[q.id] ?? [];
  const required = q.correctIndices.length;
  const answeredCount = questions.filter((item) => (answers[item.id]?.length ?? 0) === item.correctIndices.length).length;
  const domain = DOMAINS[q.domain];

  useEffect(() => {
    const id = q.id;
    const timer = window.setInterval(() => {
      setSeconds((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [q.id]);

  function choose(option) {
    setAnswers((current) => {
      const previous = current[q.id] ?? [];
      const next = required === 1
        ? [option]
        : previous.includes(option)
          ? previous.filter((i) => i !== option)
          : previous.length < required ? [...previous, option] : previous;
      return { ...current, [q.id]: next };
    });
  }

  function finish() {
    const unanswered = questions.length - answeredCount;
    if (unanswered && !window.confirm(`${unanswered} pitanja nema kompletan odgovor. Predati kviz?`)) return;
    onFinish(questions.map((item) => {
      const chosen = answers[item.id] ?? [];
      const correct = item.correctIndices;
      return {
        id: item.id,
        domain: item.domain,
        questionText: item.text,
        userAnswer: chosen.length ? chosen.map((i) => item.options[i]).join(' · ') : 'Bez odgovora',
        correctAnswer: correct.map((i) => item.options[i]).join(' · '),
        explanation: item.explanation,
        reference: item.reference,
        wasCorrect: chosen.length === correct.length && chosen.every((i) => correct.includes(i)),
        marked: marked.includes(item.id),
      };
    }));
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${domain.chip}`}>
          {domain.code} · {domain.name}
        </span>
        <span className="font-mono text-xs text-neutral-300">Pitanje {index + 1}/{questions.length} · {formatTime(seconds[q.id] ?? 0)}</span>
      </div>
      <p className="mt-3 text-sm text-neutral-300">Odgovoreno {answeredCount} od {questions.length} · Za pregled {marked.length}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800" role="progressbar"
        aria-label="Odgovorena pitanja" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}>
        <div className="h-full bg-orange-500 transition-all" style={{ width: `${answeredCount / questions.length * 100}%` }} />
      </div>

      <fieldset className="mt-7">
        <legend className="text-lg font-medium leading-relaxed text-neutral-100 sm:text-xl">{q.text}</legend>
        <p className="mt-2 text-sm text-orange-300" id="answer-hint">
          {required === 1 ? 'Izaberi jedan odgovor.' : `Izaberi ${required} odgovora.`}
        </p>
        <div className="mt-5 space-y-3" aria-describedby="answer-hint">
          {q.options.map((option, i) => {
            const checked = selected.includes(i);
            const limitReached = required > 1 && selected.length >= required && !checked;
            return (
              <label key={i} className={`flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed transition-colors sm:text-[0.95rem] ${checked ? 'border-orange-400 bg-orange-500/10' : 'border-neutral-700 bg-neutral-900/60 hover:border-orange-500/60'} ${limitReached ? 'opacity-60' : 'cursor-pointer'}`}>
                <input type={required === 1 ? 'radio' : 'checkbox'} name={`question-${q.id}`}
                  checked={checked} disabled={limitReached} onChange={() => choose(i)}
                  className="mt-1 h-4 w-4 shrink-0 accent-orange-500" />
                <span className="font-mono text-neutral-400" aria-hidden="true">{letter(i)}.</span>
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

      <nav aria-label="Navigacija kroz pitanja" className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onExit} className="text-sm text-neutral-300 hover:text-white">← Prekini</button>
        <div className="flex gap-2">
          <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}
            className="rounded-lg border border-neutral-600 px-4 py-2 text-sm disabled:opacity-40">Prethodno</button>
          <button type="button" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-neutral-950 disabled:opacity-40">Sledeće</button>
        </div>
      </nav>

      <details className="mt-7 rounded-xl border border-neutral-700 bg-neutral-900/50 p-4">
        <summary className="cursor-pointer text-sm font-semibold">Pregled svih pitanja</summary>
        <p className="mt-2 text-xs text-neutral-300">Narandžasto: odgovoreno · Zvezdica: označeno za pregled</p>
        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-10">
          {questions.map((item, i) => (
            <button key={item.id} type="button" onClick={() => setIndex(i)}
              aria-label={`Pitanje ${i + 1}${marked.includes(item.id) ? ', označeno' : ''}${(answers[item.id]?.length ?? 0) === item.correctIndices.length ? ', odgovoreno' : ''}`}
              aria-current={i === index ? 'step' : undefined}
              className={`min-h-10 rounded-md border text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${i === index ? 'border-white' : 'border-neutral-600'} ${(answers[item.id]?.length ?? 0) === item.correctIndices.length ? 'bg-orange-500 text-neutral-950' : 'bg-neutral-800 text-neutral-200'}`}>
              {i + 1}{marked.includes(item.id) ? '★' : ''}
            </button>
          ))}
        </div>
      </details>
      <button type="button" onClick={finish} className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-neutral-950 hover:bg-emerald-400">
        Predaj kviz i vidi rezultate
      </button>
    </main>
  );
}
