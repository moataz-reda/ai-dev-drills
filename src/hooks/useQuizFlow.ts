import { useMemo, useState } from 'react'
import { generateImprovementPlan, generateQuiz } from '../services/groq'
import type {
  GeneratedQuiz,
  ImprovementPlan,
  LanguageOption,
  QuizLevel,
} from '../types/quiz'

export type Phase = 'select' | 'quiz' | 'results'
const apiKey = import.meta.env.VITE_GROQ_API_KEY

export function useQuizFlow() {
  const [phase, setPhase] = useState<Phase>('select')
  const [level, setLevel] = useState<QuizLevel | ''>('')
  const [language, setLanguage] = useState<LanguageOption | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState<number | null>(null)
  const [plan, setPlan] = useState<ImprovementPlan | null>(null)
  const [previousQuestions, setPreviousQuestions] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('prev_questions')
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })

  const languages: LanguageOption[] = useMemo(
    () => ['JavaScript', 'React', 'PHP', 'C#', 'C++', 'Laravel', 'SQL', 'Python', 'Java', 'Kotlin',
      'Ruby', 'Swift', 'Go', 'TypeScript', 'Dart', 'Flutter', 'React Native', 'Next.js', 'Node.js', 'Express', 'MongoDB',
      'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Vue.js', 'Angular', 'Tailwind CSS', 'Bootstrap'
    ],
    []
  )

  async function startQuiz() {
    setError(null)
    if (!apiKey) return setError('Missing API key. Define VITE_GROQ_API_KEY in .env')
    if (!level || !language) return setError('Select level and language')
    setLoading(true)
    try {
      const q = await generateQuiz({ apiKey, level, language, previousQuestions })
      setQuiz(q)
      setAnswers({})
      setPhase('quiz')
      try {
        const merged = [
          ...previousQuestions,
          ...q.questions.map((qq) => qq.question.trim()),
        ].slice(-200)
        setPreviousQuestions(merged)
        localStorage.setItem('prev_questions', JSON.stringify(merged))
      } catch { }
    } catch (e: any) {
      setError(e?.message || 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  function submitAnswers() {
    if (!quiz) return
    let correct = 0
    const weakAreas: string[] = []
    for (const q of quiz.questions) {
      if (answers[q.id] === q.correctChoiceId) correct += 1
      else weakAreas.push(q.question.slice(0, 64))
    }
    const percent = Math.round((correct / quiz.questions.length) * 100)
    setScore(percent)
    setPhase('results')
    fetchPlan(percent, weakAreas)
  }

  async function fetchPlan(scorePercent: number, weakAreas: string[]) {
    if (!apiKey || !level || !language) return
    try {
      const p = await generateImprovementPlan({
        apiKey,
        input: { level, language, scorePercent, weakAreas },
      })
      setPlan(p)
    } catch (e: any) {
      setError(e?.message || 'Failed to get improvement plan')
    }
  }

  // no-op: api key comes from env only

  return {
    // state
    phase,
    level,
    language,
    loading,
    error,
    quiz,
    answers,
    score,
    plan,
    languages,
    // actions
    setLevel,
    setLanguage,
    setAnswers,
    setPhase,
    startQuiz,
    submitAnswers,
  }
}


