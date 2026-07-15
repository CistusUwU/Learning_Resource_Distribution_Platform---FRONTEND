export type BookApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

export interface StaffBook {
    book_id: number
    title: string
    price: number
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