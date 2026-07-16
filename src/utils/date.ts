export function formatTime(input: string | number | null): string {
    if (input === null || input === undefined) return ''
    const d = new Date(input)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return d.toLocaleDateString('vi-VN')
}

export function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}