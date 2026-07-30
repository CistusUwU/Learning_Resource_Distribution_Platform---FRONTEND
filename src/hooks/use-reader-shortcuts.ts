'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

interface UseReaderShortcutsParams {
    containerRef: RefObject<HTMLDivElement | null>
    readingMode: 'book' | 'scroll'
    numPages: number
    goPrev: () => void
    goNext: () => void
    zoomIn: () => void
    zoomOut: () => void
    setCurrentPage: (page: number) => void
}

export function useReaderShortcuts({
    containerRef,
    readingMode,
    numPages,
    goPrev,
    goNext,
    zoomIn,
    zoomOut,
    setCurrentPage,
}: UseReaderShortcutsParams) {
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey) return
            e.preventDefault()
            if (e.deltaY < 0) zoomIn()
            else zoomOut()
        }

        el.addEventListener('wheel', handleWheel, { passive: false })
        return () => el.removeEventListener('wheel', handleWheel)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
            if (isTyping) return

            switch (e.key) {
                case 'ArrowLeft':
                    if (readingMode === 'book') goPrev()
                    break
                case 'ArrowRight':
                    if (readingMode === 'book') goNext()
                    break
                case 'Home':
                    if (readingMode === 'book') setCurrentPage(1)
                    break
                case 'End':
                    if (readingMode === 'book') setCurrentPage(numPages)
                    break
                case '+':
                case '=':
                    zoomIn()
                    break
                case '-':
                    zoomOut()
                    break
                default:
                    return
            }
            e.preventDefault()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [readingMode, numPages])
}