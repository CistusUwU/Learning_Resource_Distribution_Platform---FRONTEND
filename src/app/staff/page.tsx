'use client'

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Clock, Wallet, CircleDollarSign, FileEdit, CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { useAuth } from "@providers/auth-provider"
import { dashboardService } from "@services/dashboard.service"
import type { AdminDashboardData, StaffDashboardData, RevenueTrendPoint } from "@app-types/dashboard.type"
import { formatCurrency } from "@utils/currency"
import RevenueTrendChart from "@components/admin/revenue-trend-chart"

function KpiCard({
    icon,
    tone,
    label,
    value,
}: {
    icon: ReactNode
    tone: 'warning' | 'success' | 'primary'
    label: string
    value: string
}) {
    const toneClasses: Record<typeof tone, string> = {
        warning: 'bg-warning/10 text-warning',
        success: 'bg-success/10 text-success',
        primary: 'bg-primary/10 text-primary',
    }

    return (
        <div className="bg-surface border border-border rounded-radius-lg p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-radius-md flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="text-2xl font-bold text-text mt-0.5 truncate">{value}</p>
            </div>
        </div>
    )
}

function ListRow({
    icon,
    tone,
    title,
    subtitle,
    count,
}: {
    icon: ReactNode
    tone: 'warning' | 'success' | 'error' | 'neutral'
    title: string
    subtitle: string
    count: number
}) {
    const toneClasses: Record<typeof tone, string> = {
        warning: 'bg-warning/10 text-warning',
        success: 'bg-success/10 text-success',
        error: 'bg-error/10 text-error',
        neutral: 'bg-border text-text-secondary',
    }

    return (
        <div className="flex items-center gap-3 py-3">
            <div className={`w-9 h-9 rounded-radius-md flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-text">{title}</p>
                <p className="text-xs text-text-secondary">{subtitle}</p>
            </div>
            <span className="font-bold text-text shrink-0">{count}</span>
        </div>
    )
}

export default function StaffHomePage() {
    const { user } = useAuth()
    const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
    const [staffData, setStaffData] = useState<StaffDashboardData | null>(null)
    const [revenueTrend, setRevenueTrend] = useState<RevenueTrendPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return

        async function fetchData() {
            try {
                setLoading(true)
                setError(null)
                if (user!.role === 'ADMIN') {
                    const [admin, staff, trend] = await Promise.all([
                        dashboardService.getAdminDashboard(),
                        dashboardService.getStaffDashboard(),
                        dashboardService.getAdminRevenueTrend(),
                    ])
                    setAdminData(admin)
                    setStaffData(staff)
                    setRevenueTrend(trend)
                } else {
                    const staff = await dashboardService.getStaffDashboard()
                    setStaffData(staff)
                }
            } catch (err) {
                console.error(err)
                setError('Không thể tải dữ liệu. Vui lòng thử lại.')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    const isAdmin = user?.role === 'ADMIN'

    return (
        <div className="space-y-8 pb-10">
            {error && (
                <div className="p-4 rounded-radius-lg bg-error/10 border border-error text-error text-sm font-semibold">
                    {error}
                </div>
            )}

            {loading && (
                <div className="text-center py-16 text-text-secondary font-semibold">Đang tải...</div>
            )}

            {!loading && !error && isAdmin && adminData && (
                <section className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <KpiCard
                            icon={<Clock size={20} />}
                            tone="warning"
                            label="Chờ duyệt"
                            value={String(adminData.pending_books)}
                        />
                        <KpiCard
                            icon={<Wallet size={20} />}
                            tone="success"
                            label="Doanh thu tháng này"
                            value={formatCurrency(adminData.monthly_revenue)}
                        />
                        <KpiCard
                            icon={<CircleDollarSign size={20} />}
                            tone="warning"
                            label="Chưa được chi trả"
                            value={formatCurrency(adminData.unpaid_revenue)}
                        />
                    </div>

                    {adminData.pending_books > 0 && (
                        <div className="bg-surface border border-border rounded-radius-lg p-5">
                            <h2 className="font-bold text-text mb-1">Cần xử lý</h2>
                            <div className="divide-y divide-border">
                                <ListRow
                                    icon={<Clock size={18} />}
                                    tone="warning"
                                    title="Giáo trình chờ duyệt"
                                    subtitle="Cần bạn phê duyệt"
                                    count={adminData.pending_books}
                                />
                            </div>
                            <Link
                                href="/staff/admin/approvals"
                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                            >
                                Xử lý ngay <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}

                    {revenueTrend.length > 0 && <RevenueTrendChart data={revenueTrend} />}
                </section>
            )}

            {!loading && !error && staffData && (
                <section className="bg-surface border border-border rounded-radius-lg p-5 space-y-1">
                    <h2 className="font-bold text-text mb-1">
                        {isAdmin ? 'Công việc của tôi' : 'Tình hình giáo trình của tôi'}
                    </h2>
                    <div className="divide-y divide-border">
                        <ListRow
                            icon={<FileEdit size={18} />}
                            tone="neutral"
                            title="Bản nháp"
                            subtitle="Bạn đang soạn thảo"
                            count={staffData.books.draft}
                        />
                        <ListRow
                            icon={<Clock size={18} />}
                            tone="warning"
                            title="Chờ duyệt"
                            subtitle="Đang chờ admin phê duyệt"
                            count={staffData.books.pending}
                        />
                        <ListRow
                            icon={<CheckCircle2 size={18} />}
                            tone="success"
                            title="Đã duyệt"
                            subtitle="Đã được phê duyệt"
                            count={staffData.books.approved}
                        />
                        <ListRow
                            icon={<XCircle size={18} />}
                            tone="error"
                            title="Bị từ chối"
                            subtitle="Cần bạn chỉnh sửa lại"
                            count={staffData.books.rejected}
                        />
                    </div>

                    {!isAdmin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <KpiCard
                                icon={<Wallet size={20} />}
                                tone="success"
                                label="Doanh thu tháng này"
                                value={formatCurrency(staffData.monthly_revenue)}
                            />
                            <KpiCard
                                icon={<CircleDollarSign size={20} />}
                                tone="warning"
                                label="Chưa thanh toán"
                                value={formatCurrency(staffData.unpaid_revenue)}
                            />
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}