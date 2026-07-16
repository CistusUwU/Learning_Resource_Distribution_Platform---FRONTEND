'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@app-types/studio.type'

export function QuizTool({ questions }: { questions: QuizQuestion[] }) {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    if (questions.length === 0) {
        return <p className="text-sm text-slate-500 text-center py-8">Không có câu hỏi nào.</p>
    }

    const score = submitted ? questions.filter((q) => answers[q.id] === q.answer).length : null

    const handleSubmit = () => {
        setSubmitted(true)
    }

    return (
        <div className="space-y-3">
            {questions.map((q, idx) => {
                const chosen = answers[q.id]
                return (
                    <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {idx + 1}. {q.question}
                        </p>
                        <div className="mt-2 space-y-1.5">
                            {q.options?.map((op) => {
                                const letter = op.slice(0, 1)
                                const isChosen = chosen === letter
                                const showCorrect = submitted && letter === q.answer
                                const showWrong = submitted && isChosen && letter !== q.answer
                                return (
                                    <label
                                        key={op}
                                        className={`flex items-start gap-2 text-xs rounded-lg px-2 py-1.5 ${
                                            showCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                            showWrong ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                            'text-slate-600 dark:text-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`quiz-${q.id}`}
                                            checked={isChosen}
                                            disabled={submitted}
                                            onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: letter }))}
                                        />
                                        <span>{op}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

            {!submitted ? (
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5"
                >
                    Nộp bài
                </button>
            ) : (
                <p className="text-sm text-center font-semibold text-emerald-600 dark:text-emerald-400">
                    Điểm: {score} / {questions.length}
                </p>
            )}
        </div>
    )
}