import type { GeneratedQuiz, ImprovementPlan } from '../types/quiz'

interface Props {
  quiz: GeneratedQuiz
  answers: Record<string, string>
  score: number
  plan: ImprovementPlan | null
  onRestart: () => void
}

export default function Results({ quiz, answers, score, plan, onRestart }: Props) {
  return (
    <div className="card max-w-5xl mx-auto text-left mt-5">
      <h2 className="text-2xl font-semibold">Results</h2>
      <p className="mt-1">Score: {score}%</p>
      <div className="mt-3 space-y-4">
        {quiz.questions.map((q) => {
          const user = answers[q.id]
          const correct = q.correctChoiceId
          const isCorrect = user === correct
          return (
            <div key={q.id}>
              <div className="font-semibold">{q.question}</div>
              <div className="mt-2 space-y-1">
                {q.choices.map((c) => (
                  <div
                    key={c.id}
                    className={
                      c.id === correct
                        ? 'text-emerald-400 flex items-center gap-2'
                        : c.id === user
                        ? 'text-rose-400 flex items-center gap-2'
                        : ''
                    }
                  >
                    {c.id === correct && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                        aria-label="correct"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.144-.09l4.993-6.498z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {c.id !== correct && c.id === user && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                        aria-label="your answer"
                      >
                        <path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" />
                      </svg>
                    )}
                    <span>
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>
              {!isCorrect && <div className="read-the-docs">Explanation: {q.explanation}</div>}
            </div>
          )
        })}
      </div>

      <h3 className="mt-6 text-xl font-semibold">How to Improve</h3>
      {!plan && <p>Generating personalized plan…</p>}
      {plan && (
        <div className="mt-2">
          <p>{plan.summary}</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            {plan.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <h4 className="mt-4 font-semibold">Resources</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {plan.resources.map((r, i) => (
              <li key={i}>
                <a className="text-indigo-400 hover:text-indigo-300" href={r.url} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <button onClick={onRestart} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500">Take Another Quiz</button>
      </div>
    </div>
  )
}


