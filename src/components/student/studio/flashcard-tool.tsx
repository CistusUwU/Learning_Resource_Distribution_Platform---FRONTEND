'use client'

import { useState } from 'react'
import type { Flashcard } from '@app-types/studio.type'

export function FlashcardTool({ cards }: { cards: Flashcard[] }) {
    const [index, setIndex] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)

    if (cards.length === 0) {
        return <p className="text-sm text-slate-500 text-center py-8">Không có thẻ ghi nhớ nào.</p>
    }

    const current = cards[index]

    return (
        <div className="flex flex-col gap-4">
            <div
                onClick={() => setShowAnswer((v) => !v)}
                className="min-h-[160px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-center justify-center text-center cursor-pointer"
            >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {showAnswer ? current.back : current.front}
                </p>
            </div>
            <p className="text-xs text-center text-slate-400">
                {showAnswer ? 'Đáp án — bấm để xem lại câu hỏi' : 'Bấm vào thẻ để xem đáp án'}
            </p>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => { setIndex((i) => i - 1); setShowAnswer(false) }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-semibold disabled:opacity-40"
                >
                    ← Trước
                </button>
                <span className="text-xs font-semibold text-slate-500">{index + 1} / {cards.length}</span>
                <button
                    type="button"
                    disabled={index === cards.length - 1}
                    onClick={() => { setIndex((i) => i + 1); setShowAnswer(false) }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-semibold disabled:opacity-40"
                >
                    Sau →
                </button>
            </div>
        </div>
    )
}