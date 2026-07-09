import Link from 'next/link'
import BookCover from '@components/book-cover'
import type { LibraryItem } from '@app-types/library.type'

interface BookCardProps {
  item: LibraryItem
}

export default function BookCard({ item }: BookCardProps) {
  const purchasedDate = item.purchased_date
    ? new Date(item.purchased_date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—'

  return (
    <Link
      href={`/student/books/${item.book.book_id}/read`}
      className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all"
    >
      <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-700">
        <BookCover
          coverImage={item.book.cover_image}
          title={item.book.title}
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
          {item.book.title}
        </h3>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Mua {purchasedDate}
        </p>
      </div>
    </Link>
  )
}