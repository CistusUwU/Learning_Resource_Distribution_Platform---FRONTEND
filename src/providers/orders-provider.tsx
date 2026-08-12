'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { ordersService } from '@services/orders.service'
import { Order } from '@app-types/order.type'

const POLL_INTERVAL_MS = 60_000
const RECENT_LIMIT = 15

interface OrdersContextValue {
    orders: Order[]
    pendingCount: number
    loading: boolean
    error: string | null
    refresh: () => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([])
    const [pendingCount, setPendingCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchOrders = () => {
        setError(null)
        Promise.all([
            ordersService.getMyOrders({ limit: RECENT_LIMIT }),
            ordersService.getMyOrders({ status: 'PENDING', limit: 1 }),
        ])
            .then(([recent, pending]) => {
                setOrders(recent.items)
                setPendingCount(pending.total)
            })
            .catch((e) => setError(e instanceof Error ? e.message : 'Không tải được đơn hàng'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchOrders()
        intervalRef.current = setInterval(fetchOrders, POLL_INTERVAL_MS)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <OrdersContext.Provider value={{ orders, pendingCount, loading, error, refresh: fetchOrders }}>
            {children}
        </OrdersContext.Provider>
    )
}

export function useOrders() {
    const context = useContext(OrdersContext)
    if (!context) {
        throw new Error('useOrders phải được dùng bên trong OrdersProvider')
    }
    return context
}