'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { paymentService } from '@services/payment.service'

function VnpayReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await paymentService.verifyReturn(searchParams.toString())
        const q = new URLSearchParams({
          orderId: result.orderCode,
          amount: String(result.amount),
        })
        router.replace(`/student/payment/${result.success ? 'success' : 'failed'}?${q.toString()}`)
      } catch (err) {
        console.error(err)
        router.replace('/student/payment/failed')
      }
    }

    verify()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang xác nhận thanh toán...</p>
      </div>
    </div>
  )
}

export default function VnpayReturnPage() {
  return (
    <Suspense fallback={null}>
      <VnpayReturnContent />
    </Suspense>
  )
}