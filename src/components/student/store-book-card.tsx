'use client'

import Link from 'next/link'
import BookCover from '@components/book-cover'
import { StoreBook, LayoutMode } from '@app-types/book.type'
import { formatCurrency } from '@utils/currency'
import { useCart } from '@providers/cart-provider'

export default function StoreBookCard({ book, layout }: { book: StoreBook; layout: LayoutMode }) {
    const authorNames = book.book_author.map((a) => a.lecturer.full_name).join(', ')
    const { addItem, isInCart } = useCart()
    const inCart = isInCart(book.book_id)

    const handleAddToCart = () => {
        if (inCart || book.has_pending_order) return
        addItem(book.book_id)
    }

    const renderActionButton = (fullWidthClass: string) => {
        if (book.is_owned) {
            return (
                <Link
                    href={`/student/books/${book.book_id}`}
                    className={`${fullWidthClass} py-2 rounded bg-emerald-600 text-white text-sm font-semibold text-center`}
                >
                    Đọc ngay
                </Link>
            )
        }
        if (book.has_pending_order) {
            return (
                <Link
                    href="/student/purchase-history"
                    className={`${fullWidthClass} py-2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold text-center`}
                >
                    Đang chờ thanh toán
                </Link>
            )
        }
        if (inCart) {
            return (
                <Link
                    href="/student/cart"
                    className={`${fullWidthClass} py-2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold text-center`}
                >
                    Đã có trong giỏ
                </Link>
            )
        }
        return (
            <button
                type="button"
                onClick={handleAddToCart}
                className={`${fullWidthClass} py-2 rounded bg-blue-600 text-white text-sm font-semibold`}
            >
                Thêm vào giỏ
            </button>
        )
    }

    if (layout === 'list') {
        return (
            <div className="flex gap-4 py-4">
                <Link href={`/student/store/${book.book_id}`} className="w-40 flex-shrink-0">
                    <div className="aspect-[3/4] relative">
                        <BookCover coverImage={book.cover_image} title={book.title} inset="inset-1.5"/>
                        {book.is_owned && (
                            <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                Đã mua
                            </span>
                        )}
                    </div>
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/student/store/${book.book_id}`}>
                        <h3 className="font-medium line-clamp-2">{book.title}</h3>
                    </Link>
                    {authorNames && (
                        <p className="text-sm text-slate-500 line-clamp-1">{authorNames}</p>
                    )}
                    {book.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{book.description}</p>
                    )}
                    <p className="mt-2 font-semibold">{formatCurrency(book.price)}</p>
                </div>
                <div className="flex flex-col gap-2 justify-center flex-shrink-0 w-40">
                    <Link
                        href={`/student/store/${book.book_id}`}
                        className="py-2 px-4 rounded border border-slate-300 dark:border-slate-600 text-sm font-semibold text-center whitespace-nowrap"
                    >
                        Xem chi tiết
                    </Link>
                    {renderActionButton('w-full')}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <Link href={`/student/store/${book.book_id}`} className="block group">
                <div className="aspect-[3/4] relative">
                    <BookCover coverImage={book.cover_image} title={book.title} />
                    {book.is_owned && (
                        <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            Đã mua
                        </span>
                    )}
                </div>
                <h3 className="mt-2 font-medium line-clamp-2 min-h-[3rem]">{book.title}</h3>
                {authorNames && (
                    <p className="text-sm text-slate-500 line-clamp-1">{authorNames}</p>
                )}
                <p className="mt-1 font-semibold">{formatCurrency(book.price)}</p>
            </Link>
            <div className="mt-2 flex gap-2">
                <Link
                    href={`/student/store/${book.book_id}`}
                    className="flex-1 py-2 rounded border border-slate-300 dark:border-slate-600 text-sm font-semibold text-center"
                >
                    Xem chi tiết
                </Link>
                {renderActionButton('flex-1')}
            </div>
        </div>
    )
}