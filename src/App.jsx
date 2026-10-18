import { useState } from 'react';
import rawQuestions from './data/questions.json';
import { validateQuestions, prepareQuestion, shuffle, createSimulationQuestions } from './utils/quiz';
import HomeScreen from './components/HomeScreen';
import PracticeScreen from './components/PracticeScreen';
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
  const [session, setSession] = useState({ type: 'practice', domain: 'all' });
  const [quizData, setQuizData] = useState([]); // pripremljena (izmešana) pitanja
  const [report, setReport] = useState(null);
  const [quizKey, setQuizKey] = useState(0); // forsira remount QuizScreen pri restartu

  // Lebdeća beleška — tekst živi samo u memoriji (React state), bez ikakvog storage-a.
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  /** Svaki start priprema nov, potpuno odvojen pokušaj. */
  function startQuiz(type, domain = 'all') {
    const questions = type === 'simulation'
      ? createSimulationQuestions(allQuestions)
      : shuffle(domain === 'all' ? allQuestions : allQuestions.filter((q) => q.Domain === domain)).map((q) => prepareQuestion(q));
    setQuizData(questions);
    setSession({ type, domain });
    setReport(null);
    setQuizKey((k) => k + 1);
    setScreen('quiz');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      {screen === 'home' && (
        <HomeScreen questions={allQuestions} onStart={startQuiz} />
      )}

      {screen === 'quiz' && session.type === 'practice' && (
        <PracticeScreen
          key={quizKey}
          questions={quizData}
          onFinish={(result) => {
            setReport(result);
            setScreen('results');
          }}
          onExit={() => setScreen('home')}
        />
      )}

      {screen === 'quiz' && session.type === 'simulation' && (
        <QuizScreen
          key={quizKey}
          questions={quizData}
          onFinish={(result) => {
            setReport(result);
            setScreen('results');
          }}
          onExit={() => setScreen('home')}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          report={report}
          session={session}
          onRestart={() => startQuiz(session.type, session.domain)}
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
