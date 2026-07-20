    'use client'

    import { useEffect, useMemo, useState } from 'react'
    import Link from 'next/link'
    import StudentShell from '@layouts/student-shell/student-shell'
    import PurchaseTable from '@components/student/purchase-table'
    import { ordersService } from '@services/orders.service'
    import type { Order } from '@app-types/order.type'

    const TABS: { key: 'ALL' | Order['status']; label: string }[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ thanh toán' },
    { key: 'COMPLETED', label: 'Đã hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' },
    { key: 'REFUNDED', label: 'Đã hoàn tiền' },
    ]

    export default function PurchaseHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'ALL' | Order['status']>('ALL')

    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await ordersService.getMyOrders()
            setOrders(data)
        } catch (err) {
            console.error(err)
            setError('Không thể tải lịch sử mua hàng. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
        }

        load()
    }, [])

    const filteredOrders = useMemo(() => {
        if (activeTab === 'ALL') return orders
        return orders.filter((o) => o.status === activeTab)
    }, [orders, activeTab])

    return (
        <StudentShell>
        <div className="space-y-6 pb-10">
            <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Đơn hàng &amp; thanh toán
            </h1>
            </div>

            <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
                <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                >
                {tab.label}
                </button>
            ))}
            </div>

            {loading && (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang tải lịch sử mua hàng...</p>
                </div>
            </div>
            )}

            {!loading && error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 text-red-700 dark:text-red-300 font-semibold">
                {error}
            </div>
            )}

            {!loading && !error && filteredOrders.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 p-12 text-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {activeTab === 'ALL' ? 'Chưa có đơn hàng' : 'Không có đơn nào ở trạng thái này'}
                </h2>
                {activeTab === 'ALL' && (
                    <Link
                    href="/student/store"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                    Khám phá thư viện
                    </Link>
                )}
            </div>
            )}

            {!loading && !error && filteredOrders.length > 0 && (
            <PurchaseTable orders={filteredOrders} />
            )}
        </div>
        </StudentShell>
    )
    }