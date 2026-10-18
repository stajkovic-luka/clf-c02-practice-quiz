// ---------------------------------------------------------------------------
// Utilities za logiku kviza: mesanje, priprema pitanja i odbrana od lose
// unetih podataka u questions.json.
// ---------------------------------------------------------------------------

/** Fisher–Yates mesanje — vraca NOV niz, ne mutira ulazni niz. */
export function shuffle(input, random = Math.random) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Slovo (A, B, C, D...) -> indeks opcije (0, 1, 2, 3...). */
const letterToIndex = (letter) =>
  typeof letter === 'string' ? letter.trim().toUpperCase().charCodeAt(0) - 65 : -1;

const answerLetters = (answer) => Array.isArray(answer) ? answer : [answer];

/**
 * Priprema pitanje za prikaz: mesa redosled opcija i pamti NA KOJOM poziciji
 * se sada nalazi tacan odgovor, tako da se slojevi prikaza i podaci ne mesaju.
 */
export function prepareQuestion(q, random = Math.random) {
  const correctOriginal = answerLetters(q.CorrectAnswer).map(letterToIndex);
  const tagged = q.Options.map((text, i) => ({ text, isCorrect: correctOriginal.includes(i) }));
  const shuffled = shuffle(tagged, random);
  return {
    id: q.ID,
    domain: q.Domain,
    text: q.QuestionText,
    options: shuffled.map((o) => o.text),
    correctIndices: shuffled.flatMap((o, i) => o.isCorrect ? [i] : []),
    explanation: q.Explanation,
    reference: q.Reference ?? null,
  };
}

// Najbliža celobrojna raspodela AWS težina 24/30/34/12 za 65 pitanja.
export const SIMULATION_QUOTAS = Object.freeze({ 1: 16, 2: 19, 3: 22, 4: 8 });
export const SIMULATION_SECONDS = 90 * 60;
export const SIMULATION_SCORED_COUNT = 50;
export const SIMULATION_PASS_SCORE = 700;

export const secondsUntil = (deadline, now = Date.now()) => Math.max(0, Math.ceil((deadline - now) / 1000));
export const secondsSince = (start, now = Date.now()) => Math.max(0, Math.floor((now - start) / 1000));

/** Uzorak bez ponavljanja, sa tačnim brojem pitanja po domenu. */
export function createSimulationQuestions(questions, random = Math.random) {
  const selected = Object.entries(SIMULATION_QUOTAS).flatMap(([domain, count]) => {
    const pool = questions.filter((q) => q.Domain === Number(domain));
    if (pool.length < count) {
      throw new Error(`Nema dovoljno pitanja za domen ${domain}: ${pool.length}/${count}`);
    }
    return shuffle(pool, random).slice(0, count);
  });
  const prepared = shuffle(selected, random).map((q) => prepareQuestion(q, random));
  const unscoredPositions = new Set(
    shuffle(prepared.map((_, index) => index), random).slice(0, prepared.length - SIMULATION_SCORED_COUNT),
  );
  return prepared.map((q, index) => ({ ...q, isScored: !unscoredPositions.has(index) }));
}

/** Jedinstveno računanje rezultata za oba moda. Otkriven odgovor se ne boduje. */
export function buildResults(questions, answers, markedIds = [], revealedIds = []) {
  const marked = new Set(markedIds);
  const revealed = new Set(revealedIds);
  return questions.map((item, index) => {
    const chosen = answers[item.id] ?? [];
    const correct = item.correctIndices;
    const wasRevealed = revealed.has(item.id);
    return {
      id: item.id,
      number: index + 1,
      domain: item.domain,
      questionText: item.text,
      userAnswer: wasRevealed
        ? 'Prikazan odgovor bez potvrde'
        : chosen.length ? chosen.map((i) => item.options[i]).join(' · ') : 'Bez odgovora',
      correctAnswer: correct.map((i) => item.options[i]).join(' · '),
      explanation: item.explanation,
      reference: item.reference,
      wasCorrect: !wasRevealed && chosen.length === correct.length &&
        new Set(chosen).size === correct.length && correct.every((i) => chosen.includes(i)),
      marked: marked.has(item.id),
      revealed: wasRevealed,
    };
  });
}

/** Lokalna linearna procena; AWS ne objavljuje svoju formulu za statističko skaliranje. */
export function calculateSimulationScore(questions, results) {
  const scored = questions.filter((q) => q.isScored === true);
  if (questions.length !== 65 || scored.length !== SIMULATION_SCORED_COUNT) {
    throw new Error('Simulacija mora imati 65 pitanja, od kojih se boduje tačno 50.');
  }
  const resultById = new Map(results.map((result) => [result.id, result]));
  const correctScored = scored.filter((q) => resultById.get(q.id)?.wasCorrect === true).length;
  return Math.round(100 + (correctScored / SIMULATION_SCORED_COUNT) * 900);
}

/**
 * Odbrana od nevalidnih pitanja u questions.json: svako pitanje mora imati
 * sve obavezne delove. Nevalidna se preskacu uz upozorenje u konzoli,
 * da jedna greska u unosu ne obori celu aplikaciju.
 */
export function validateQuestions(raw) {
  const ids = new Set();
  return raw.filter((q) => {
    const answers = answerLetters(q?.CorrectAnswer).map(letterToIndex);
    const ok =
      q != null &&
      Number.isInteger(q.ID) && !ids.has(q.ID) &&
      [1, 2, 3, 4].includes(q.Domain) &&
      typeof q.QuestionText === 'string' &&
      q.QuestionText.trim().length > 0 &&
      Array.isArray(q.Options) &&
      q.Options.length >= 4 &&
      q.Options.every((o) => typeof o === 'string' && o.trim().length > 0) &&
      answers.length >= 1 &&
      answers.length < q.Options.length &&
      (answers.length === 1 ? q.Options.length === 4 : q.Options.length >= 5) &&
      new Set(answers).size === answers.length &&
      answers.every((i) => i >= 0 && i < q.Options.length) &&
      typeof q.Explanation === 'string' &&
      q.Explanation.trim().length > 0 &&
      (q.Reference == null || /^https:\/\/(aws\.amazon\.com|docs\.aws\.amazon\.com|calculator\.aws)(\/|$)/.test(q.Reference));

    if (!ok) {
      console.warn('[questions.json] Preskacem nevalidno pitanje:', q?.ID ?? q);
    }
    if (ok) ids.add(q.ID);
    return ok;
  });
}
