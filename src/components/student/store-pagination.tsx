interface StorePaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function StorePagination({ page, totalPages, onPageChange }: StorePaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
            >
                Trước
            </button>

            <span className="text-sm">
                Trang {page} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40"
            >
                Sau
            </button>
        </div>
    )
}