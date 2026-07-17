export interface StorePaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}