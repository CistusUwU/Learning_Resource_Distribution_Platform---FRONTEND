'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatCurrency } from '@utils/currency'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-sm w-full">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Thanh toán thành công</h1>
        {orderId && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Mã đơn: {orderId}</p>
        )}
        {amount && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Số tiền: {formatCurrency(amount)}</p>
        )}
        <Link
          href="/student/purchase-history"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
        >
          Xem lịch sử mua hàng
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}