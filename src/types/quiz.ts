export type QuizLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type LanguageOption =
  | 'JavaScript'
  | 'React'
  | 'PHP'
  | 'C#'
  | 'C++'
  | 'Laravel'
  | 'SQL'
  | 'Python'
  | 'Java'
  | 'Kotlin'
  | 'Ruby'
  | 'Swift'
  | 'Go'
  | 'TypeScript'
  | 'Dart'
  | 'Flutter'
  | 'React Native'
  | 'Next.js'
  | 'Node.js'
  | 'Express'
  | 'MongoDB'
  | 'PostgreSQL'
  | 'MySQL'
  | 'AWS'
  | 'Azure'
  | 'Vue.js'
  | 'Angular'
  | 'Tailwind CSS'
  | 'Bootstrap'

export interface QuizChoice {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  question: string
  choices: QuizChoice[]
  correctChoiceId: string
  explanation: string
}

export interface GeneratedQuiz {
  questions: QuizQuestion[]
}

export interface ImprovementPlanInput {
  level: QuizLevel
  language: LanguageOption
  scorePercent: number
  weakAreas?: string[]
}

export interface ImprovementPlan {
  summary: string
  steps: string[]
  resources: { title: string; url: string }[]
}


