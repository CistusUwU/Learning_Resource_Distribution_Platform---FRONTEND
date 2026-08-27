'use client'

import type { ReactNode } from 'react'
import Table from '@components/ui/table'
import type { TableColumn } from '@components/ui/table'
import Badge from '@components/ui/badge'
import BookCover from '@components/book-cover'
import type { StaffBook } from '@app-types/book.type'
import { formatBookApprovalStatus, bookApprovalStatusToTone } from '@utils/book'
import { formatCurrency } from '@utils/currency'
import { formatDate } from '@utils/date'

export default function BookRecordTable({
  books,
  renderActions,
}: {
  books: StaffBook[]
  renderActions: (book: StaffBook) => ReactNode
}) {
  const columns: TableColumn<StaffBook>[] = [
    {
      key: 'book',
      header: 'Giáo trình',
      render: (book) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-14 bg-border/40">
            <BookCover coverImage={book.cover_image} title={book.title} inset="inset-0" radius="rounded-none" />
          </div>
          <span className="font-semibold text-text line-clamp-2 text-sm">{book.title}</span>
        </div>
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
      key: 'created_at',
      header: 'Ngày tạo',
      render: (book) => <span className="text-sm text-text-secondary whitespace-nowrap">{formatDate(book.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: renderActions,
    },
  ]

  return <Table<StaffBook> columns={columns} data={books} getRowKey={(book) => book.book_id} />
}