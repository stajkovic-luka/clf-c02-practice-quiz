// ---------------------------------------------------------------------------
// Utilities za logiku kviza: mesanje, priprema pitanja i odbrana od lose
// unetih podataka u questions.json.
// ---------------------------------------------------------------------------

/** Fisher–Yates mesanje — vraca NOV niz, ne mutira ulazni niz. */
export function shuffle(input) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Slovo (A, B, C, D...) -> indeks opcije (0, 1, 2, 3...). */
const letterToIndex = (letter) =>
  typeof letter === 'string' ? letter.trim().toUpperCase().charCodeAt(0) - 65 : -1;

/**
 * Priprema pitanje za prikaz: mesa redosled opcija i pamti NA KOJOM poziciji
 * se sada nalazi tacan odgovor, tako da se slojevi prikaza i podaci ne mesaju.
 */
export function prepareQuestion(q) {
  const correctOriginal = letterToIndex(q.CorrectAnswer);
  const tagged = q.Options.map((text, i) => ({ text, isCorrect: i === correctOriginal }));
  const shuffled = shuffle(tagged);
  return {
    id: q.ID,
    domain: q.Domain,
    text: q.QuestionText,
    options: shuffled.map((o) => o.text),
    correctIndex: shuffled.findIndex((o) => o.isCorrect),
    explanation: q.Explanation,
    reference: q.Reference ?? null,
  };
}

/**
 * Odbrana od nevalidnih pitanja u questions.json: svako pitanje mora imati
 * sve obavezne delove. Nevalidna se preskacu uz upozorenje u konzoli,
 * da jedna greska u unosu ne obori celu aplikaciju.
 */
export function validateQuestions(raw) {
  return raw.filter((q) => {
    const correctIdx = letterToIndex(q?.CorrectAnswer);
    const ok =
      q != null &&
      q.ID != null &&
      [1, 2, 3, 4].includes(q.Domain) &&
      typeof q.QuestionText === 'string' &&
      q.QuestionText.length > 0 &&
      Array.isArray(q.Options) &&
      q.Options.length >= 2 &&
      correctIdx >= 0 &&
      correctIdx < q.Options.length &&
      typeof q.Explanation === 'string' &&
      q.Explanation.length > 0;

    if (!ok) {
      console.warn('[questions.json] Preskacem nevalidno pitanje:', q?.ID ?? q);
    }
    return ok;
  });
}
