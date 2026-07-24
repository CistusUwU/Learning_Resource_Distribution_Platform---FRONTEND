'use client'

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@providers/auth-provider";
import { AppSidebar } from "@layouts/app-sidebar/app-sidebar";
import { useSidebarCollapsed } from "@layouts/app-sidebar/use-sidebar-collapsed";
import { staffNavItems } from "@layouts/app-sidebar/staff-nav-items";
import { adminNavItems } from "@layouts/app-sidebar/admin-nav-items";
import { ThemeToggle } from "@components/theme-toggle";

export default function StaffShell({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { user, isAuthenticated, loading, logout } = useAuth()
    const { collapsed, toggle: toggleCollapsed } = useSidebarCollapsed()

    useEffect(() => {
        if (loading) return
        if (!isAuthenticated || (user?.role !== 'STAFF' && user?.role !== 'ADMIN')) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, user, router])
    
    const initials = (name: string) =>
        name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex">
            <AppSidebar
                navItems={navItems}
                brandHref="/staff"
                collapsed={collapsed}
                onToggleCollapse={toggleCollapsed}
            />

            <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'ml-20' : 'ml-64'}`}>
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 md:gap-3 px-6 sticky top-0 z-40 shadow-sm">
                    <ThemeToggle />
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-600">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-extrabold">
                            {initials(user.full_name)}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200">{user.full_name}</p>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Cán bộ'}</p>
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
                </header>

                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    )
}