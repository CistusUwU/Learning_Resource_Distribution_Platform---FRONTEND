'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { bookService } from '@services/book.service'

const PdfReader = dynamic(
    () => import('@components/reader/pdf-reader').then((mod) => mod.PdfReader),
    { ssr: false }
)

export default function StaffBookPreviewPage() {
    const params = useParams()
    const bookId = parseInt(params.id as string)

    const [bookTitle, setBookTitle] = useState<string | null>(null)
    const [pdfData, setPdfData] = useState<Blob | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        if (isNaN(bookId) || bookId <= 0) {
            setError('Sách không hợp lệ')
            setLoading(false)
            return
        }

        bookService.getBook(bookId)
            .then((book) => {
                if (!cancelled) setBookTitle(book.title)
            })
            .catch((err) => {
                console.error(err)
                if (!cancelled) setError('Không tải được thông tin sách')
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

        return () => { cancelled = true }
    }, [bookId])

    if (loading) {
        return (
            <div className="p-4 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 lg:p-10">
                <div className="bg-surface border border-border rounded-radius-lg p-8 text-center">
                    <p className="text-error font-semibold mb-4">{error}</p>
                    <Link href="/staff/books" className="text-primary hover:underline font-semibold">
                        Quay lại Quản lý sách
                    </Link>
                </div>
            </div>
        )
    }

    const titleShort = bookTitle && bookTitle.length > 56 ? `${bookTitle.slice(0, 54)}…` : bookTitle || `Sách #${bookId}`

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-background rounded-radius-lg border border-border overflow-hidden">
            <header className="shrink-0 flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-surface border-b border-border">
                <Link
                    href="/staff/books"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-primary font-semibold text-sm shrink-0"
                >
                    ← <span className="hidden sm:inline">Quản lý sách</span>
                </Link>
                <div className="h-6 w-px bg-border shrink-0" aria-hidden />
                <h1 className="flex-1 min-w-0 text-sm sm:text-base font-bold text-text truncate">
                    {titleShort}
                </h1>
            </header>

            <div className="flex-1 min-h-0 flex p-2 sm:p-3">
                {pdfData && (
                    <PdfReader
                        data={pdfData}
                        studioCollapsed={true}
                        onToggleStudio={() => {}}
                        showStudioToggle={false}
                    />
                )}
            </div>
        </div>
    )
}