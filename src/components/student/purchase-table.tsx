'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import BookCover from '@components/book-cover'
import type { Order } from '@app-types/order.type'
import { formatOrderStatus } from '@utils/order'
import { formatCurrency } from '@utils/currency'
import { formatTime } from '@utils/date'
import { getCheckoutPath } from '@utils/checkout'

const STATUS_TONE_CLASS: Record<Order['status'], string> = {
  COMPLETED: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  PENDING: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  REFUNDED: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
}

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${STATUS_TONE_CLASS[status]}`}>
      {formatOrderStatus(status)}
    </span>
  )
}

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
        className="inline-flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 shadow-sm transition-colors whitespace-nowrap"
      >
        Đọc ngay
      </Link>
    )
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 shadow-sm transition-colors whitespace-nowrap"
      >
        Đọc ngay
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.book_id}
              href={`/student/books/${item.book_id}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 line-clamp-1"
            >
              {item.book.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function PurchaseTableRow({ order }: { order: Order }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
      <td className="p-4 align-middle">
        <div className="space-y-2">
          {order.order_item.map((item) => (
            <div key={item.book_id} className="flex items-center gap-3">
              <Link
                href={`/student/store/${item.book_id}`}
                className="flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700"
              >
                <BookCover coverImage={item.book.cover_image} title={item.book.title} inset="inset-0" radius="rounded-md" />
              </Link>
              <div className="min-w-0">
               <Link
                 href={`/student/store/${item.book_id}`}
                 className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 text-sm block"
               >
                 {item.book.title}
               </Link>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                 {formatCurrency(Number(item.unit_price) * item.quantity)}
               </p>
              </div>
            </div>
          ))}
        </div>
      </td>
      <td className="p-4 align-middle font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
        {order.order_code}
      </td>
      <td className="p-4 align-middle text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatTime(order.created_at)}
      </td>
      <td className="p-4 align-middle font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
        {formatCurrency(order.total_amount)}
      </td>
      <td className="p-4 align-middle">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="p-4 align-middle">
        {order.status === 'PENDING' && (
          <Link
            href={getCheckoutPath(order.order_code, order.total_amount)}
            className="inline-flex items-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 shadow-sm transition-colors whitespace-nowrap"
          >
            Tiếp tục thanh toán
          </Link>
        )}
        {order.status === 'COMPLETED' && (
          <ReadNowAction items={order.order_item} />
        )}
      </td>
    </tr>
  )
}

export default function PurchaseTable({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
            <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Giáo trình</th>
            <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Mã đơn hàng</th>
            <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Ngày mua</th>
            <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Số tiền</th>
            <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Trạng thái</th>
            <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <PurchaseTableRow key={order.order_id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  )
}