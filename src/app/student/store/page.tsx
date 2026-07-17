'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { bookService } from '@services/book.service'
import { categoryService } from '@services/category.service'
import { StoreBook } from '@app-types/book.type'
import { Category } from '@app-types/category.type'
import StoreBookCard from '@components/student/store-book-card'
import StoreFilters from '@components/student/store-filters'
import StorePagination from '@components/student/store-pagination'
import StudentShell from '@layouts/student-shell/student-shell'
import { parseEnumParam } from '@utils/url-params'

const DEFAULT_LIMIT = 20

export default function StorePage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const search = searchParams.get('search') ?? ''

    const categoryIdParam = searchParams.get('categoryId')
    const parsedCategoryId = categoryIdParam ? Number(categoryIdParam) : NaN
    const categoryId = Number.isFinite(parsedCategoryId) ? parsedCategoryId : undefined

    const parsedPage = Number(searchParams.get('page') ?? '1')
    const page = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1

    const sortBy = parseEnumParam(searchParams.get('sortBy'), ['price', 'created_at', 'title'] as const, 'created_at')
    const sortOrder = parseEnumParam(searchParams.get('sortOrder'), ['asc', 'desc'] as const, 'desc')
    const purchaseFilter = parseEnumParam(searchParams.get('purchaseFilter'), ['all', 'unpurchased', 'purchased'] as const, 'all')
    const layout = parseEnumParam(searchParams.get('layout'), ['grid', 'list'] as const, 'grid')

    const [books, setBooks] = useState<StoreBook[]>([])
    const [total, setTotal] = useState(0)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const updateParams = useCallback(
        (updates: Record<string, string | number | undefined>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value === undefined || value === '') {
                    params.delete(key)
                } else {
                    params.set(key, String(value))
                }
            })

            const isDataAffectingChange = Object.keys(updates).some((key) => key !== 'page' && key !== 'layout')
            if (isDataAffectingChange && !('page' in updates)) {
                params.set('page', '1')
            }

            router.push(`${pathname}?${params.toString()}`)
        },
        [router, pathname, searchParams]
    )

    useEffect(() => {
        categoryService
            .getCategories()
            .then(setCategories)
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        setLoading(true)
        setError(null)

        bookService
            .getBooks({
                search: search || undefined,
                categoryId,
                page,
                limit: DEFAULT_LIMIT,
                sortBy,
                sortOrder,
                purchaseFilter,
            })
            .then((res) => {
                setBooks(res.books)
                setTotal(res.total)
            })
            .catch((err) => {
                console.error(err)
                setError('Không thể tải danh sách sách. Vui lòng thử lại.')
            })
            .finally(() => setLoading(false))
    }, [search, categoryId, page, sortBy, sortOrder, purchaseFilter])

    const totalPages = Math.ceil(total / DEFAULT_LIMIT)

    return (
        <StudentShell>
            <div>
                <StoreFilters
                    search={search}
                    categoryId={categoryId}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    purchaseFilter={purchaseFilter}
                    layout={layout}
                    categories={categories}
                    onChange={updateParams}
                />
    
                <div className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
                    {error ? (
                        <p>{error}</p>
                    ) : books.length === 0 ? (
                        <p>Không tìm thấy sách nào.</p>
                    ) : layout === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {books.map((book) => (
                                <StoreBookCard key={book.book_id} book={book} layout="grid" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {books.map((book) => (
                                <StoreBookCard key={book.book_id} book={book} layout="list" />
                            ))}
                        </div>
                    )}
                </div>
    
                <StorePagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateParams({ page: newPage })}
                />
            </div>
        </StudentShell>
    )
}