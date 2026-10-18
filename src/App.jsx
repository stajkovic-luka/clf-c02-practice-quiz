import { useState } from 'react';
import rawQuestions from './data/questions.json';
import { validateQuestions, prepareQuestion, shuffle } from './utils/quiz';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import StickyNote from './components/StickyNote';

// Pitanja se validiraju jednom pri pokretanju — nevalidna se preskaču
// uz upozorenje u konzoli (vidi utils/quiz.js).
const allQuestions = validateQuestions(rawQuestions);

/**
 * Korena komponenta — jednostavni state machine sa tri ekrana:
 * 'home' -> 'quiz' -> 'results'.
 */
export default function App() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState('all'); // 'all' | 1..4
  const [quizData, setQuizData] = useState([]); // pripremljena (izmešana) pitanja
  const [results, setResults] = useState([]);
  const [quizKey, setQuizKey] = useState(0); // forsira remount QuizScreen pri restartu

  // Lebdeća beleška — tekst živi samo u memoriji (React state), bez ikakvog storage-a.
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  /** Pokreće kviz: filtrira po modu, meša pitanja i opcije. */
  function startQuiz(nextMode) {
    const pool =
      nextMode === 'all' ? allQuestions : allQuestions.filter((q) => q.Domain === nextMode);
    setQuizData(shuffle(pool).map(prepareQuestion));
    setMode(nextMode);
    setResults([]);
    setQuizKey((k) => k + 1);
    setScreen('quiz');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      {screen === 'home' && (
        <HomeScreen questions={allQuestions} onStart={startQuiz} />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          key={quizKey}
          questions={quizData}
          onFinish={(finalResults) => {
            setResults(finalResults);
            setScreen('results');
          }}
          onExit={() => setScreen('home')}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          results={results}
          mode={mode}
          onRestart={() => startQuiz(mode)}
          onHome={() => setScreen('home')}
        />
      )}

      {/* Lebdeća beleška — dostupna na svim ekranima (dugme dole-desno) */}
      <StickyNote
        open={noteOpen}
        onOpen={() => setNoteOpen(true)}
        onClose={() => setNoteOpen(false)}
        text={noteText}
        onChange={setNoteText}
      />
    </div>
  );
}
