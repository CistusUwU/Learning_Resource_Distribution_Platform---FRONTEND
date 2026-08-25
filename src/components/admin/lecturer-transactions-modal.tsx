'use client'

import { useEffect, useState } from 'react'
import Table from '@components/ui/table'
import type { TableColumn } from '@components/ui/table'
import Badge from '@components/ui/badge'
import Pagination from '@components/pagination'
import { adminService } from '@services/admin.service'
import { formatCurrency } from '@utils/currency'
import { formatDate } from '@utils/date'
import type { LecturerRevenueStat, LecturerTransaction } from '@app-types/revenue.type'

const LIMIT = 10

export default function LecturerTransactionsModal({
  lecturer,
  onClose,
}: {
  lecturer: LecturerRevenueStat
  onClose: () => void
}) {
  const [transactions, setTransactions] = useState<LecturerTransaction[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)
        setError(null)
        const data = await adminService.getLecturerTransactions(lecturer.lecturer_id, { page, limit: LIMIT })
        setTransactions(data.items)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error(err)
        setError('Không thể tải danh sách giao dịch. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [page])

  const columns: TableColumn<LecturerTransaction>[] = [
    {
      key: 'book',
      header: 'Giáo trình',
      render: (t) => <span className="font-semibold text-text text-sm">{t.book.title}</span>,
    },
    {
      key: 'student',
      header: 'Sinh viên',
      render: (t) => (
        <span className="text-sm text-text-secondary">
          {t.student ? `${t.student.full_name} (${t.student.student_code})` : '—'}
        </span>
      ),
    },
    {
      key: 'earned',
      header: 'Số tiền',
      render: (t) => <span className="font-bold text-text whitespace-nowrap">{formatCurrency(t.earned_amount)}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (t) => (
        <Badge tone={t.status === 'PAID' ? 'success' : 'warning'}>
          {t.status === 'PAID' ? 'Đã trả' : 'Chờ trả'}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Ngày',
      render: (t) => <span className="text-sm text-text-secondary whitespace-nowrap">{formatDate(t.created_at)}</span>,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-surface rounded-radius-lg border border-border p-5 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg text-text">{lecturer.lecturer.full_name}</h2>
            <p className="text-sm text-text-secondary">{lecturer.lecturer.lecturer_code}</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text text-sm font-semibold">
            Đóng
          </button>
        </div>

        {loading && <p className="text-text-secondary text-center py-8">Đang tải...</p>}
        {error && <p className="text-error text-center py-8">{error}</p>}
        {!loading && !error && transactions.length === 0 && (
          <p className="text-text-secondary text-center py-8">Chưa có giao dịch nào</p>
        )}
        {!loading && !error && transactions.length > 0 && (
          <div className="space-y-4">
            <Table<LecturerTransaction> columns={columns} data={transactions} getRowKey={(t) => t.id} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}