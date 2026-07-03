'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react"


type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'meded_theme'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
}

export function ThemeProvider({ children } : { children: ReactNode}) {
    const [theme, setThemeState] = useState<Theme>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setThemeState(getInitialTheme())
    }, [])

    useEffect(() => {
        if (!mounted) return
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme, mounted])

    const setTheme = (newTheme: Theme) => setThemeState(newTheme)
    const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light': 'dark'))

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
