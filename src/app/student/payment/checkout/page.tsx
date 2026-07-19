'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import StudentShell from '@layouts/student-shell/student-shell'
import { paymentService } from '@services/payment.service'
import { formatCurrency } from '@utils/currency'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('Thiếu thông tin đơn hàng.')
      return
    }

    const start = async () => {
      try {
        const url = await paymentService.createPayment(orderId)
        window.location.href = url
      } catch (err) {
        console.error(err)
        setError('Không thể khởi tạo thanh toán. Vui lòng thử lại từ trang lịch sử mua hàng.')
      }
    }

    start()
  }, [orderId])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-sm">
        {!error ? (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-semibold">
              Đang chuyển đến cổng thanh toán VNPay...
            </p>
            {amount && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Số tiền: {formatCurrency(amount)}
              </p>
            )}
          </>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 text-red-700 dark:text-red-300 font-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <StudentShell>
      <Suspense fallback={null}>
        <CheckoutContent />
      </Suspense>
    </StudentShell>
  )
}