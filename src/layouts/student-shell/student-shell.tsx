'use client'

import { useAuth } from "@providers/auth-provider";
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from "react";
import { studentNavItems } from "@layouts/app-sidebar/student-nav-items";
import { AppSidebar } from "@layouts/app-sidebar/app-sidebar";
import { useSidebarCollapsed } from "@layouts/app-sidebar/use-sidebar-collapsed";
import { ThemeToggle } from "@components/theme-toggle";
import { HeaderNotifications } from "@components/student/header-notifications";
import { useOrders } from "@providers/orders-provider";
import { useCart } from "@providers/cart-provider";
import Link from "next/link";

export default function StudentShell({ children }: { children: ReactNode}) {
    const router = useRouter()
    const { user, isAuthenticated, loading, logout } = useAuth()
    const { count: cartCount } = useCart()
    const { pendingCount } = useOrders()
    const { collapsed, toggle: toggleCollapsed } = useSidebarCollapsed()
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        if (loading) return
        if (!isAuthenticated || user?.role !== 'STUDENT') {
            router.push('/login')
        }
    }, [loading, isAuthenticated, user, router])

    const initials = (name: string) =>
        name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = searchValue.trim()
        router.push(trimmed ? `/student/store?search=${encodeURIComponent(trimmed)}` : '/student/store')
    }

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">Đang tải...</p>
                </div>
            </div>
        )
    }

    const navItemsWithBadge = studentNavItems.map((item) =>
        item.path === '/student/purchase-history' && pendingCount > 0
        ? {...item, badge: pendingCount }
        : item
    )

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex">
            <AppSidebar
                navItems={navItemsWithBadge}
                brandHref="/student"
                collapsed={collapsed}
                onToggleCollapse={toggleCollapsed}
            />

            <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'ml-20' : 'ml-64'}`}>
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 px-6 sticky top-0 z-40 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Tìm kiếm giáo trình, tác giả..."
                                className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" title="Tìm kiếm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center gap-2 md:gap-3 ml-auto">
                        <HeaderNotifications />
                        <Link
                            href="/student/cart"
                            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                            title="Giỏ hàng"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <ThemeToggle />
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-600">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-extrabold">
                                {initials(user.full_name)}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200">{user.full_name}</p>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Sinh viên</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => { logout(); router.push('/login') }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Đăng xuất"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    )
}