'use client'

import { useEffect } from "react"
import type { ReactNode } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { AppSidebar } from "@/layouts/app-sidebar/app-sidebar";
import { staffNavItems } from "@/layouts/app-sidebar/staff-nav-items";
import { adminNavItems } from "@/layouts/app-sidebar/admin-nav-items";
import { ThemeToggle } from "@/components/theme-toggle";


export default function StaffShell({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { user, isAuthenticated, loading, logout } = useAuth()

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
            <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
                <Link href="/staff" className="flex items-center gap-2 rounded-lg">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-200">
                        MedEd <span className="text-blue-600">Hub</span>
                        <span className="ml-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Cán bộ</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2 md:gap-3">
                    <ThemeToggle />
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-600">                                
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-extrabold">
                            {initials(user.full_name)}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200">{user.full_name}</p>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{user.university_id}</p>
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

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    <AppSidebar navItems={navItems} />
                </aside>
                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    )
}