'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BookCover from '@components/book-cover'
import StudentShell from '@layouts/student-shell/student-shell'
import { useCart } from '@providers/cart-provider'
import { useOrders } from '@providers/orders-provider'
import { bookService } from '@services/book.service'
import { ordersService } from '@services/orders.service'
import { StoreBook } from '@app-types/book.type'
import { formatCurrency } from '@utils/currency'
import { getCheckoutPath } from '@utils/checkout'

type PageStatus = 'loading' | 'error' | 'success'

export default function CartPage() {
    const router = useRouter()
    const { bookIds, ready, removeItem, removeItems } = useCart()
    const { refresh: refreshOrders } = useOrders()

    const [items, setItems] = useState<StoreBook[]>([])
    const [status, setStatus] = useState<PageStatus>('loading')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [removedCount, setRemovedCount] = useState(0)

    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const selectAllRef = useRef<HTMLInputElement>(null)
    const isFirstLoadRef = useRef(true)

    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    useEffect(() => {
        if (!ready) return

        if (bookIds.length === 0) {
            setItems([])
            setStatus('success')
            return
        }

        let cancelled = false
        setStatus('loading')
        setErrorMessage(null)

        bookService.getBooks({ ids: bookIds })
            .then((res) => {
                if (cancelled) return

                const returnedIds = res.books.map((b) => b.book_id)
                const missingIds = bookIds.filter((id) => !returnedIds.includes(id))

                if (missingIds.length > 0) {
                    removeItems(missingIds)
                    setRemovedCount(missingIds.length)
                }

                setItems(res.books)

                if (isFirstLoadRef.current) {
                    const validIds = res.books
                        .filter((b) => !b.is_owned && !b.has_pending_order)
                        .map((b) => b.book_id)
                    setSelectedIds(validIds)
                    isFirstLoadRef.current = false
                } else {
                    setSelectedIds((prev) => prev.filter((id) => res.books.some((b) => b.book_id === id)))
                }

                setStatus('success')
            })
            .catch((err) => {
                if (cancelled) return
                console.error(err)
                setErrorMessage('Không tải được giỏ hàng. Vui lòng thử lại.')
                setStatus('error')
            })

        return () => {
            cancelled = true
        }
    }, [ready, bookIds, removeItems])

    const validItems = useMemo(
        () => items.filter((b) => !b.is_owned && !b.has_pending_order),
        [items]
    )
    const ownedItems = useMemo(() => items.filter((b) => b.is_owned), [items])
    const pendingOrderItems = useMemo(
        () => items.filter((b) => !b.is_owned && b.has_pending_order),
        [items]
    )
    const selectedValidItems = useMemo(
        () => validItems.filter((b) => selectedIds.includes(b.book_id)),
        [validItems, selectedIds]
    )
    const total = useMemo(
        () => selectedValidItems.reduce((sum, b) => sum + parseFloat(b.price), 0),
        [selectedValidItems]
    )

    const allChecked = items.length > 0 && selectedIds.length === items.length
    const someChecked = selectedIds.length > 0 && !allChecked

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someChecked
        }
    }, [someChecked])

    const toggleItem = (bookId: number) => {
        setSelectedIds((prev) =>
            prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
        )
    }

    const toggleSelectAll = () => {
        setSelectedIds(allChecked ? [] : items.map((b) => b.book_id))
    }

    const handleRemove = (bookId: number) => {
        removeItem(bookId)
    }

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return
        removeItems(selectedIds)
        setSelectedIds([])
    }

    const handleCheckout = async () => {
        if (selectedValidItems.length === 0) return
        setCheckoutError(null)
        setCheckoutLoading(true)
        try {
            const order = await ordersService.createOrder(selectedValidItems.map((b) => b.book_id))
            router.push(getCheckoutPath(order.order_code, order.total_amount))
            removeItems(selectedValidItems.map((b) => b.book_id))
            refreshOrders()
        } catch (err) {
            console.error(err)
            setCheckoutError('Không thể tạo đơn hàng. Vui lòng thử lại.')
            setCheckoutLoading(false)
        }
    }

    return (
        <StudentShell>
            {status === 'loading' && (
                <div className="max-w-6xl mx-auto py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang tải giỏ hàng...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="max-w-6xl mx-auto py-16 text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{errorMessage}</p>
                    <button
                        type="button"
                        onClick={() => setStatus('loading')}
                        className="py-2 px-4 rounded bg-blue-600 text-white text-sm font-semibold"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {checkoutLoading && (
                <div className="max-w-6xl mx-auto py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang chuyển đến cổng thanh toán...</p>
                </div>
            )}

            {!checkoutLoading && status === 'success' && items.length === 0 && (
                <div className="max-w-6xl mx-auto py-16 text-center">
                    <p className="text-slate-600 dark:text-slate-400 font-semibold mb-4">Giỏ hàng của bạn đang trống</p>
                    <Link
                        href="/student/store"
                        className="inline-block py-2 px-4 rounded bg-blue-600 text-white text-sm font-semibold"
                    >
                        Khám phá thư viện
                    </Link>
                </div>
            )}

            {!checkoutLoading && status === 'success' && items.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {items.length} giáo trình trong giỏ · {validItems.length} hợp lệ
                        </p>
                    </div>

                    {removedCount > 0 && (
                        <div className="mb-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm">
                            {removedCount} giáo trình không còn khả dụng và đã được loại khỏi giỏ hàng.
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <section className="flex-[2] min-w-0 w-full">
                            <div className="flex items-center justify-between flex-wrap gap-2 py-3 border-b border-slate-200 dark:border-slate-700">
                                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <input
                                        ref={selectAllRef}
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <span>Chọn tất cả</span>
                                    <span className="text-slate-400">({selectedIds.length}/{items.length})</span>
                                </label>
                                {selectedIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteSelected}
                                        className="text-sm font-semibold text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded px-3 py-1.5"
                                    >
                                        Xóa các mục đã chọn
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 mt-4">
                                {validItems.map((book) => (
                                    <div key={book.book_id} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(book.book_id)}
                                            onChange={() => toggleItem(book.book_id)}
                                            className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
                                        />
                                        <div className="w-20 flex-shrink-0">
                                            <div className="aspect-[3/4] relative">
                                                <BookCover coverImage={book.cover_image} title={book.title} inset="inset-1" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium line-clamp-2">{book.title}</h3>
                                            <p className="mt-1 font-semibold">{formatCurrency(book.price)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(book.book_id)}
                                            className="text-sm text-red-600 dark:text-red-400 font-semibold"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}

                                {ownedItems.map((book) => (
                                    <div key={book.book_id} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg opacity-60">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(book.book_id)}
                                            onChange={() => toggleItem(book.book_id)}
                                            className="w-4 h-4 mt-1 accent-blue-600 cursor-pointer flex-shrink-0"
                                        />
                                        <div className="w-20 flex-shrink-0">
                                            <div className="aspect-[3/4] relative">
                                                <BookCover coverImage={book.cover_image} title={book.title} inset="inset-1" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium line-clamp-2">{book.title}</h3>
                                            <span className="inline-block mt-1 -rotate-1 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border border-dashed border-emerald-600 text-emerald-700 dark:text-emerald-300 dark:border-emerald-400">
                                                Đã sở hữu
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(book.book_id)}
                                            className="text-sm text-red-600 dark:text-red-400 font-semibold self-start"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}

                                {pendingOrderItems.map((book) => (
                                    <div key={book.book_id} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg opacity-60">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(book.book_id)}
                                            onChange={() => toggleItem(book.book_id)}
                                            className="w-4 h-4 mt-1 accent-blue-600 cursor-pointer flex-shrink-0"
                                        />
                                        <div className="w-20 flex-shrink-0">
                                            <div className="aspect-[3/4] relative">
                                                <BookCover coverImage={book.cover_image} title={book.title} inset="inset-1" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium line-clamp-2">{book.title}</h3>
                                            <div className="rotate-1 inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border border-dashed border-amber-600 text-amber-700 dark:text-amber-300 dark:border-amber-400">
                                                Đang chờ thanh toán
                                            </div>
                                            <Link
                                                href="/student/purchase-history"
                                                className="block mt-1 text-xs text-amber-700 dark:text-amber-300 underline"
                                            >
                                                Xem lịch sử mua hàng →
                                            </Link>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(book.book_id)}
                                            className="text-sm text-red-600 dark:text-red-400 font-semibold self-start"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-6">
                            <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                <h3 className="font-bold mb-4">Thông tin đơn hàng</h3>

                                <div className="flex justify-between items-baseline text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <span>Số giáo trình thanh toán</span>
                                    <span>{selectedValidItems.length} giáo trình</span>
                                </div>

                                <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-4" />

                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-semibold">Tổng tiền</span>
                                    <span className="text-xl font-bold">{formatCurrency(total)}</span>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
                                Giáo trình sẽ có trong "Giáo trình của tôi" ngay sau khi thanh toán thành công.
                                </p>

                                {checkoutError && (
                                    <p className="mb-3 text-sm text-red-600 dark:text-red-400">{checkoutError}</p>
                                )}

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    disabled={selectedValidItems.length === 0 || checkoutLoading}
                                    className="w-full py-3 rounded bg-orange-600 text-white font-semibold disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                                >
                                    {checkoutLoading ? 'Đang xử lý...' : selectedValidItems.length === 0 ? 'Chưa chọn giáo trình nào để thanh toán' : 'Tiến hành thanh toán'}
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            )}
        </StudentShell>
    )
}