export default function Pagination({
    page,
    totalPages,
    onPageChange,
  }: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }) {
    if (totalPages <= 1) return null
  
    return (
      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-radius-md border border-border px-3 py-1.5 text-sm font-semibold text-text disabled:opacity-40 hover:bg-border/30 transition-colors"
        >
          Trước
        </button>
  
        <span className="text-sm text-text-secondary px-2">
          Trang {page} / {totalPages}
        </span>
  
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-radius-md border border-border px-3 py-1.5 text-sm font-semibold text-text disabled:opacity-40 hover:bg-border/30 transition-colors"
        >
          Sau
        </button>
      </div>
    )
  }