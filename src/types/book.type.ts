export type BookApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'UPDATE_REQUIRED'

export interface StaffBook {
    book_id: number
    title: string
    description: string | null
    price: string
    file_url: string | null
    cover_image: string | null
    approval_status: BookApprovalStatus
    submitted_at: string | null
    approved_at: string | null
    rejection_reason: string | null
    created_at: string
    book_major: {
        major: {
            major_id: number
            major_name: string
        }
    }[]
}

export interface Book {
    book_id: number
    title: string
}

export interface StoreBookAuthor {
    lecturer: {
        full_name: string
    }
}

export interface StoreBookMajor {
    major: {
        major_id: number
        major_name: string
        major_code: string
    }
}

export interface StoreBook {
    book_id: number
    title: string
    description: string | null
    price: string
    cover_image: string | null
    pages: number | null
    created_at: string
    book_author: StoreBookAuthor[]
    book_major: StoreBookMajor[]
    is_owned: boolean
    has_pending_order: boolean
}

export interface StoreBookListResponse {
    books: StoreBook[]
    total: number
    page: number
    limit: number
}

export type BookSortBy = 'price' | 'created_at' | 'title'
export type SortOrder = 'asc' | 'desc'
export type PurchaseFilter = 'all' | 'unpurchased' | 'purchased'
export type LayoutMode = 'grid' | 'list'

export interface BookQueryParams {
    search?: string
    categoryId?: number
    page?: number
    limit?: number
    sortBy?: BookSortBy
    sortOrder?: SortOrder
    purchaseFilter?: PurchaseFilter
    ids?: number[]
}

export interface AdminPendingBook {
    book_id: number
    title: string
    description: string | null
    price: string
    cover_image: string | null
    file_url: string | null
    submitted_at: string | null
    created_at: string
    book_author: {
        lecturer: {
            full_name: string
            lecturer_code: string
        }
    }[]
    book_major: {
        major: {
            major_id: number
            major_code: string
        }
    }[]
    book_version_history: {
        version_number: string
        change_log: string | null
        submitted_at: string | null
    }[]
}

export interface AdminManagedBook {
    book_id: number
    title: string
    description: string | null
    price: string
    cover_image: string | null
    file_url: string | null
    approval_status: 'APPROVED' | 'PENDING'
    is_archived: boolean
    submitted_at: string | null
    approved_at: string | null
    created_at: string
    book_author: {
        lecturer: {
            full_name: string
            lecturer_code: string
        }
    }[]
    book_major: {
        major: {
            major_id: number
            major_code: string
        }
    }[]
}