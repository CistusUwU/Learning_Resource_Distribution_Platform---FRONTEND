'use client'

import { useState, useRef, useEffect } from 'react'
import { studioService } from '@services/studio.service'
import type { ChatMessage } from '@app-types/studio.type'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatToolProps {
    bookId: number
    messages: ChatMessage[]
    onMessagesChange: (messages: ChatMessage[]) => void
}

export function ChatTool({ bookId, messages, onMessagesChange }: ChatToolProps) {
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || sending) return

        const history = messages
        const withUserMsg = [...messages, { role: 'user' as const, content: text }]
        onMessagesChange(withUserMsg)
        setInput('')
        setError(null)
        setSending(true)

        try {
            const res = await studioService.chat(bookId, text, history)
            onMessagesChange([...withUserMsg, { role: 'assistant' as const, content: res.reply }])
        } catch (err) {
            console.error(err)
            setError('Không nhận được phản hồi. Vui lòng thử lại.')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pb-2">
                {messages.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-8">Đặt câu hỏi về nội dung giáo trình.</p>
                )}
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`rounded-xl px-3 py-2 text-sm max-w-[85%] ${
                            m.role === 'user'
                                ? 'ml-auto bg-blue-600 text-white'
                                : 'mr-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                        }`}
                    >
                        {m.role === 'user' ? (
                            m.content
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                    h1: ({ children }) => <h3 className="font-bold text-sm mt-2 mb-1 first:mt-0">{children}</h3>,
                                    h2: ({ children }) => <h3 className="font-bold text-sm mt-2 mb-1 first:mt-0">{children}</h3>,
                                    h3: ({ children }) => <h3 className="font-bold text-sm mt-2 mb-1 first:mt-0">{children}</h3>,
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                }}
                            >
                                {m.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}
                {sending && (
                    <div className="mr-auto rounded-xl px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-400">
                        Đang trả lời...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400 mb-1">{error}</p>}

            <div className="flex gap-2 shrink-0 pt-2 border-t border-slate-200 dark:border-slate-700">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                    placeholder="Nhập câu hỏi..."
                    disabled={sending}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm px-3 py-2"
                />
                <button
                    type="button"
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold px-4"
                >
                    Gửi
                </button>
            </div>
        </div>
    )
}