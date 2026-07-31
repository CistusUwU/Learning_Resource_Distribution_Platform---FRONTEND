'use client'

import { useEffect, useRef, useState } from 'react'
import { studioService } from '@services/studio.service'
import type { StudioHistoryItem, StudioHistoryDetail, StudioToolType, ChatMessage } from '@app-types/studio.type'
import { FlashcardTool } from '@components/student/studio/flashcard-tool'
import { QuizTool } from '@components/student/studio/quiz-tool'
import { MindmapTool } from '@components/student/studio/mindmap-tool'
import { ChatTool } from '@components/student/studio/chat-tool'
import { formatTime } from '@utils/date'

const TOOL_ITEMS: Array<{ id: StudioToolType; icon: string; title: string }> = [
    { id: 'flashcard', icon: '🃏', title: 'Thẻ ghi nhớ' },
    { id: 'quiz', icon: '📝', title: 'Bài kiểm tra' },
    { id: 'mindmap', icon: '🧠', title: 'Sơ đồ tư duy' },
]

interface StudioPanelProps {
    bookId: number
    collapsed: boolean
    widthPx: number
}

type ViewMode = 'list' | 'detail' | 'chat' | 'mindmap'

export function StudioPanel({ bookId, collapsed, widthPx }: StudioPanelProps) {
    const [history, setHistory] = useState<StudioHistoryItem[] | null>(null)
    const [generatingTypes, setGeneratingTypes] = useState<Set<StudioToolType>>(new Set())
    const [genError, setGenError] = useState<string | null>(null)

    const [view, setView] = useState<ViewMode>('list')
    const viewRef = useRef(view)
    useEffect(() => { viewRef.current = view }, [view])

    const [detail, setDetail] = useState<StudioHistoryDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    const [mindmapDetail, setMindmapDetail] = useState<StudioHistoryDetail | null>(null)
    const [mindmapLoading, setMindmapLoading] = useState(false)
    const [mindmapError, setMindmapError] = useState<string | null>(null)

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    const historySeqRef = useRef(0)

    const refreshHistory = async () => {
        const seq = ++historySeqRef.current
        const items = await studioService.getHistory(bookId)
        if (seq === historySeqRef.current) {
            setHistory(items)
        }
        return items
    }

    useEffect(() => {
        setHistory(null)
        setView('list')
        setChatMessages([])
        setMindmapDetail(null)
        setMindmapError(null)
        refreshHistory()
            .then((items) => {
                const hasAutoFlashcard = items.some((i) => i.type === 'flashcard' && i.isAuto)
                const hasAutoQuiz = items.some((i) => i.type === 'quiz' && i.isAuto)
                if (!hasAutoFlashcard) handleGenerate('flashcard', true)
                    if (!hasAutoQuiz) handleGenerate('quiz', true)
                    handleGenerate('mindmap', true)
            })
            .catch((err) => {
                console.error(err)
                setHistory([])
            })
    }, [bookId])

    const handleGenerate = async (type: StudioToolType, isAuto = false) => {
        setGeneratingTypes((prev) => new Set(prev).add(type))
        setGenError(null)
        try {
            const created = await studioService.generate(bookId, type, isAuto)
            await refreshHistory()
            if (!isAuto && type !== 'mindmap' && viewRef.current === 'list') {
                setDetail(created)
                setView('detail')
            }
        } catch (err) {
            console.error(err)
            if (!isAuto) {
                const label = TOOL_ITEMS.find((t) => t.id === type)?.title
                setGenError(`Không thể tạo ${label}. Vui lòng thử lại.`)
            }
        } finally {
            setGeneratingTypes((prev) => {
                const next = new Set(prev)
                next.delete(type)
                return next
            })
        }
    }

    const openHistoryItem = async (id: string) => {
        setView('detail')
        setDetailLoading(true)
        setDetail(null)
        try {
            const full = await studioService.getHistoryItem(id)
            setDetail(full)
        } catch (err) {
            console.error(err)
        } finally {
            setDetailLoading(false)
        }
    }

    const openMindmap = async () => {
        setView('mindmap')
        if (mindmapDetail) return

        setMindmapLoading(true)
        setMindmapError(null)
        try {
            const created = await studioService.generate(bookId, 'mindmap', false)
            setMindmapDetail(created)
        } catch (err) {
            console.error(err)
            setMindmapError('Không thể tạo sơ đồ tư duy. Vui lòng thử lại.')
        } finally {
            setMindmapLoading(false)
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        try {
            await studioService.deleteHistoryItem(id)
            await refreshHistory()
        } catch (err) {
            console.error(err)
        }
    }

    const panelStyle = collapsed
        ? { width: 0, minWidth: 0, opacity: 0, pointerEvents: 'none' as const }
        : { width: widthPx, minWidth: 400, maxWidth: 640, opacity: 1, pointerEvents: 'auto' as const }

    const visibleHistory = history?.filter((item) => item.type !== 'mindmap') ?? null
    const pendingItems = Array.from(generatingTypes)
        .filter((type) => type !== 'mindmap')
        .map((type) => ({
            id: `__pending__${type}`,
            type,
            title: `Đang tạo ${TOOL_ITEMS.find((t) => t.id === type)?.title}...`,
            isAuto: false,
            createdAt: Date.now(),
        }))

    const displayHistory = visibleHistory !== null ? [...pendingItems, ...visibleHistory] : visibleHistory

    return (
        <aside className="h-full shrink-0 transition-[width,opacity,min-width] duration-200 ease-out overflow-hidden" style={panelStyle}>
            <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
                <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50">
                    <h2 className="text-xs font-extrabold tracking-wide text-slate-500 dark:text-slate-400 uppercase text-center">
                        Studio
                    </h2>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-3">
                    {view === 'list' && (
                        <>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {TOOL_ITEMS.map((item) => {
                                    const isMindmap = item.id === 'mindmap'
                                    const busy = generatingTypes.has(item.id) || (isMindmap && mindmapLoading)
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            disabled={busy}
                                            onClick={() => (isMindmap ? openMindmap() : handleGenerate(item.id))}
                                            className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-3 px-1 text-center hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 transition-colors"
                                        >
                                            <span className="text-xl leading-none">{item.icon}</span>
                                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                                                {busy ? 'Đang tạo...' : item.title}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={() => setView('chat')}
                                className="w-full flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-2.5 px-3 mb-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                            >
                                <span className="text-lg">💬</span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Hỏi đáp AI</span>
                            </button>

                            {genError && <p className="text-xs text-red-600 dark:text-red-400 mb-2">{genError}</p>}

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                                {history === null ? (
                                    <div className="flex justify-center py-6">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                                    </div>
                                ) : displayHistory!.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-6">Chưa tạo công cụ nào cho sách này.</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        {displayHistory!.map((item) => {
                                            const isPending = item.id.startsWith('__pending__')
                                            const icon = TOOL_ITEMS.find((t) => t.id === item.type)?.icon || '📄'
                                            return (
                                                <div key={item.id} className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        disabled={isPending}
                                                        onClick={() => openHistoryItem(item.id)}
                                                        className={`flex-1 min-w-0 flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                                                            isPending ? 'opacity-70 cursor-default' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                                        }`}
                                                    >
                                                        <span className="text-lg shrink-0">
                                                            {isPending ? (
                                                                <span className="inline-block animate-spin">↻</span>
                                                            ) : (
                                                                icon
                                                            )}
                                                        </span>
                                                        <span className="flex-1 min-w-0">
                                                            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                                {item.title}
                                                            </span>
                                                            <span className="block text-[11px] text-slate-400">
                                                                {isPending ? 'dựa trên 1 nguồn' : `${formatTime(item.createdAt)}${item.isAuto ? ' · Tự động' : ''}`}
                                                            </span>
                                                        </span>
                                                    </button>
                                                    {!isPending && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDelete(e, item.id)}
                                                            className="shrink-0 w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                                                            title="Xóa mục này"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {view === 'detail' && (
                        <div className="h-full flex flex-col">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-3"
                            >
                                ← Quay lại
                            </button>
                            {detailLoading || !detail ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                                </div>
                            ) : (
                                <>
                                    {detail.type === 'flashcard' && 'cards' in detail.data && (
                                        <FlashcardTool key={detail.id} cards={detail.data.cards}/>
                                    )}
                                    {detail.type === 'quiz' && 'questions' in detail.data && (
                                        <QuizTool key={detail.id} questions={detail.data.questions}/>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {view === 'mindmap' && (
                        <div className="h-full flex flex-col">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-3"
                            >
                                ← Quay lại
                            </button>
                            {mindmapError ? (
                                <p className="text-sm text-red-600 dark:text-red-400 text-center py-8">{mindmapError}</p>
                            ) : mindmapLoading || !mindmapDetail ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                                </div>
                            ) : (
                                'html' in mindmapDetail.data && <MindmapTool html={mindmapDetail.data.html} />
                            )}
                        </div>
                    )}

                    {view === 'chat' && (
                        <div className="h-full flex flex-col min-h-0">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-3 shrink-0"
                            >
                                ← Quay lại
                            </button>
                            <div className="flex-1 min-h-0">
                                <ChatTool
                                    bookId={bookId}
                                    messages={chatMessages}
                                    onMessagesChange={setChatMessages}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}