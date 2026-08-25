'use client'

import { useEffect, useState } from "react"
import Table from "@components/ui/table"
import type { TableColumn } from "@components/ui/table"
import Badge from "@components/ui/badge"
import { staffService } from "@services/staff.service"
import type { MyRevenueData, MyRevenueRecord } from "@app-types/revenue.type"
import { formatCurrency } from "@utils/currency"
import { formatDate } from "@utils/date"

export default function StaffRevenuePage() {
    const [data, setData] = useState<MyRevenueData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        staffService.getMyRevenue()
            .then(setData)
            .catch((err) => {
                console.error(err)
                setError('Không thể tải dữ liệu doanh thu. Vui lòng thử lại.')
            })
            .finally(() => setLoading(false))
    }, [])

    const columns: TableColumn<MyRevenueRecord>[] = [
        {
            key: 'book',
            header: 'Giáo trình',
            render: (row) => <span className="font-semibold text-text text-sm">{row.book.title}</span>,
        },
        {
            key: 'earned',
            header: 'Số tiền',
            render: (row) => <span className="font-bold text-text whitespace-nowrap">{formatCurrency(row.earned_amount)}</span>,
        },
        {
            key: 'status',
            header: 'Trạng thái',
            render: (row) => (
                <Badge tone={row.status === 'PAID' ? 'success' : 'warning'}>
                    {row.status === 'PAID' ? 'Đã nhận' : 'Chờ nhận'}
                </Badge>
            ),
        },
        {
            key: 'date',
            header: 'Ngày',
            render: (row) => <span className="text-sm text-text-secondary whitespace-nowrap">{formatDate(row.created_at)}</span>,
        },
    ]

    return (
        <div className="space-y-6">
            {loading && (
                <div className="bg-surface border border-border rounded-radius-lg p-12 text-center">
                    <p className="text-text-secondary">Đang tải...</p>
                </div>
            )}

            {error && (
                <div className="bg-surface border border-border rounded-radius-lg p-12 text-center">
                    <p className="text-error">{error}</p>
                </div>
            )}

            {!loading && !error && data && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-surface border border-border rounded-radius-lg p-5">
                            <p className="text-sm text-text-secondary">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-text mt-1">{formatCurrency(data.totalEarned)}</p>
                        </div>
                        <div className="bg-surface border border-border rounded-radius-lg p-5">
                            <p className="text-sm text-text-secondary">Chờ nhận</p>
                            <p className="text-2xl font-bold text-warning mt-1">{formatCurrency(data.totalPending)}</p>
                        </div>
                        <div className="bg-surface border border-border rounded-radius-lg p-5">
                            <p className="text-sm text-text-secondary">Đã nhận</p>
                            <p className="text-2xl font-bold text-success mt-1">{formatCurrency(data.totalPaid)}</p>
                        </div>
                    </div>

                    {data.records.length === 0 ? (
                        <div className="bg-surface border border-border rounded-radius-lg text-center py-12">
                            <p className="font-semibold text-text">Chưa có giao dịch nào</p>
                        </div>
                    ) : (
                        <Table<MyRevenueRecord> columns={columns} data={data.records} getRowKey={(row) => row.id} />
                    )}
                </>
            )}
        </div>
    )
}