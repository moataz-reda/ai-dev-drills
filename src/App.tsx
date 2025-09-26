import './App.css'
import { useQuizFlow } from './hooks/useQuizFlow'
import Selection from './components/Selection'
import Quiz from './components/Quiz'
import Results from './components/Results'

function App() {
  const f = useQuizFlow()

  return (
    <div>
      <img src="/logo.svg" className="logo mx-auto" alt="AI Dev Drills" />
      <h1 className="text-4xl font-bold">AI Dev Drills</h1>
      <p className="mt-1 text-gray-300">Sharpen your coding skills, one drill at a time.</p>
      {f.phase === 'select' && (
        <Selection
          level={f.level}
          setLevel={(l) => f.setLevel(l)}
          language={f.language}
          setLanguage={(l) => f.setLanguage(l)}
          languages={f.languages}
          error={f.error}
          loading={f.loading}
          onStart={f.startQuiz}
        />
      )}
      {f.phase === 'quiz' && f.quiz && f.level && f.language && (
        <Quiz
          quiz={f.quiz}
          level={f.level}
          language={f.language}
          answers={f.answers}
          setAnswers={(a) => f.setAnswers(a)}
          onSubmit={f.submitAnswers}
        />
      )}
      {f.phase === 'results' && f.quiz && f.score !== null && (
        <Results
          quiz={f.quiz}
          answers={f.answers}
          score={f.score}
          plan={f.plan}
          onRestart={() => window.location.reload()}
        />
      )}
    </div>
  )
}

export default App
