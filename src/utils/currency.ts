export function formatCurrency(price: string | number): string {
    const numericPrice = typeof price === 'string' ? Number(price) : price
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(numericPrice)
}