'use client'

import { useOrders } from "@providers/orders-provider"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { toNotification } from "@utils/order"

const LAST_SEEN_KEY = 'lrdp_notifications_last_seen'

function readLastSeen(): number {
    if (typeof window === 'undefined') return 0
    try {
        const raw = localStorage.getItem(LAST_SEEN_KEY)
        return raw ? Number(raw) : 0
    } catch {
        return 0
    }
}

export function HeaderNotifications() {
    const { orders: rawOrders, loading, error } = useOrders()
    const [open, setOpen] = useState(false)
    const [lastSeen, setLastSeen] = useState<number>(readLastSeen)
    const panelRef = useRef<HTMLDivElement>(null)

    const orders = useMemo(
        () =>
            [...rawOrders].sort((a, b) => {
                const t1 = a.created_at ? new Date(a.created_at).getTime() : 0
                const t2 = b.created_at ? new Date(b.created_at).getTime() : 0
                return t2 - t1
            }),
        [rawOrders]
    )

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleToggle = () => {
        setOpen((v) => {
            const next = !v
            if (next) {
                const now = Date.now()
                setLastSeen(now)
                try {
                    localStorage.setItem(LAST_SEEN_KEY, String(now))
                } catch {}
            }
            return next
        })
    }

    const items = useMemo(() => orders.slice(0, 15).map(toNotification), [orders])

    const unreadCount = useMemo(
        () => orders.filter((o) => o.created_at && new Date(o.created_at).getTime() > lastSeen).length,
        [orders, lastSeen]
    )

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={handleToggle}
                className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                title="Thông báo"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[min(24rem,70vh)] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl z-50 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Thông báo</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 min-h-0">
                        {loading && (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">Đang tải…</div>
                        )}
                        {!loading && error && (
                            <div className="p-4 text-center text-red-600 dark:text-red-400 text-sm">{error}</div>
                        )}
                        {!loading && !error && items.length === 0 && (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">Chưa có thông báo</div>
                        )}
                        {!loading && !error && items.length > 0 && (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                                {items.map((n) => (
                                    <li key={n.id}>
                                        <Link
                                            href={n.link}
                                            onClick={() => setOpen(false)}
                                            className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                        >
                                            <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">{n.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                                            {n.time && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {items.length > 0 && (
                        <div className="border-t border-slate-200 dark:border-slate-700 p-2 shrink-0">
                            <Link
                                href="/student/purchase-history"
                                onClick={() => setOpen(false)}
                                className="block text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Xem tất cả đơn hàng
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}