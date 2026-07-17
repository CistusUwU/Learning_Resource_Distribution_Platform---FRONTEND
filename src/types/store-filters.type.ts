import type { BookSortBy, SortOrder, PurchaseFilter, LayoutMode } from './book.type'
import type { Category } from './category.type'

export interface StoreFiltersProps {
    search: string
    categoryId: number | undefined
    sortBy: BookSortBy
    sortOrder: SortOrder
    purchaseFilter: PurchaseFilter
    layout: LayoutMode
    categories: Category[]
    onChange: (updates: Record<string, string | number | undefined>) => void
}