'use client'

import { useEffect, useRef, useState } from 'react'
import { staffService } from '@services/staff.service'
import { categoryService } from '@services/category.service'
import type { Category } from '@app-types/category.type'
import type { StaffBook } from '@app-types/book.type'

export default function BookFormModal({
  book,
  onClose,
  onSaved,
}: {
  book?: StaffBook
  onClose: () => void
  onSaved: (book: StaffBook) => void
}) {
  const isEdit = !!book

  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState(book?.title ?? '')
  const [description, setDescription] = useState(book?.description ?? '')
  const [price, setPrice] = useState(book ? String(Math.round(Number(book.price))) : '')
  const [priceFocused, setPriceFocused] = useState(false)
  const [majorIds, setMajorIds] = useState<number[]>(book?.book_major.map((bm) => bm.major.major_id) ?? [])
  const [majorQuery, setMajorQuery] = useState('')
  const [majorDropdownOpen, setMajorDropdownOpen] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const majorBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (majorBoxRef.current && !majorBoxRef.current.contains(e.target as Node)) {
        setMajorDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    setPrice(digits)
  }

  const displayPrice = priceFocused ? price : price ? Number(price).toLocaleString('vi-VN') : ''

  const filteredCategories = categories.filter(
    (c) => !majorIds.includes(c.major_id) && c.major_name.toLowerCase().includes(majorQuery.toLowerCase())
  )

  function selectMajor(id: number) {
    setMajorIds((prev) => [...prev, id])
    setMajorQuery('')
    setMajorDropdownOpen(false)
  }

  function removeMajor(id: number) {
    setMajorIds((prev) => prev.filter((m) => m !== id))
  }

  function findMajorName(id: number) {
    return (
      categories.find((c) => c.major_id === id)?.major_name ??
      book?.book_major.find((bm) => bm.major.major_id === id)?.major.major_name
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Vui lòng nhập tên giáo trình')
      return
    }
    if (!price || Number(price) < 1000) {
      setError('Giá phải từ 1.000đ trở lên')
      return
    }
    if (majorIds.length === 0) {
      setError('Vui lòng chọn ít nhất 1 ngành')
      return
    }
    if (!isEdit && !pdfFile) {
      setError('Vui lòng chọn file PDF')
      return
    }

    try {
      setSubmitting(true)

      let file_url: string | undefined = book?.file_url ?? undefined
      if (pdfFile) {
        const pdfResult = await staffService.uploadPdf(pdfFile)
        file_url = pdfResult.file_url
      }

      let cover_image: string | undefined = book?.cover_image ?? undefined
      if (coverFile) {
        const coverResult = await staffService.uploadCover(coverFile)
        cover_image = coverResult.cover_image
      }

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        file_url,
        cover_image,
        majorIds,
      }

      const saved = isEdit
        ? await staffService.updateBook(book!.book_id, payload)
        : await staffService.createBook({ ...payload, file_url: file_url as string })

      onSaved(saved)
    } catch (err) {
      console.error(err)
      setError(isEdit ? 'Cập nhật giáo trình thất bại. Vui lòng thử lại.' : 'Tạo giáo trình thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-surface rounded-radius-lg border border-border p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-lg text-text mb-4">{isEdit ? 'Sửa giáo trình' : 'Tạo giáo trình mới'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1">Tên giáo trình</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
              placeholder="Ví dụ: Giải Phẫu Người"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1">Mô tả (không bắt buộc)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1">Giá (đ)</label>
            <input
              type="text"
              inputMode="numeric"
              value={displayPrice}
              onChange={handlePriceChange}
              onFocus={() => setPriceFocused(true)}
              onBlur={() => setPriceFocused(false)}
              className="w-full rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
              placeholder="150.000"
            />
          </div>

          <div className="relative" ref={majorBoxRef}>
            <label className="block text-sm font-semibold text-text mb-1">Ngành</label>

            {majorIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {majorIds.map((id) => {
                  const name = findMajorName(id)
                  if (!name) return null
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-radius-pill bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeMajor(id)}
                        className="hover:text-error"
                        aria-label={`Bỏ chọn ${name}`}
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            )}

            <input
              type="text"
              value={majorQuery}
              onChange={(e) => {
                setMajorQuery(e.target.value)
                setMajorDropdownOpen(true)
              }}
              onFocus={() => setMajorDropdownOpen(true)}
              placeholder="Gõ để tìm ngành..."
              className="w-full rounded-radius-md border border-border px-3 py-2 text-sm bg-background text-text"
            />

            {majorDropdownOpen && filteredCategories.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-surface border border-border rounded-radius-md shadow-lg max-h-48 overflow-y-auto">
                {filteredCategories.map((c) => (
                  <button
                    key={c.major_id}
                    type="button"
                    onClick={() => selectMajor(c.major_id)}
                    className="block w-full text-left px-3 py-2 text-sm text-text hover:bg-border/30"
                  >
                    {c.major_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              File PDF{' '}
              {isEdit && <span className="font-normal text-text-secondary">(để trống nếu giữ nguyên file cũ)</span>}
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-text"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Ảnh bìa{' '}
              {isEdit ? (
                <span className="font-normal text-text-secondary">(để trống nếu giữ nguyên ảnh cũ)</span>
              ) : (
                '(không bắt buộc)'
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-text"
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-radius-md border border-border py-2 text-sm font-semibold text-text hover:bg-border/30 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-radius-md bg-primary text-white py-2 text-sm font-bold hover:bg-primary-hover disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo giáo trình'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}