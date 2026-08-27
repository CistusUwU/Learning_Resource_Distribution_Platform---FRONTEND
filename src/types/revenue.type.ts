export interface LecturerRevenueStat {
    lecturer_id: number
    lecturer: {
        full_name: string
        lecturer_code: string
    }
    totalEarned: number
    totalPending: number
    totalPaid: number
    bookCount: number
}

export interface LecturerTransaction {
    id: string
    gross_amount: number
    share_percent: string
    earned_amount: number
    status: 'PENDING' | 'PAID'
    created_at: string
    paid_at: string | null
    book: {
        book_id: number
        title: string
    }
    student: {
        full_name: string
        student_code: string
    } | null
}

export interface PayoutBatch {
    id: string
    month: number
    year: number
    total_amount: number
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED'
    note: string | null
    processed_at: string | null
    created_at: string
}

export interface MyRevenueRecord {
    id: string
    gross_amount: number
    share_percent: number
    earned_amount: number
    status: 'PENDING' | 'PAID'
    created_at: string
    paid_at: string | null
    book: {
        book_id: number
        title: string
        cover_image: string | null
    }
}

export interface MyRevenueData {
    totalEarned: number
    totalPending: number
    totalPaid: number
    records: MyRevenueRecord[]
}