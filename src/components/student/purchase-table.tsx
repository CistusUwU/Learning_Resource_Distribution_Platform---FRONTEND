'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Table from '@components/ui/table'
import type { TableColumn } from '@components/ui/table'
import Badge from '@components/ui/badge'
import BookCover from '@components/book-cover'
import type { Order } from '@app-types/order.type'
import { formatOrderStatus, orderStatusToTone } from '@utils/order'
import { formatCurrency } from '@utils/currency'
import { formatTime } from '@utils/date'
import { getCheckoutPath } from '@utils/checkout'

function ReadNowAction({ items }: { items: Order['order_item'] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (items.length === 1) {
    return (
      <Link
        href={`/student/books/${items[0].book_id}`}
        className="inline-flex items-center rounded-radius-md bg-success hover:bg-success/90 text-white text-xs font-bold px-3 py-2 shadow-sm transition-colors whitespace-nowrap"
      >
        Đọc ngay
      </Link>
    )
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-radius-md bg-success hover:bg-success/90 text-white text-xs font-bold px-3 py-2 shadow-sm transition-colors whitespace-nowrap"
      >
        Đọc ngay
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-52 bg-surface border border-border rounded-radius-md shadow-lg overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.book_id}
              href={`/student/books/${item.book_id}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-text hover:bg-border/40 line-clamp-1"
            >
              {item.book.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const columns: TableColumn<Order>[] = [
  {
    key: 'books',
    header: 'Giáo trình',
    render: (order) => (
      <div className="space-y-2">
        {order.order_item.map((item) => (
          <div key={item.book_id} className="flex items-center gap-3">
            <Link
              href={`/student/store/${item.book_id}`}
              className="flex-shrink-0 w-10 h-14 bg-border/40"
            >
              <BookCover coverImage={item.book.cover_image} title={item.book.title} inset="inset-0" radius="rounded-none" />
            </Link>
            <div className="min-w-0">
              <Link
                href={`/student/store/${item.book_id}`}
                className="font-semibold text-text hover:text-primary line-clamp-2 text-sm block"
              >
                {item.book.title}
              </Link>
              <p className="text-xs text-text-secondary mt-0.5">
                {formatCurrency(Number(item.unit_price) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'order_code',
    header: 'Mã đơn hàng',
    render: (order) => <span className="font-mono text-sm text-text whitespace-nowrap">{order.order_code}</span>,
  },
  {
    key: 'created_at',
    header: 'Ngày mua',
    render: (order) => <span className="text-sm text-text-secondary whitespace-nowrap">{formatTime(order.created_at)}</span>,
  },
  {
    key: 'total_amount',
    header: 'Số tiền',
    render: (order) => <span className="font-bold text-text whitespace-nowrap">{formatCurrency(order.total_amount)}</span>,
  },
  {
    key: 'status',
    header: 'Trạng thái',
    render: (order) => <Badge tone={orderStatusToTone(order.status)}>{formatOrderStatus(order.status)}</Badge>,
  },
  {
    key: 'actions',
    header: 'Thao tác',
    render: (order) => (
      <>
        {order.status === 'PENDING' && (
          <Link
            href={getCheckoutPath(order.order_code, order.total_amount)}
            className="inline-flex items-center rounded-radius-md bg-warning hover:bg-warning/90 text-white text-xs font-bold px-3 py-2 shadow-sm transition-colors whitespace-nowrap"
          >
            Tiếp tục thanh toán
          </Link>
        )}
        {order.status === 'COMPLETED' && <ReadNowAction items={order.order_item} />}
      </>
    ),
  },
]

export default function PurchaseTable({ orders }: { orders: Order[] }) {
  return <Table<Order> columns={columns} data={orders} getRowKey={(order) => order.order_id} />
}