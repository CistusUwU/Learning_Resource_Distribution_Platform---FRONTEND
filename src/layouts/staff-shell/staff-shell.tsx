'use client'

import { useEffect } from "react"
import type { ReactNode } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@providers/auth-provider";
import { AppSidebar } from "@layouts/app-sidebar/app-sidebar";
import { useSidebarCollapsed } from "@hooks/use-sidebar-collapsed";
import { staffNavItems } from "@layouts/app-sidebar/staff-nav-items";
import { adminNavItems } from "@layouts/app-sidebar/admin-nav-items";
import { HeaderUserActions } from "@components/header-user-actions";

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
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-end px-6 sticky top-0 z-40 shadow-sm">
                    <HeaderUserActions
                        userName={user.full_name}
                        roleLabel={user.role === 'ADMIN' ? 'Quản trị viên' : 'Cán bộ'}
                        onLogout={() => { logout(); router.push('/login') }}
                    />
                </header>

                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    )
}