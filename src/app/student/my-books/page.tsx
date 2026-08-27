'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StudentShell from '@layouts/student-shell/student-shell'
import BookCard from '@components/student/book-card'
import { libraryService } from '@services/library.service'
import type { LibraryItem } from '@app-types/library.type'

export default function MyBooksPage() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await libraryService.getMyLibrary()
        setItems(data)
      } catch {
        setError('Không thể tải thư viện. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <StudentShell>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Giáo trình của tôi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Giáo trình bạn đã mua và có thể đọc
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang tải thư viện...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 text-red-700 dark:text-red-300 font-semibold">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Chưa có giáo trình nào
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Mua giáo trình từ cửa hàng để bắt đầu đọc và học tập.
            </p>
            <Link
              href="/student/store"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95"
            >
              Khám phá cửa hàng
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {items.length} giáo trình
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <BookCard key={item.library_id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </StudentShell>
  )
}