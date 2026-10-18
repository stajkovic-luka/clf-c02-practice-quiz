import { useState } from 'react';
import { DOMAINS } from '../domains';

// --- Mali inline SVG ikonice (bez spoljnih zavisnosti) ---
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.2 7.3a1 1 0 0 1-1.427.005L3.29 9.2a1 1 0 1 1 1.42-1.408l2.078 2.096 6.5-6.59a1 1 0 0 1 1.415-.006Z"
      clipRule="evenodd"
    />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

const letter = (i) => String.fromCharCode(65 + i); // 0 -> "A"

/**
 * Ekran kviza: pitanja jedno po jedno, odgovor -> feedback + objašnjenje.
 * Na poslednjem pitanju dugme vodi na rezultate.
 */
export default function QuizScreen({ questions, onFinish, onExit }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // indeks izabrane opcije
  const [results, setResults] = useState([]); // dosadašnji rezultati (za review na kraju)

  const q = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;
  const correctSoFar = results.filter((r) => r.wasCorrect).length;
  const domain = DOMAINS[q.domain];

  /** Klik na opciju — moguć samo dok nije odgovoreno. */
  function choose(i) {
    if (answered) return;
    setSelected(i);
  }

  /** Prelazak na sledeće pitanje ili kraj kviza. */
  function next() {
    const entry = {
      id: q.id,
      domain: q.domain,
      questionText: q.text,
      userAnswer: q.options[selected],
      correctAnswer: q.options[q.correctIndex],
      explanation: q.explanation,
      reference: q.reference,
      wasCorrect: selected === q.correctIndex,
    };
    const updated = [...results, entry];

    if (isLast) {
      onFinish(updated);
    } else {
      setResults(updated);
      setIndex(index + 1);
      setSelected(null);
    }
  }

  /** Klasa opcije po stanju: neodgovoreno / tačno / pogrešno izabrano / ostalo. */
  function optionClasses(i) {
    if (!answered) {
      return 'border-neutral-800 bg-neutral-900/60 hover:border-orange-500/50 hover:bg-neutral-800/60 cursor-pointer';
    }
    if (i === q.correctIndex) return 'border-emerald-500 bg-emerald-500/10';
    if (i === selected) return 'border-red-500 bg-red-500/10';
    return 'border-neutral-800 bg-neutral-900/40 opacity-50';
  }

  function badgeClasses(i) {
    if (!answered) return 'border-neutral-700 text-neutral-400';
    if (i === q.correctIndex) return 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300';
    if (i === selected) return 'border-red-500/50 bg-red-500/20 text-red-300';
    return 'border-neutral-800 text-neutral-600';
  }

  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100;
  const correctLetter = letter(q.correctIndex);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      {/* --- Gornja traka: oblast, brojač, skor --- */}
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${domain.chip}`}>
          {domain.code} · {domain.name}
        </span>
        <span className="font-mono text-xs text-neutral-500">
          Pitanje {index + 1}/{questions.length} · Tačno: {correctSoFar}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={index + 1}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* --- Pitanje --- */}
      <h1 className="mt-8 text-lg font-medium leading-relaxed text-neutral-100 sm:text-xl">
        {q.text}
      </h1>

      {/* --- Opcije --- */}
      <div className="mt-6 space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            disabled={answered}
            className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm leading-relaxed transition-colors disabled:cursor-default sm:text-[0.95rem] ${optionClasses(i)}`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border font-mono text-xs font-bold ${badgeClasses(i)}`}
            >
              {letter(i)}
            </span>
            <span className="flex-1 text-neutral-200">{opt}</span>
            {answered && i === q.correctIndex && (
              <span className="mt-0.5 text-emerald-400">
                <CheckIcon />
              </span>
            )}
            {answered && i === selected && i !== q.correctIndex && (
              <span className="mt-0.5 text-red-400">
                <XIcon />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* --- Feedback + objašnjenje (vidljivo nakon odgovora) --- */}
      {answered && (
        <div
          className={`mt-5 rounded-xl border p-5 ${
            selected === q.correctIndex
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-red-500/40 bg-red-500/5'
          }`}
        >
          <p
            className={`font-semibold ${
              selected === q.correctIndex ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {selected === q.correctIndex
              ? 'Tačno! 🎉'
              : `Netačno — tačan odgovor je ${correctLetter}.`}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">{q.explanation}</p>
          {q.reference && (
            <a
              href={q.reference}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs text-orange-400 underline decoration-orange-400/40 underline-offset-2 hover:decoration-orange-400"
            >
              Zvanična AWS dokumentacija ↗
            </a>
          )}
        </div>
      )}

      {/* --- Navigacija --- */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
        >
          ← Prekini kviz
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!answered}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLast ? 'Vidi rezultat' : 'Sledeće pitanje →'}
        </button>
      </div>
    </main>
  );
}
