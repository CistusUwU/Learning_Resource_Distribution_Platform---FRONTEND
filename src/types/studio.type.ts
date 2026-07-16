export interface Flashcard {
    id: string
    front: string
    back: string
}

export type QuizQuestionType = 'multiple_choice' | 'essay'

export interface QuizQuestion {
    id: string
    question: string
    type: QuizQuestionType
    options?: string[]
    answer: string
}

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export type StudioToolType = 'flashcard' | 'quiz' | 'mindmap'

export interface StudioHistoryItem {
    id: string
    type: StudioToolType
    title: string
    isAuto: boolean
    createdAt: number
}

export interface StudioHistoryDetail extends StudioHistoryItem {
    bookId: number
    data: { cards: Flashcard[] } | { questions: QuizQuestion[] } | { html: string }
}