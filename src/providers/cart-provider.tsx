'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

const CART_STORAGE_KEY = 'lrdp_cart'

interface CartContextValue {
    bookIds: number[]
    count: number
    ready: boolean
    addItem: (bookId: number) => void
    removeItem: (bookId: number) => void
    removeItems: (bookIds: number[]) => void
    isInCart: (bookId: number) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

function readCartFromStorage(): number[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : []
    } catch {
        return []
    }
}

function writeCartToStorage(bookIds: number[]) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(bookIds))
    } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [bookIds, setBookIds] = useState<number[]>([])
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setBookIds(readCartFromStorage())
        setReady(true)
    }, [])

    const addItem = (bookId: number) => {
        setBookIds((current) => {
            if (current.includes(bookId)) return current
            const next = [...current, bookId]
            writeCartToStorage(next)
            return next
        })
    }

    const removeItem = (bookId: number) => {
        setBookIds((current) => {
            const next = current.filter((id) => id !== bookId)
            writeCartToStorage(next)
            return next
        })
    }

    const removeItems = (idsToRemove: number[]) => {
        setBookIds((current) => {
            const next = current.filter((id) => !idsToRemove.includes(id))
            writeCartToStorage(next)
            return next
        })
    }

    const isInCart = (bookId: number) => bookIds.includes(bookId)

    return (
        <CartContext.Provider
            value={{
                bookIds: ready ? bookIds : [],
                count: ready ? bookIds.length : 0,
                ready,
                addItem,
                removeItem,
                removeItems,
                isInCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart phải được dùng bên trong CartProvider')
    }
    return context
}