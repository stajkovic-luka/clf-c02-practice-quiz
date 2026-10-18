import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildResults, calculateSimulationScore, createSimulationQuestions, secondsSince, secondsUntil, SIMULATION_QUOTAS, SIMULATION_SECONDS, validateQuestions } from './quiz.js';

const raw = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url), 'utf8'));
const questions = validateQuestions(raw);

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 2 ** 32;
  };
}

test('simulation draws 65 unique questions with exact integer domain quotas', () => {
  assert.equal(questions.length, 385);
  for (const seed of [1, 42, 20261018]) {
    const selected = createSimulationQuestions(questions, seededRandom(seed));
    assert.equal(selected.length, 65);
    assert.equal(new Set(selected.map((q) => q.id)).size, 65);
    assert.equal(selected.filter((q) => q.isScored === true).length, 50);
    assert.equal(selected.filter((q) => q.isScored === false).length, 15);
    for (const [domain, count] of Object.entries(SIMULATION_QUOTAS)) {
      assert.equal(selected.filter((q) => q.domain === Number(domain)).length, count);
    }
    for (const q of selected) {
      assert.ok(q.correctIndices.length >= 1);
      assert.equal(new Set(q.correctIndices).size, q.correctIndices.length);
      assert.ok(q.correctIndices.every((index) => index >= 0 && index < q.options.length));
    }
  }
  const first = createSimulationQuestions(questions, seededRandom(1));
  const second = createSimulationQuestions(questions, seededRandom(42));
  assert.notDeepEqual(first.filter((q) => !q.isScored).map((q) => q.id), second.filter((q) => !q.isScored).map((q) => q.id));
});

test('simulation refuses an incomplete domain pool', () => {
  assert.throws(() => createSimulationQuestions(questions.filter((q) => q.Domain !== 4)), /domen 4/);
});

test('revealed and incomplete answers never earn credit', () => {
  const sample = [
    { id: 1, domain: 1, text: 'Single', options: ['A', 'B', 'C', 'D'], correctIndices: [1], explanation: 'Rule', reference: null },
    { id: 2, domain: 2, text: 'Choose 2', options: ['A', 'B', 'C', 'D', 'E'], correctIndices: [0, 2], explanation: 'Rule', reference: null },
  ];
  const correct = buildResults(sample, { 1: [1], 2: [0, 2] });
  assert.deepEqual(correct.map((r) => r.wasCorrect), [true, true]);
  const revealed = buildResults(sample, { 1: [1], 2: [0] }, [], [1]);
  assert.deepEqual(revealed.map((r) => r.wasCorrect), [false, false]);
  assert.equal(revealed[0].userAnswer, 'Prikazan odgovor bez potvrde');
  assert.equal(revealed[1].correctAnswer, 'A · C');
  assert.equal(buildResults(sample, { 2: [0, 1] })[1].wasCorrect, false);
  assert.equal(buildResults(sample, { 2: [0, 0] })[1].wasCorrect, false);
});

test('simulation uses only 50 scored items and rounds the requested linear estimate', () => {
  const selected = createSimulationQuestions(questions, seededRandom(17));
  const scored = selected.filter((q) => q.isScored);
  const unscored = selected.filter((q) => !q.isScored);
  const allCorrect = Object.fromEntries(selected.map((q) => [q.id, q.correctIndices]));
  assert.equal(calculateSimulationScore(selected, buildResults(selected, {})), 100);
  assert.equal(calculateSimulationScore(selected, buildResults(selected, allCorrect)), 1000);
  const onlyUnscoredCorrect = Object.fromEntries(unscored.map((q) => [q.id, q.correctIndices]));
  assert.equal(calculateSimulationScore(selected, buildResults(selected, onlyUnscoredCorrect)), 100);
  for (const [correctCount, expected] of [[33, 694], [34, 712]]) {
    const answers = Object.fromEntries(scored.slice(0, correctCount).map((q) => [q.id, q.correctIndices]));
    assert.equal(calculateSimulationScore(selected, buildResults(selected, answers)), expected);
  }
});

test('deadline calculations use wall time and stop at zero', () => {
  const start = 10_000;
  const deadline = start + SIMULATION_SECONDS * 1000;
  assert.equal(secondsUntil(deadline, start), 5400);
  assert.equal(secondsUntil(deadline, start + 1001), 5399);
  assert.equal(secondsUntil(deadline, deadline), 0);
  assert.equal(secondsUntil(deadline, deadline + 60_000), 0);
  assert.equal(secondsSince(start, start + 2500), 2);
});
