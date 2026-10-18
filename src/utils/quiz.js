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

const answerLetters = (answer) => Array.isArray(answer) ? answer : [answer];

/**
 * Priprema pitanje za prikaz: mesa redosled opcija i pamti NA KOJOM poziciji
 * se sada nalazi tacan odgovor, tako da se slojevi prikaza i podaci ne mesaju.
 */
export function prepareQuestion(q) {
  const correctOriginal = answerLetters(q.CorrectAnswer).map(letterToIndex);
  const tagged = q.Options.map((text, i) => ({ text, isCorrect: correctOriginal.includes(i) }));
  const shuffled = shuffle(tagged);
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
