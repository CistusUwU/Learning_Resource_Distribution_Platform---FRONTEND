'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import AdminBookTable from '@components/admin/admin-book-table'
import Pagination from '@components/pagination'
import BookFormModal from '@components/staff/book-form-modal'
import { adminService } from '@services/admin.service'
import { staffService } from '@services/staff.service'
import type { AdminManagedBook, StaffBook } from '@app-types/book.type'
import { useSearchParams } from 'next/navigation'

const LIMIT = 10

const TABS: { label: string; value: 'ALL' | 'APPROVED' | 'PENDING' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Chờ duyệt', value: 'PENDING' },
]

export default function AdminManageBooksPage() {
  const [books, setBooks] = useState<AdminManagedBook[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL')
  const [actingId, setActingId] = useState<number | null>(null)
  const [rejectingBook, setRejectingBook] = useState<AdminManagedBook | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectSubmitting, setRejectSubmitting] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true)
        setError(null)
        const data = await adminService.getManagedBooks({
          page,
          limit: LIMIT,
          search: search || undefined,
          status: activeTab === 'ALL' ? undefined : activeTab,
        })
        setBooks(data.items)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error(err)
        setError('Không thể tải danh sách giáo trình. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [page, search, activeTab, refreshKey])

  function handleTabChange(tab: 'ALL' | 'APPROVED' | 'PENDING') {
    setActiveTab(tab)
    setPage(1)
  }

  async function handleApprove(bookId: number) {
    try {
      setActingId(bookId)
      await adminService.approveBook(bookId)
      setBooks((prev) => prev.filter((b) => b.book_id !== bookId))
    } catch (err) {
      console.error(err)
      alert('Duyệt giáo trình thất bại. Vui lòng thử lại.')
    } finally {
      setActingId(null)
    }
  }

  function openReject(book: AdminManagedBook) {
    setRejectingBook(book)
    setRejectReason('')
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rejectingBook || !rejectReason.trim()) return

    try {
      setRejectSubmitting(true)
      await adminService.rejectBook(rejectingBook.book_id, rejectReason.trim())
      setBooks((prev) => prev.filter((b) => b.book_id !== rejectingBook.book_id))
      setRejectingBook(null)
    } catch (err) {
      console.error(err)
      alert('Từ chối giáo trình thất bại. Vui lòng thử lại.')
    } finally {
      setRejectSubmitting(false)
    }
  }

  async function handleToggleArchive(book: AdminManagedBook) {
    try {
      setActingId(book.book_id)
      await adminService.toggleArchive(book.book_id)
      setBooks((prev) =>
        prev.map((b) => (b.book_id === book.book_id ? { ...b, is_archived: !b.is_archived } : b))
      )
    } catch (err) {
      console.error(err)
      alert('Thao tác thất bại. Vui lòng thử lại.')
    } finally {
      setActingId(null)
    }
  }

  async function handleBookCreated(book: StaffBook) {
    try {
      await staffService.submitBook(book.book_id)
    } catch (err) {
      console.error(err)
    } finally {
      setShowCreateModal(false)
      setPage(1)
      setRefreshKey((k) => k + 1)
    }
  }

  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-4 py-2 rounded-radius-pill text-sm font-semibold transition-colors ${
                  activeTab === tab.value ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-radius-md bg-primary text-white text-sm font-bold px-4 py-2 hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            + Tạo giáo trình mới
          </button>
        </div>

        {loading && (
          <div className="bg-surface rounded-radius-lg border border-border p-12 text-center">
            <p className="text-text-secondary">Đang tải...</p>
          </div>
        )}

        {error && (
          <div className="bg-surface rounded-radius-lg border border-border p-12 text-center">
            <p className="text-error">{error}</p>
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
            <p className="font-semibold text-text">
              {search ? 'Không tìm thấy giáo trình phù hợp' : 'Chưa có giáo trình nào'}
            </p>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="space-y-4">
            <AdminBookTable
              books={books}
              renderActions={(book) => (
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/staff/books/${book.book_id}/preview`}
                    className="inline-flex items-center rounded-radius-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border/30 transition-colors"
                  >
                    Xem
                  </Link>
                  {book.approval_status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(book.book_id)}
                        disabled={actingId === book.book_id}
                        className="inline-flex items-center rounded-radius-md bg-success px-3 py-1.5 text-xs font-semibold text-white hover:bg-success/90 transition-colors disabled:opacity-50"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => openReject(book)}
                        disabled={actingId === book.book_id}
                        className="inline-flex items-center rounded-radius-md border border-error px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {book.approval_status === 'APPROVED' && (
                    <button
                      onClick={() => handleToggleArchive(book)}
                      disabled={actingId === book.book_id}
                      title={book.is_archived ? 'Bỏ ẩn' : 'Ẩn'}
                      className="inline-flex items-center justify-center rounded-radius-md border border-border w-8 h-8 text-text hover:bg-border/30 transition-colors disabled:opacity-50"
                    >
                      {book.is_archived ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              )}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {rejectingBook && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => !rejectSubmitting && setRejectingBook(null)}
        >
          <div
            className="bg-surface rounded-radius-lg border border-border p-5 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-text mb-1">Từ chối giáo trình</h2>
            <p className="text-sm text-text-secondary mb-3">{rejectingBook.title}</p>
            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                required
                placeholder="Nhập lý do từ chối..."
                className="w-full rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingBook(null)}
                  disabled={rejectSubmitting}
                  className="flex-1 rounded-radius-md border border-border py-2 text-sm font-semibold text-text hover:bg-border/30 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={rejectSubmitting}
                  className="flex-1 rounded-radius-md bg-error text-white py-2 text-sm font-bold hover:bg-error/90 disabled:opacity-50"
                >
                  {rejectSubmitting ? 'Đang gửi...' : 'Từ chối'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateModal && (
        <BookFormModal onClose={() => setShowCreateModal(false)} onSaved={handleBookCreated} />
      )}
    </>
  )
}