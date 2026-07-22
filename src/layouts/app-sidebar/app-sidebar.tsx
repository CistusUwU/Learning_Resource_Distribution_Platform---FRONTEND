'use client'

import type { NavItem } from "@app-types/nav.type"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { FC } from "react"

interface AppSidebarProps {
    navItems: NavItem[]
    collapsed?: boolean
    onClose?: () => void
    onToggleCollapse?: () => void
    brandHref: string
}

export const AppSidebar: FC<AppSidebarProps> = ({
    navItems,
    collapsed = false,
    onClose,
    onToggleCollapse,
    brandHref,
}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (pathname === path) return true
        const pathSegments = path.split('/').filter(Boolean)
        if (pathSegments.length <= 1) return false
        return pathname?.startsWith(path + '/') ?? false
    }
    
    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-blue-900 dark:bg-blue-950 border-r border-blue-800 dark:border-blue-900 fixed top-0 left-0 h-screen overflow-y-auto z-30 flex flex-col transition-all duration-200`}>
            <Link href={brandHref} className="flex items-center justify-center gap-2 h-16 border-b border-blue-800 dark:border-blue-900 flex-shrink-0">
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
                    <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg tracking-tight text-white truncate">
                        MedEd <span className="text-blue-300">Hub</span>
                    </span>
                )}
            </Link>
            <div className="p-4 flex-1 overflow-y-auto">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.path)
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                title={collapsed ? item.label : undefined}
                                className={`w-full flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all group ${
                                    active
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-blue-100 dark:text-blue-300 hover:bg-blue-800 dark:hover:bg-blue-900'
                                }`}
                            >
                                <div className={`shrink-0 ${
                                    active
                                        ? 'text-white'
                                        : 'text-blue-300 dark:text-slate-500 group-hover:text-white dark:group-hover:text-blue-400'
                                }`}>
                                    {item.icon}
                                </div>
                                {!collapsed && (
                                    <span className="font-semibold text-sm truncate flex-1">{item.label}</span>
                                )}
                                {!collapsed && typeof item.badge === 'number' && item.badge > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            {onToggleCollapse && (
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="flex items-center justify-center gap-2 py-4 border-t border-blue-800 dark:border-blue-900 text-blue-200 dark:text-blue-300 hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors flex-shrink-0"
                    title={collapsed ? 'Mở rộng' : 'Thu gọn'}
                >
                    <svg
                        className={`w-4 h-4 flex-shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {!collapsed && <span className="text-sm font-semibold">Thu gọn</span>}
                </button>
            )}
        </aside>
    )
}