'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BookRecordTable from '@components/staff/book-record-table'
import Pagination from '@components/pagination'
import { staffService } from '@services/staff.service'
import type { StaffBook, BookApprovalStatus } from '@app-types/book.type'
import CreateBookModal from '@components/staff/book-form-modal'
import BookFormModal from '@components/staff/book-form-modal'

const TABS: { label: string; value: BookApprovalStatus | 'ALL' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Bản nháp', value: 'DRAFT' },
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Cần chỉnh sửa', value: 'UPDATE_REQUIRED' },
  { label: 'Bị từ chối', value: 'REJECTED' },
]

const LIMIT = 10

export default function StaffBooksPage() {
  const [books, setBooks] = useState<StaffBook[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<BookApprovalStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)
  const [submittingId, setSubmittingId] = useState<number | null>(null)
  const [reasonBook, setReasonBook] = useState<StaffBook | null>(null)
  const [modalBook, setModalBook] = useState<StaffBook | 'new' | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true)
        setError(null)
        const data = await staffService.getMyBooks({
          page,
          limit: LIMIT,
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
  }, [page, activeTab, refreshKey])

  function handleTabChange(tab: BookApprovalStatus | 'ALL') {
    setActiveTab(tab)
    setPage(1)
  }

  function handleBookSaved() {
    setModalBook(null)
    setActiveTab('ALL')
    setPage(1)
    setRefreshKey((k) => k + 1)
  }

  async function handleSubmit(bookId: number) {
    try {
      setSubmittingId(bookId)
      const updated = await staffService.submitBook(bookId)
      setBooks((prev) => prev.map((b) => (b.book_id === bookId ? updated : b)))
    } catch (err) {
      console.error(err)
      alert('Nộp duyệt thất bại. Vui lòng thử lại.')
    } finally {
      setSubmittingId(null)
    }
  }

  async function handleCancel(bookId: number) {
    try {
      setSubmittingId(bookId)
      await staffService.cancelSubmission(bookId)
      setBooks((prev) =>
        prev.map((b) => (b.book_id === bookId ? { ...b, approval_status: 'DRAFT', submitted_at: null } : b))
      )
    } catch (err) {
      console.error(err)
      alert('Hủy nộp thất bại. Vui lòng thử lại.')
    } finally {
      setSubmittingId(null)
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
            onClick={() => setModalBook('new')}
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

        {!loading && !error && books.length === 0 && activeTab === 'ALL' && (
          <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
            <p className="font-semibold text-text">Bạn chưa có giáo trình nào</p>
            <p className="text-sm text-text-secondary mt-1">Thêm tài liệu đầu tiên để bắt đầu xây dựng thư viện học tập của bạn.</p>
          </div>
        )}

        {!loading && !error && books.length === 0 && activeTab !== 'ALL' && (
          <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
            <p className="font-semibold text-text">Không có giáo trình ở trạng thái này</p>
            <p className="text-sm text-text-secondary mt-1">Hãy thử chọn trạng thái khác để xem giáo trình.</p>
            <button
              onClick={() => handleTabChange('ALL')}
              className="mt-3 rounded-radius-md border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-border/30"
            >
              Xem tất cả giáo trình
            </button>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="space-y-4">
            <BookRecordTable
              books={books}
              renderActions={(book) => (
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/staff/books/${book.book_id}/preview`}
                    className="inline-flex items-center rounded-radius-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border/30 transition-colors"
                  >
                    Xem trước
                  </Link>
                  {(book.approval_status === 'DRAFT' || book.approval_status === 'UPDATE_REQUIRED') && (
                    <button
                      onClick={() => setModalBook(book)}
                      className="inline-flex items-center rounded-radius-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border/30 transition-colors"
                    >
                      Sửa
                    </button>
                  )}
                  {(book.approval_status === 'DRAFT' || book.approval_status === 'UPDATE_REQUIRED') && (
                    <button
                      onClick={() => handleSubmit(book.book_id)}
                      disabled={submittingId === book.book_id}
                      className="inline-flex items-center rounded-radius-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      Nộp duyệt
                    </button>
                  )}
                  {book.approval_status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(book.book_id)}
                      disabled={submittingId === book.book_id}
                      className="inline-flex items-center rounded-radius-md border border-error px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                    >
                      Hủy nộp
                    </button>
                  )}
                  {book.approval_status === 'REJECTED' && (
                    <button
                      onClick={() => setReasonBook(book)}
                      className="inline-flex items-center rounded-radius-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border/30 transition-colors"
                    >
                      Xem lý do
                    </button>
                  )}
                </div>
              )}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {reasonBook && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setReasonBook(null)}
        >
          <div
            className="bg-surface rounded-radius-lg border border-border p-5 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-text mb-1">Lý do từ chối</h2>
            <p className="text-sm text-text-secondary mb-3">{reasonBook.title}</p>
            <p className="text-sm text-text bg-error/10 rounded-radius-md p-3">
              {reasonBook.rejection_reason ?? 'Không có ghi chú lý do.'}
            </p>
            <button
              onClick={() => setReasonBook(null)}
              className="mt-4 w-full rounded-radius-md border border-border py-2 text-sm font-semibold text-text hover:bg-border/30"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {modalBook && (
        <BookFormModal
          book={modalBook === 'new' ? undefined : modalBook}
          onClose={() => setModalBook(null)}
          onSaved={handleBookSaved}
        />
      )}
    </>
  )
}