export interface OrderItem {
    book_id: number
    unit_price: string
    quantity: number
    book: {
        title: string
        cover_image: string | null
    }
}

export interface Order {
    order_id: number
    order_code: string
    total_amount: string
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
    created_at: string | null
    order_item: OrderItem[]
}