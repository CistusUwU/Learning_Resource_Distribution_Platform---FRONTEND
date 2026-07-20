'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BookCover from '@components/book-cover'
import { useCart } from '@providers/cart-provider'
import { bookService } from '@services/book.service'
import { ordersService } from '@services/orders.service'
import { StoreBook } from '@app-types/book.type'
import { formatCurrency } from '@utils/currency'
import { getCheckoutPath } from '@utils/checkout'

type PageStatus = 'loading' | 'error' | 'success'

export default function CartPage() {
    const router = useRouter()
    const { bookIds, ready, removeItem, removeItems } = useCart()

    const [items, setItems] = useState<StoreBook[]>([])
    const [status, setStatus] = useState<PageStatus>('loading')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [removedCount, setRemovedCount] = useState(0)

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

    const validItems = items.filter((b) => !b.is_owned)
    const ownedItems = items.filter((b) => b.is_owned)
    const total = validItems.reduce((sum, b) => sum + parseFloat(b.price), 0)

    const handleRemove = (bookId: number) => {
        removeItem(bookId)
    }

    const handleCheckout = async () => {
        if (validItems.length === 0) return
        setCheckoutError(null)
        setCheckoutLoading(true)
        try {
            const order = await ordersService.createOrder(validItems.map((b) => b.book_id))
            removeItems(validItems.map((b) => b.book_id))
            router.push(getCheckoutPath(order.order_code, order.total_amount))
        } catch (err) {
            console.error(err)
            setCheckoutError('Không thể tạo đơn hàng. Vui lòng thử lại.')
            setCheckoutLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="max-w-4xl mx-auto py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang tải giỏ hàng...</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="max-w-4xl mx-auto py-16 text-center">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{errorMessage}</p>
                <button
                    type="button"
                    onClick={() => setStatus('loading')}
                    className="py-2 px-4 rounded bg-blue-600 text-white text-sm font-semibold"
                >
                    Thử lại
                </button>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-16 text-center">
                <p className="text-slate-600 dark:text-slate-400 font-semibold mb-4">Giỏ hàng của bạn đang trống</p>
                <Link
                    href="/student/store"
                    className="inline-block py-2 px-4 rounded bg-blue-600 text-white text-sm font-semibold"
                >
                    Khám phá thư viện
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

            {removedCount > 0 && (
                <div className="mb-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm">
                    {removedCount} sách không còn khả dụng và đã được loại khỏi giỏ hàng.
                </div>
            )}

            <div className="space-y-4">
                {validItems.map((book) => (
                    <div key={book.book_id} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
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
                            className="text-sm text-red-600 dark:text-red-400 font-semibold self-start"
                        >
                            Xóa
                        </button>
                    </div>
                ))}

                {ownedItems.map((book) => (
                    <div key={book.book_id} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg opacity-60">
                        <div className="w-20 flex-shrink-0">
                            <div className="aspect-[3/4] relative">
                                <BookCover coverImage={book.cover_image} title={book.title} inset="inset-1" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium line-clamp-2">{book.title}</h3>
                            <span className="inline-block mt-1 text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                Đã sở hữu — không tính vào thanh toán
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
            </div>

            <div className="mt-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Tổng thanh toán ({validItems.length} sách)</span>
                    <span className="text-xl font-bold">{formatCurrency(total)}</span>
                </div>

                {checkoutError && (
                    <p className="mb-3 text-sm text-red-600 dark:text-red-400">{checkoutError}</p>
                )}

                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={validItems.length === 0 || checkoutLoading}
                    className="w-full py-3 rounded bg-orange-600 text-white font-semibold disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                    {checkoutLoading ? 'Đang xử lý...' : validItems.length === 0 ? 'Không có sách nào cần thanh toán' : 'Thanh toán'}
                </button>
            </div>
        </div>
    )
}