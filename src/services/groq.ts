import Groq from 'groq-sdk'
import type {
  GeneratedQuiz,
  ImprovementPlan,
  ImprovementPlanInput,
  LanguageOption,
  QuizLevel,
} from '../types/quiz'

function getClient(apiKey: string) {
  if (!apiKey) throw new Error('Missing Groq API key')
  return new Groq({ apiKey, dangerouslyAllowBrowser: true })
}

export async function generateQuiz(params: {
  apiKey: string
  level: QuizLevel
  language: LanguageOption
  previousQuestions?: string[]
}): Promise<GeneratedQuiz> {
  const client = getClient(params.apiKey)

  const system = `You generate multiple-choice quizzes for developers.
Output valid JSON only that matches this TypeScript type strictly:
{
  "questions": Array<{
    "id": string,
    "question": string,
    "choices": Array<{ "id": string, "text": string }>,
    "correctChoiceId": string,
    "explanation": string
  }>
}

Rules:
- Exactly 5 questions.
- Difficulty: ${params.level}.
- Topic: ${params.language}.
- Choices 4 per question, one correct.
- IDs must be short stable slugs (e.g., q1, a, b, c, d).
- No markdown, no commentary, JSON only.
- Do not reuse or closely paraphrase any questions from the provided previous list.`

  const previousList = (params.previousQuestions || [])
    .filter(Boolean)
    .slice(-100)
    .map((q, i) => `${i + 1}. ${q}`)
    .join('\n')

  const user = `Create a 5-question multiple-choice quiz.
Avoid these previous questions entirely (do not repeat or lightly rephrase):\n${previousList || 'None provided'}`

  const res = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const content = res.choices?.[0]?.message?.content || '{}'
  let parsed: GeneratedQuiz
  try {
    parsed = JSON.parse(content) as GeneratedQuiz
  } catch (e) {
    throw new Error('Failed to parse quiz JSON')
  }

  if (!parsed.questions || parsed.questions.length !== 5) {
    throw new Error('Quiz must contain exactly 5 questions')
  }
  return parsed
}

export async function generateImprovementPlan(params: {
  apiKey: string
  input: ImprovementPlanInput
}): Promise<ImprovementPlan> {
  const client = getClient(params.apiKey)
  const { level, language, scorePercent, weakAreas } = params.input

  const system = `You are a precise career coach for software developers. Respond in JSON only matching:
{
  "summary": string,
  "steps": string[],
  "resources": Array<{ "title": string, "url": string }>
}`

  const user = `Learner details:
- Level: ${level}
- Language: ${language}
- Score: ${scorePercent}%
- Weak areas: ${weakAreas?.join(', ') || 'not specified'}

Provide a concise plan: 5-8 actionable steps and 6-10 reputable resources (docs, courses, books). Prefer free official docs.`

  const res = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.5,
    response_format: { type: 'json_object' },
  })

  const content = res.choices?.[0]?.message?.content || '{}'
  try {
    return JSON.parse(content) as ImprovementPlan
  } catch (e) {
    throw new Error('Failed to parse improvement plan JSON')
  }
}


