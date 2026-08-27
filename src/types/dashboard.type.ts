export interface AdminDashboardData {
    pending_books: number
    monthly_revenue: number
    unpaid_revenue: number
}

export interface StaffDashboardData {
    books: {
        draft: number
        pending: number
        approved: number
        rejected: number
        update_required?: number
    }
    monthly_revenue: number
    unpaid_revenue: number
}

export interface RevenueTrendPoint {
    month: number
    year: number
    revenue: number
}