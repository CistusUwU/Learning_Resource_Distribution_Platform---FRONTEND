'use client'

import type { NavItem } from "@app-types/nav.type"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { FC } from "react"

interface AppSidebarProps {
    navItems: NavItem[]
    collapsed?: boolean
    onClose?: () => void
}

export const AppSidebar: FC<AppSidebarProps> = ({
    navItems,
    collapsed = false,
    onClose,
}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/student') {
            return pathname === '/student'
        }
        if (pathname === path) return true
        return pathname?.startsWith(path + '/')
    }
    
    return (
        <div className="p-4 h-full flex flex-col">
            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={onClose}
                            className={`w-full flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all group ${
                                active
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            <div className={`shrink-0 ${
                                active
                                    ? 'text-white'
                                    : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
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
    )
}