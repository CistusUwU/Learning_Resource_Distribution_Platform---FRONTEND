'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BookSortBy, SortOrder, PurchaseFilter, LayoutMode } from '@app-types/book.type'
import { Category } from '@app-types/category.type'

interface StoreFiltersProps {
    search: string
    categoryId: number | undefined
    sortBy: BookSortBy
    sortOrder: SortOrder
    purchaseFilter: PurchaseFilter
    layout: LayoutMode
    categories: Category[]
    onChange: (updates: Record<string, string | number | undefined>) => void
}

const DEBOUNCE_MS = 400

const SELECT_CLASS =
    'appearance-none w-full border rounded px-3 py-2 pr-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 dark:[color-scheme:dark]'

export default function StoreFilters({
    search,
    categoryId,
    sortBy,
    sortOrder,
    purchaseFilter,
    layout,
    categories,
    onChange,
}: StoreFiltersProps) {
    const [searchInput, setSearchInput] = useState(search)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (debounceRef.current) return
        setSearchInput(search)
    }, [search])

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value)

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            onChange({ search: value })
        }, DEBOUNCE_MS)
    }

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortOrder] = value.split(':')
        onChange({ sortBy: newSortBy, sortOrder: newSortOrder })
    }

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder="Tìm kiếm sách..."
                className="border rounded px-3 py-2 flex-1 min-w-[200px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border-slate-300 dark:border-slate-600"
            />
    
            <div className="relative">
                <select
                    value={categoryId ?? ''}
                    onChange={(e) =>
                        onChange({ categoryId: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className={SELECT_CLASS}
                >
                    <option value="">Danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.major_id} value={cat.major_id}>
                            {cat.major_name} ({cat._count.book_major})
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
    
            <div className="relative">
                <select
                    value={purchaseFilter}
                    onChange={(e) => onChange({ purchaseFilter: e.target.value })}
                    className={SELECT_CLASS}
                >
                    <option value="all">Tất cả</option>
                    <option value="unpurchased">Chưa mua</option>
                    <option value="purchased">Đã mua</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
    
            <div className="relative">
                <select
                    value={`${sortBy}:${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className={SELECT_CLASS}
                >
                    <option value="created_at:desc">Mới nhất</option>
                    <option value="price:asc">Giá thấp → cao</option>
                    <option value="price:desc">Giá cao → thấp</option>
                    <option value="title:asc">Tên A-Z</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
    
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