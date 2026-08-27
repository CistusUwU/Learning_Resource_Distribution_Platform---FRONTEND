'use client'

import { useEffect, useState } from 'react'
import Table from '@components/ui/table'
import type { TableColumn } from '@components/ui/table'
import Badge from '@components/ui/badge'
import Pagination from '@components/pagination'
import LecturerTransactionsModal from '@components/admin/lecturer-transactions-modal'
import { adminService } from '@services/admin.service'
import { formatCurrency } from '@utils/currency'
import { formatDate } from '@utils/date'
import type { LecturerRevenueStat, PayoutBatch } from '@app-types/revenue.type'

const CURRENT_YEAR = new Date().getFullYear()
const STATS_LIMIT = 10
const BATCH_LIMIT = 5

function LecturerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  )
}

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<LecturerRevenueStat[]>([])
  const [statsPage, setStatsPage] = useState(1)
  const [statsTotalPages, setStatsTotalPages] = useState(1)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [year, setYear] = useState<number>(CURRENT_YEAR)
  const [month, setMonth] = useState<number | ''>('')

  const [batches, setBatches] = useState<PayoutBatch[]>([])
  const [batchPage, setBatchPage] = useState(1)
  const [batchTotalPages, setBatchTotalPages] = useState(1)
  const [batchLoading, setBatchLoading] = useState(true)

  const [detailLecturer, setDetailLecturer] = useState<LecturerRevenueStat | null>(null)

  const [showCreatePayout, setShowCreatePayout] = useState(false)
  const [payoutMonth, setPayoutMonth] = useState(new Date().getMonth() + 1)
  const [payoutYear, setPayoutYear] = useState(CURRENT_YEAR)
  const [payoutNote, setPayoutNote] = useState('')
  const [payoutSubmitting, setPayoutSubmitting] = useState(false)
  const [payoutError, setPayoutError] = useState<string | null>(null)

  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setStatsLoading(true)
        setStatsError(null)
        const data = await adminService.getRevenueStats({
          year,
          month: month === '' ? undefined : month,
          page: statsPage,
          limit: STATS_LIMIT,
        })
        setStats(data.items)
        setStatsTotalPages(data.totalPages)
      } catch (err) {
        console.error(err)
        setStatsError('Không thể tải số liệu doanh thu. Vui lòng thử lại.')
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [year, month, statsPage])

  function handleFilterChange(nextMonth: number | '', nextYear: number) {
    setMonth(nextMonth)
    setYear(nextYear)
    setStatsPage(1)
  }

  async function fetchBatches() {
    try {
      setBatchLoading(true)
      const data = await adminService.getPayoutBatches({ page: batchPage, limit: BATCH_LIMIT })
      setBatches(data.items)
      setBatchTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setBatchLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [batchPage])

  async function handleCreatePayout(e: React.FormEvent) {
    e.preventDefault()
    setPayoutError(null)
    try {
      setPayoutSubmitting(true)
      await adminService.createPayout({ month: payoutMonth, year: payoutYear, note: payoutNote || undefined })
      setShowCreatePayout(false)
      setPayoutNote('')
      setBatchPage(1)
      fetchBatches()
    } catch (err) {
      console.error(err)
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      setPayoutError(message ?? 'Tạo đợt thanh toán thất bại. Vui lòng thử lại.')
    } finally {
      setPayoutSubmitting(false)
    }
  }

  async function handleConfirm(id: string) {
    try {
      setConfirmingId(id)
      await adminService.confirmPayout(id)
      fetchBatches()
    } catch (err) {
      console.error(err)
      alert('Xác nhận thất bại. Vui lòng thử lại.')
    } finally {
      setConfirmingId(null)
    }
  }

  async function handleExport(id: string) {
    try {
      const csv = await adminService.exportPayoutCSV(id)
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `payout-${id}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Xuất file thất bại. Vui lòng thử lại.')
    }
  }

  const statsColumns: TableColumn<LecturerRevenueStat>[] = [
    {
      key: 'lecturer',
      header: 'Giảng viên',
      render: (row) => (
        <div className="flex items-center gap-3">
          <LecturerAvatar name={row.lecturer.full_name} />
          <div>
            <p className="font-semibold text-text">{row.lecturer.full_name}</p>
            <p className="text-xs text-text-secondary">{row.lecturer.lecturer_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'bookCount',
      header: 'Số giao dịch',
      render: (row) => <span className="text-text">{row.bookCount}</span>,
    },
    {
      key: 'totalEarned',
      header: 'Tổng doanh thu',
      render: (row) => <span className="font-bold text-text whitespace-nowrap">{formatCurrency(row.totalEarned)}</span>,
    },
    {
      key: 'totalPending',
      header: 'Đang chờ nhận',
      render: (row) => <Badge tone="warning">{formatCurrency(row.totalPending)}</Badge>,
    },
    {
      key: 'totalPaid',
      header: 'Đã nhận',
      render: (row) => <Badge tone="success">{formatCurrency(row.totalPaid)}</Badge>,
    },
    {
        key: 'actions',
        header: 'Thao tác',
        render: (row) => (
            <button
              onClick={() => setDetailLecturer(row)}
              className="inline-flex items-center rounded-radius-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border/30 transition-colors"
            >
              Xem chi tiết
            </button>
        ),
      },
    ]
  
    const batchColumns: TableColumn<PayoutBatch>[] = [
    {
      key: 'period',
      header: 'Kỳ',
      render: (row) => <span className="font-semibold text-text whitespace-nowrap">Tháng {row.month}/{row.year}</span>,
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      render: (row) => <span className="font-bold text-text whitespace-nowrap">{formatCurrency(row.total_amount)}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => (
        <Badge tone={row.status === 'COMPLETED' ? 'success' : 'warning'}>
          {row.status === 'COMPLETED' ? 'Đã hoàn tất' : 'Chờ xử lý'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Tạo lúc',
      render: (row) => <span className="text-sm text-text-secondary whitespace-nowrap">{formatDate(row.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleExport(row.id)}
            className="inline-flex items-center rounded-radius-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border/30 transition-colors"
          >
            Xuất CSV
          </button>
          {row.status === 'PENDING' && (
            <button
              onClick={() => handleConfirm(row.id)}
              disabled={confirmingId === row.id}
              className="inline-flex items-center rounded-radius-md border border-success px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/10 transition-colors disabled:opacity-50"
            >
              Xác nhận đã trả
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-bold text-text">Doanh thu theo giảng viên</h2>
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => handleFilterChange(e.target.value === '' ? '' : Number(e.target.value), year)}
                className="rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
              >
                <option value="">Cả năm</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => handleFilterChange(month, Number(e.target.value))}
                className="rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
              >
                {[CURRENT_YEAR, CURRENT_YEAR - 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {statsLoading && (
            <div className="bg-surface rounded-radius-lg border border-border p-12 text-center">
              <p className="text-text-secondary">Đang tải...</p>
            </div>
          )}
          {statsError && (
            <div className="bg-surface rounded-radius-lg border border-border p-12 text-center">
              <p className="text-error">{statsError}</p>
            </div>
          )}
          {!statsLoading && !statsError && stats.length === 0 && (
            <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
              <p className="font-semibold text-text">Không có dữ liệu doanh thu trong khoảng thời gian này</p>
            </div>
          )}
          {!statsLoading && !statsError && stats.length > 0 && (
            <div className="space-y-4">
              <Table<LecturerRevenueStat> columns={statsColumns} data={stats} getRowKey={(row) => row.lecturer_id} />
              <Pagination page={statsPage} totalPages={statsTotalPages} onPageChange={setStatsPage} />
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-bold text-text">Đợt thanh toán</h2>
            <button
              onClick={() => {
                setPayoutMonth(month === '' ? new Date().getMonth() + 1 : month)
                setPayoutYear(year)
                setShowCreatePayout(true)
              }}
              className="inline-flex items-center gap-2 rounded-radius-md bg-primary text-white text-sm font-bold px-4 py-2 hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              + Tạo đợt thanh toán
            </button>
          </div>

          {batchLoading && (
            <div className="bg-surface rounded-radius-lg border border-border p-12 text-center">
              <p className="text-text-secondary">Đang tải...</p>
            </div>
          )}
          {!batchLoading && batches.length === 0 && (
            <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
              <p className="font-semibold text-text">Chưa có đợt thanh toán nào</p>
            </div>
          )}
          {!batchLoading && batches.length > 0 && (
            <div className="space-y-4">
              <Table<PayoutBatch> columns={batchColumns} data={batches} getRowKey={(row) => row.id} />
              <Pagination page={batchPage} totalPages={batchTotalPages} onPageChange={setBatchPage} />
            </div>
          )}
        </section>
      </div>

      {detailLecturer && (
        <LecturerTransactionsModal lecturer={detailLecturer} onClose={() => setDetailLecturer(null)} />
      )}

      {showCreatePayout && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => !payoutSubmitting && setShowCreatePayout(false)}
        >
          <div
            className="bg-surface rounded-radius-lg border border-border p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-text mb-4">Tạo đợt thanh toán</h2>
            <form onSubmit={handleCreatePayout} className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={payoutMonth}
                  onChange={(e) => setPayoutMonth(Number(e.target.value))}
                  className="flex-1 rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
                <select
                  value={payoutYear}
                  onChange={(e) => setPayoutYear(Number(e.target.value))}
                  className="flex-1 rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
                >
                  {[CURRENT_YEAR, CURRENT_YEAR - 1].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={payoutNote}
                onChange={(e) => setPayoutNote(e.target.value)}
                rows={2}
                placeholder="Ghi chú"
                className="w-full rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
              />
              {payoutError && <p className="text-sm text-error">{payoutError}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePayout(false)}
                  disabled={payoutSubmitting}
                  className="flex-1 rounded-radius-md border border-border py-2 text-sm font-semibold text-text hover:bg-border/30 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={payoutSubmitting}
                  className="flex-1 rounded-radius-md bg-primary text-white py-2 text-sm font-bold hover:bg-primary-hover disabled:opacity-50"
                >
                  {payoutSubmitting ? 'Đang tạo...' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}