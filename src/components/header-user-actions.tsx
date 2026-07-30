'use client'

import Link from 'next/link'
import { ThemeToggle } from '@components/theme-toggle'
import { HeaderNotifications } from '@components/student/header-notifications'

interface HeaderUserActionsProps {
    userName: string
    roleLabel: string
    onLogout: () => void
    cartCount?: number
}

export function HeaderUserActions({ userName, roleLabel, onLogout, cartCount }: HeaderUserActionsProps) {
    const initials = (name: string) =>
        name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()

    return (
        <div className="flex items-center gap-2 md:gap-3">
            {cartCount != null && (
                <>
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
                </>
            )}
            <ThemeToggle />
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-600">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-extrabold">
                    {initials(userName)}
                </div>
                <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200">{userName}</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{roleLabel}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onLogout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Đăng xuất"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </div>
    )
}