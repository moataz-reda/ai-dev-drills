import type { LanguageOption, QuizLevel } from '../types/quiz'

interface Props {
  level: QuizLevel | ''
  setLevel: (l: QuizLevel) => void
  language: LanguageOption | ''
  setLanguage: (l: LanguageOption) => void
  languages: LanguageOption[]
  error: string | null
  loading: boolean
  onStart: () => void
}

export default function Selection({
  level,
  setLevel,
  language,
  setLanguage,
  languages,
  error,
  loading,
  onStart,
}: Props) {
  return (
    <div className="card max-w-3xl mx-auto mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['Beginner', 'Intermediate', 'Advanced'] as QuizLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`px-4 py-3 rounded-md border transition ${
              level === lvl ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="mt-4 text-left relative">
        <label className="text-sm text-gray-300">Language</label>
        <div className="relative mt-1">
          <select
            className="appearance-none w-full rounded-md bg-zinc-800 border border-white/10 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageOption)}
          >
            <option value="">Select…</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

      <div className="mt-4">
        <button
          onClick={onStart}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Generating quiz…' : 'Start Quiz'}
        </button>
      </div>
    </div>
  )
}


