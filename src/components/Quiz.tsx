import type { GeneratedQuiz, LanguageOption, QuizLevel } from '../types/quiz'

interface Props {
  quiz: GeneratedQuiz
  level: QuizLevel
  language: LanguageOption
  answers: Record<string, string>
  setAnswers: (a: Record<string, string>) => void
  onSubmit: () => void
}

export default function Quiz({ quiz, level, language, answers, setAnswers, onSubmit }: Props) {
  return (
    <div className="card max-w-3xl mx-auto text-left mt-5">
      <h2 className="text-2xl font-semibold">
        {level} · {language}
      </h2>
      {quiz.questions.map((q) => (
        <div key={q.id} className="mt-4">
          <div className="font-semibold">{q.question}</div>
          <div className="mt-2 space-y-2">
            {q.choices.map((c) => (
              <label key={c.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  className="size-4"
                  name={q.id}
                  value={c.id}
                  checked={answers[q.id] === c.id}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                />
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onSubmit} className="mt-6 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500">
        Submit Answers
      </button>
    </div>
  )
}


