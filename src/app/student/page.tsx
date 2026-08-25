'use client'

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import StudentShell from "@layouts/student-shell/student-shell"
import BookCover from "@components/book-cover"
import { libraryService } from "@services/library.service"
import type { LibraryItem } from "@app-types/library.type"

export default function StudentDashboardPage() {
    const [library, setLibrary] = useState<LibraryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        libraryService.getMyLibrary()
            .then(setLibrary)
            .catch(() => setLibrary([]))
            .finally(() => setLoading(false))
    }, [])

    const readingCount = library.filter((item) => (item.reading_progress ?? 0) > 0).length

    const continueReading = useMemo(() => {
        return [...library]
            .filter((item) => (item.reading_progress ?? 0) > 0 && item.last_accessed)
            .sort((a, b) => new Date(b.last_accessed as string).getTime() - new Date(a.last_accessed as string).getTime())
            .slice(0, 3)
    }, [library])

    const recentBooks = useMemo(() => {
        return [...library]
            .filter((item) => item.purchased_date)
            .sort((a, b) => new Date(b.purchased_date as string).getTime() - new Date(a.purchased_date as string).getTime())
            .slice(0, 6)
    }, [library])

    return (
        <StudentShell>
            <div className="space-y-8 pb-10">
                {loading ? (
                    <div className="text-center py-16 text-slate-600 dark:text-slate-400 font-semibold">Đang tải...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-800 p-7 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Giáo trình của tôi</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{library.length}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-7 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Đang đọc</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{readingCount}</p>
                            </div>
                        </div>

                        {continueReading.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tiếp tục đọc</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {continueReading.map((item) => (
                                        <Link
                                            key={item.library_id}
                                            href={`/student/books/${item.book.book_id}`}
                                            className="flex gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-400 transition-colors"
                                        >
                                            <div className="w-14 flex-shrink-0">
                                                <div className="aspect-[3/4] relative">
                                                    <BookCover coverImage={item.book.cover_image} title={item.book.title} inset="inset-1" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex flex-col justify-center">
                                                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{item.book.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Trang {item.reading_progress}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recentBooks.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Giáo trình gần đây</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {recentBooks.map((item) => (
                                        <Link key={item.library_id} href={`/student/books/${item.book.book_id}`} className="group">
                                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
                                                <BookCover coverImage={item.book.cover_image} title={item.book.title} inset="inset-0" />
                                            </div>
                                            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-blue-600">
                                                {item.book.title}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {library.length === 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 p-12 text-center">
                                <p className="text-slate-600 dark:text-slate-400 font-semibold mb-4">Bạn chưa có giáo trình nào</p>
                                <Link
                                    href="/student/store"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Khám phá Cửa hàng
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </StudentShell>
    )
}