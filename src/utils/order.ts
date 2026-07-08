import { Order } from "@/types/order.type"
import { getCheckoutPath } from "@/utils/checkout"

import { formatTime } from "@/utils/date"

function formatOrderStatus(status: string): string {
    if (status === 'COMPLETED') return 'Đã thanh toán'
    if (status === 'PENDING') return 'Đang chờ thanh toán'
    if (status === 'CANCELLED') return 'Đã hủy'
    if (status === 'REFUNDED') return 'Đã hoàn tiền'
    return status
}

export interface NotificationItem {
    id: string
    title: string
    message: string
    link: string
    time: string
}

export function toNotification(o: Order): NotificationItem {
    const isPending = o.status === 'PENDING'
    return {
        id: `order-${o.order_id}`,
        title: `Đơn hàng #${o.order_code}`,
        message: formatOrderStatus(o.status),
        link: isPending ? getCheckoutPath(o.order_code, o.total_amount) : '/student/purchase-history',
        time: formatTime(o.created_at),
    }
}