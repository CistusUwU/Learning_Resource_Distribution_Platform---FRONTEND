export function getCheckoutPath(orderCode: string, totalAmount: string): string {
    const n = parseFloat(totalAmount)
    const amount = Number.isFinite(n) && n > 0 ? Math.round(n) : 0
    const q = new URLSearchParams()
    q.set('orderId', orderCode)
    q.set('amount', String(amount))
    return `/student/payment/checkout?${q.toString()}`
}