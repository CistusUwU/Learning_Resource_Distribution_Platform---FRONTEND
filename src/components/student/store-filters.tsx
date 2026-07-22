'use client'

import { ChevronDown } from 'lucide-react'
import { BookSortBy, SortOrder, PurchaseFilter, LayoutMode } from '@app-types/book.type'
import { Category } from '@app-types/category.type'
import { StoreFiltersProps } from '@app-types/store-filters.type'

function StoreFilterSelect({
    value,
    onChange,
    children,
}: {
    value: string | number
    onChange: (value: string) => void
    children: React.ReactNode
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none w-full border rounded px-3 py-2 pr-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 dark:[color-scheme:dark]"
            >
                {children}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
    )
}

export default function StoreFilters({
    categoryId,
    sortBy,
    sortOrder,
    purchaseFilter,
    layout,
    categories,
    onChange,
}: StoreFiltersProps) {
    const handleSortChange = (value: string) => {
        const [newSortBy, newSortOrder] = value.split(':')
        onChange({ sortBy: newSortBy, sortOrder: newSortOrder })
    }

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <StoreFilterSelect
                value={categoryId ?? ''}
                onChange={(value) => onChange({ categoryId: value ? Number(value) : undefined })}
            >
                <option value="">Danh mục</option>
                {categories.map((cat) => (
                    <option key={cat.major_id} value={cat.major_id}>
                        {cat.major_name} ({cat._count.book_major})
                    </option>
                ))}
            </StoreFilterSelect>

            <StoreFilterSelect
                value={purchaseFilter}
                onChange={(value) => onChange({ purchaseFilter: value })}
            >
                <option value="all">Tất cả</option>
                <option value="unpurchased">Chưa mua</option>
                <option value="purchased">Đã mua</option>
            </StoreFilterSelect>

            <StoreFilterSelect
                value={`${sortBy}:${sortOrder}`}
                onChange={handleSortChange}
            >
                <option value="created_at:desc">Mới nhất</option>
                <option value="price:asc">Giá thấp → cao</option>
                <option value="price:desc">Giá cao → thấp</option>
                <option value="title:asc">Tên A-Z</option>
            </StoreFilterSelect>

            <div className="flex border rounded overflow-hidden border-slate-300 dark:border-slate-600">
                <button
                    type="button"
                    onClick={() => onChange({ layout: 'grid' })}
                    className={`px-3 py-2 text-sm font-semibold bg-white dark:bg-slate-800 ${
                        layout === 'grid'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                    Lưới
                </button>
                <button
                    type="button"
                    onClick={() => onChange({ layout: 'list' })}
                    className={`px-3 py-2 text-sm font-semibold bg-white dark:bg-slate-800 ${
                        layout === 'list'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                    Danh sách
                </button>
            </div>
        </div>
    )
}