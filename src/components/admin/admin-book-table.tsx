'use client'

import type { ReactNode } from 'react'
import Table from '@components/ui/table'
import type { TableColumn } from '@components/ui/table'
import Badge from '@components/ui/badge'
import BookCover from '@components/book-cover'
import type { AdminManagedBook } from '@app-types/book.type'
import { formatBookApprovalStatus, bookApprovalStatusToTone } from '@utils/book'
import { formatCurrency } from '@utils/currency'

export default function AdminBookTable({
  books,
  renderActions,
}: {
  books: AdminManagedBook[]
  renderActions: (book: AdminManagedBook) => ReactNode
}) {
  const columns: TableColumn<AdminManagedBook>[] = [
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
      key: 'status',
      header: 'Trạng thái',
      render: (book) => (
        <Badge tone={bookApprovalStatusToTone(book.approval_status)}>
          {formatBookApprovalStatus(book.approval_status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: renderActions,
    },
  ]

  return <Table<AdminManagedBook> columns={columns} data={books} getRowKey={(book) => book.book_id} />
}