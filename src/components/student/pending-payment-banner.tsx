'use client'

import { getCheckoutPath } from "@/utils/checkout"
import { ordersService } from "@/services/orders.service"
import { Order } from "@/types/order.type"
import Link from "next/link"
import { useEffect, useState } from "react"


export function PendingPaymentBanner() {
    const [pending, setPending] = useState<Order[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        ordersService.getMyOrders()
            .then((orders) => setPending(orders.filter((o) => o.status === 'PENDING')))
            .catch(() => setPending([]))
            .finally(() => setLoaded(true))
    }, [])

    if (!loaded || pending.length === 0) return null

    const first = pending[0]
    const payHref = getCheckoutPath(first.order_code, first.total_amount)

    return (
        <div
            role="status"
            className="rounded-2xl border border-amber-300/80 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
            <div className="min-w-0">
                <p className="font-bold text-amber-900 dark:text-amber-100 text-sm sm:text-base">
                    Bạn có {pending.length === 1 ? 'một đơn hàng' : `${pending.length} đơn hàng`} chưa thanh toán xong
                </p>
                <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-200/90 mt-1">
                    Đơn gần nhất: <span className="font-mono font-semibold">{first.order_code}</span>.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                    href={payHref}
                    className="inline-flex justify-center items-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2.5 shadow-sm transition-colors"
                >
                    Tiếp tục thanh toán
                </Link>
                <Link
                    href="/student/purchase-history"
                    className="inline-flex justify-center items-center rounded-xl border border-amber-600/50 dark:border-amber-500/50 text-amber-900 dark:text-amber-100 text-sm font-semibold px-4 py-2.5 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 transition-colors"
                >
                    Xem đơn hàng
                </Link>
            </div>
        </div>
    )
}