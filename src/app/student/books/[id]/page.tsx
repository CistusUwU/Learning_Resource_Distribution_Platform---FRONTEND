'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { bookService } from '@services/book.service'
import { libraryService } from '@services/library.service'
import { StudioPanel } from '@components/student/studio-panel'
import { HeaderUserActions } from '@components/header-user-actions'
import { useAuth } from '@providers/auth-provider'
import { useCart } from '@providers/cart-provider'
import dynamic from 'next/dynamic'

const PdfReader = dynamic(
    () => import('@components/reader/pdf-reader').then((mod) => mod.PdfReader),
    { ssr: false }
)

const STUDIO_W_KEY = 'studio_width_px'
const STUDIO_W_DEFAULT = 400
const STUDIO_W_MIN = 400
const STUDIO_W_MAX = 640

export default function StudentBookPage() {
    const params = useParams()
    const router = useRouter()
    const bookId = parseInt(params.id as string)
    const { user, logout } = useAuth()
    const { count: cartCount } = useCart()

    const [bookTitle, setBookTitle] = useState<string | null>(null)
    const [pdfData, setPdfData] = useState<Blob | null>(null)
    const [initialPage, setInitialPage] = useState<number | undefined>(undefined)
    const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [studioCollapsed, setStudioCollapsed] = useState(false)
    const [studioWidthPx, setStudioWidthPx] = useState(STUDIO_W_DEFAULT)

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STUDIO_W_KEY)
            if (saved) {
                const n = parseInt(saved, 10)
                if (Number.isFinite(n)) setStudioWidthPx(Math.min(STUDIO_W_MAX, Math.max(STUDIO_W_MIN, n)))
            }
        } catch {}
    }, [])

    useEffect(() => {
        let cancelled = false

        if (isNaN(bookId) || bookId <= 0) {
            setError('Giáo trình không hợp lệ')
            setLoading(false)
            return
        }

        bookService.getBook(bookId)
            .then((book) => {
                if (!cancelled) setBookTitle(book.title)
            })
            .catch((err) => {
                console.error(err)
                if (!cancelled) setError('Không tải được thông tin giáo trình')
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        bookService.getBookFile(bookId)
            .then((data) => {
                if (!cancelled) setPdfData(data)
            })
            .catch((err) => {
                console.error(err)
            })

        libraryService.getLibraryItem(bookId)
            .then((item) => {
                if (!cancelled && item.reading_progress) setInitialPage(item.reading_progress)
            })
            .catch((err) => {
                console.error(err)
            })

        return () => { cancelled = true }
    }, [bookId])

    const beginResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        const startX = e.clientX
        const startW = studioWidthPx

        const onMove = (ev: MouseEvent) => {
            const delta = startX - ev.clientX
            setStudioWidthPx(Math.min(STUDIO_W_MAX, Math.max(STUDIO_W_MIN, startW + delta)))
        }
        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
            setStudioWidthPx((w) => {
                try { localStorage.setItem(STUDIO_W_KEY, String(w)) } catch { /* ignore */ }
                return w
            })
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }, [studioWidthPx])

    const handlePageChange = useCallback((page: number) => {
        if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
        progressTimerRef.current = setTimeout(() => {
            libraryService.updateProgress(bookId, page).catch((err) => console.error(err))
        }, 1500)
    }, [bookId])

    if (loading) {
        return (
            <div className="p-4 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 lg:p-10">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                    <p className="text-red-700 dark:text-red-300 font-semibold mb-4">{error}</p>
                    <Link href="/student/my-books" className="text-blue-600 hover:underline font-semibold">
                        Quay lại Giáo trình của tôi
                    </Link>
                </div>
            </div>
        )
    }

    const titleShort = bookTitle && bookTitle.length > 56 ? `${bookTitle.slice(0, 54)}…` : bookTitle || `Giáo trình #${bookId}`

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
            <header className="shrink-0 flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <Link
                    href="/student/my-books"
                    className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 font-semibold text-sm shrink-0"
                >
                    ← <span className="hidden sm:inline">Giáo trình của tôi</span>
                </Link>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0" aria-hidden />
                <h1 className="flex-1 min-w-0 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {titleShort}
                </h1>
                {user && (
                    <HeaderUserActions
                        userName={user.full_name}
                        roleLabel="Sinh viên"
                        cartCount={cartCount}
                        onLogout={() => { logout(); router.push('/login') }}
                    />
                )}
            </header>

            <div className="flex-1 min-h-0 flex gap-0 p-2 sm:p-3">
                {pdfData && (
                    <PdfReader
                        data={pdfData}
                        studioCollapsed={studioCollapsed}
                        onToggleStudio={() => setStudioCollapsed((v) => !v)}
                        initialPage={initialPage}
                        onPageChange={handlePageChange}
                    />
                )}
                {!studioCollapsed && (
                    <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label="Kéo để chỉnh độ rộng panel công cụ"
                        onMouseDown={beginResize}
                        className="w-2 shrink-0 cursor-col-resize flex items-center justify-center rounded-md mx-0.5 hover:bg-blue-200/70 dark:hover:bg-blue-900/40 bg-slate-200/60 dark:bg-slate-800/80 transition-colors select-none"
                    >
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-none">⋮</span>
                    </div>
                )}

                <StudioPanel
                    bookId={bookId}
                    collapsed={studioCollapsed}
                    widthPx={studioWidthPx}
                />
            </div>
        </div>
    )
}
