'use client'

import type { ReactNode } from 'react'
import Table from '@components/ui/table'
import type { TableColumn } from '@components/ui/table'
import BookCover from '@components/book-cover'
import type { AdminPendingBook } from '@app-types/book.type'
import { formatCurrency } from '@utils/currency'
import { formatDate } from '@utils/date'

export default function AdminReviewTable({
  books,
  renderActions,
}: {
  books: AdminPendingBook[]
  renderActions: (book: AdminPendingBook) => ReactNode
}) {
  const columns: TableColumn<AdminPendingBook>[] = [
    {
      key: 'book',
      header: 'Giáo trình',
      render: (book) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-16 bg-border/40">
            <BookCover coverImage={book.cover_image} title={book.title} inset="inset-0" radius="rounded-none" />
          </div>
          <span className="font-semibold text-text line-clamp-2 text-sm">{book.title}</span>
        </div>
      ),
    },
    {
      key: 'lecturer',
      header: 'Giảng viên',
      render: (book) => (
        <span className="text-sm text-text-secondary whitespace-nowrap">
          {book.book_author[0]?.lecturer.full_name ?? '—'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Giá',
      render: (book) => <span className="font-bold text-text whitespace-nowrap">{formatCurrency(book.price)}</span>,
    },
    {
      key: 'submitted_at',
      header: 'Ngày nộp',
      render: (book) => (
        <span className="text-sm text-text-secondary whitespace-nowrap">{formatDate(book.submitted_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: renderActions,
    },
  ]

  return <Table<AdminPendingBook> columns={columns} data={books} getRowKey={(book) => book.book_id} />
}