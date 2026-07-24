'use client'

import { useState } from 'react'

const STORAGE_KEY = 'lrdp_sidebar_collapsed'

function readInitialCollapsed(): boolean {
    if (typeof window === 'undefined') return false
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
        return false
    }
}

export function useSidebarCollapsed() {
    const [collapsed, setCollapsed] = useState(readInitialCollapsed)

    const toggle = () => {
        setCollapsed((prev) => {
            const next = !prev
            try {
                localStorage.setItem(STORAGE_KEY, String(next))
            } catch {}
            return next
        })
    }

    return { collapsed, toggle }
}