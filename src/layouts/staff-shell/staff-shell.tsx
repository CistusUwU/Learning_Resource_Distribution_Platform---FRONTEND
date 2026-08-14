'use client'

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from "@providers/auth-provider";
import { AppSidebar } from "@layouts/app-sidebar/app-sidebar";
import { useSidebarCollapsed } from "@hooks/use-sidebar-collapsed";
import { staffNavItems } from "@layouts/app-sidebar/staff-nav-items";
import { adminNavItems } from "@layouts/app-sidebar/admin-nav-items";
import { HeaderUserActions } from "@components/header-user-actions";
import type { NavItem } from "@app-types/nav.type";

function getActiveLabel(navItems: NavItem[], pathname: string): string {
    const sorted = [...navItems].sort((a, b) => b.path.length - a.path.length)
    const match = sorted.find((item) => {
        const isRoot = item.path === '/staff' || item.path === '/student'
        return isRoot ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/')
    })
    return match?.label ?? ''
}

const SEARCHABLE_PATHS = ['/staff/admin/approvals']

export default function StaffShell({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isAuthenticated, loading, logout } = useAuth()
    const { collapsed, toggle: toggleCollapsed } = useSidebarCollapsed()
    const [searchValue, setSearchValue] = useState('')

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = searchValue.trim()
        router.push(trimmed ? `${pathname}?search=${encodeURIComponent(trimmed)}` : pathname)
    }

    useEffect(() => {
        if (loading) return
        if (!isAuthenticated || (user?.role !== 'STAFF' && user?.role !== 'ADMIN')) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, user, router])

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
    const navItems = user.role === 'ADMIN' ? adminNavItems : staffNavItems
    const pageTitle = getActiveLabel(navItems, pathname)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex">
            <AppSidebar
                navItems={navItems}
                brandHref="/staff"
                collapsed={collapsed}
                onToggleCollapse={toggleCollapsed}
            />

            <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'ml-20' : 'ml-64'}`}>
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 px-6 sticky top-0 z-40 shadow-sm">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">{pageTitle}</h1>

                    {SEARCHABLE_PATHS.includes(pathname) && (
                        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Tìm giáo trình, tác giả..."
                                    className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" title="Tìm kiếm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="ml-auto">
                        <HeaderUserActions
                        userName={user.full_name}
                        roleLabel={user.role === 'ADMIN' ? 'Quản trị viên' : 'Cán bộ'}
                        onLogout={() => { logout(); router.push('/login') }}
                    />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    )
}