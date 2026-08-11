'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BookRecordTable from '@components/staff/book-record-table'
import { staffService } from '@services/staff.service'
import type { StaffBook, BookApprovalStatus } from '@app-types/book.type'

const TABS: { label: string; value: BookApprovalStatus | 'ALL' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Bản nháp', value: 'DRAFT' },
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Cần chỉnh sửa', value: 'UPDATE_REQUIRED' },
  { label: 'Bị từ chối', value: 'REJECTED' },
]

export default function StaffBooksPage() {
  const [books, setBooks] = useState<StaffBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<BookApprovalStatus | 'ALL'>('ALL')
  const [submittingId, setSubmittingId] = useState<number | null>(null)
  const [reasonBook, setReasonBook] = useState<StaffBook | null>(null)

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true)
        const data = await staffService.getMyBooks()
        setBooks(data)
      } catch (err) {
        console.error(err)
        setError('Không thể tải danh sách sách. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

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
      const updated = await staffService.cancelSubmission(bookId)
      setBooks((prev) => prev.map((b) => (b.book_id === bookId ? updated : b)))
    } catch (err) {
      console.error(err)
      alert('Hủy nộp thất bại. Vui lòng thử lại.')
    } finally {
      setSubmittingId(null)
    }
  }

  const filteredBooks = activeTab === 'ALL' ? books : books.filter((b) => b.approval_status === activeTab)

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Quản lý sách</h1>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý, chỉnh sửa và theo dõi trạng thái các tài liệu học tập của bạn.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => {
              const count = tab.value === 'ALL' ? books.length : books.filter((b) => b.approval_status === tab.value).length
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-radius-pill text-sm font-semibold transition-colors ${
                    activeTab === tab.value ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              )
            })}
          </div>
          <button
            disabled
            title="Sắp ra mắt"
            className="inline-flex items-center gap-2 rounded-radius-md bg-primary text-white text-sm font-bold px-4 py-2 opacity-50 cursor-not-allowed whitespace-nowrap"
          >
            + Tạo sách mới
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

        {!loading && !error && filteredBooks.length === 0 && activeTab === 'ALL' && (
          <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
            <p className="font-semibold text-text">Bạn chưa có sách nào</p>
            <p className="text-sm text-text-secondary mt-1">Thêm tài liệu đầu tiên để bắt đầu xây dựng thư viện học tập của bạn.</p>
          </div>
        )}

        {!loading && !error && filteredBooks.length === 0 && activeTab !== 'ALL' && (
          <div className="bg-surface rounded-radius-lg border border-border text-center py-12">
            <p className="font-semibold text-text">Không có sách ở trạng thái này</p>
            <p className="text-sm text-text-secondary mt-1">Hãy thử chọn trạng thái khác để xem sách.</p>
            <button
              onClick={() => setActiveTab('ALL')}
              className="mt-3 rounded-radius-md border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-border/30"
            >
              Xem tất cả sách
            </button>
          </div>
        )}

        {!loading && !error && filteredBooks.length > 0 && (
          <BookRecordTable
            books={filteredBooks}
            renderActions={(book) => (
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/staff/books/${book.book_id}/preview`}
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  Xem trước
                </Link>
                {(book.approval_status === 'DRAFT' || book.approval_status === 'UPDATE_REQUIRED') && (
                  <button
                    onClick={() => handleSubmit(book.book_id)}
                    disabled={submittingId === book.book_id}
                    className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                  >
                    Nộp duyệt
                  </button>
                )}
                {book.approval_status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(book.book_id)}
                    disabled={submittingId === book.book_id}
                    className="text-xs font-semibold text-error hover:underline disabled:opacity-50"
                  >
                    Hủy nộp
                  </button>
                )}
                {book.approval_status === 'REJECTED' && (
                  <button
                    onClick={() => setReasonBook(book)}
                    className="text-xs font-semibold text-text-secondary hover:underline"
                  >
                    Xem lý do
                  </button>
                )}
              </div>
            )}
          />
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
    </>
  )
}