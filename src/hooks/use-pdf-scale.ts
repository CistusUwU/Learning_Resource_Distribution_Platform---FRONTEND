'use client'

import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const ZOOM_MIN = 50
const ZOOM_MAX = 300
const ZOOM_STEP = 10

export function usePdfScale(readingMode: 'book' | 'scroll', currentPage: number) {
    const [zoomLevel, setZoomLevel] = useState(100)
    const [baseScale, setBaseScale] = useState<number | null>(null)
    const [nativePageHeight, setNativePageHeight] = useState<number | null>(null)
    const [bookBaseScale, setBookBaseScale] = useState<number | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const pdfRef = useRef<PDFDocumentProxy | null>(null)

    const zoomOut = () => setZoomLevel((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
    const zoomIn = () => setZoomLevel((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))

    const handleLoadSuccess = async (pdf: PDFDocumentProxy) => {
        pdfRef.current = pdf
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1 })
        const containerWidth = containerRef.current?.clientWidth ?? viewport.width
        const containerHeight = containerRef.current?.clientHeight ?? viewport.height
        setBaseScale(Math.min(containerWidth / viewport.width, containerHeight / viewport.height))
        setNativePageHeight(viewport.height)
    }

    const handleLoadError = (err: Error) => {
        console.error(err)
        setLoadError('Không đọc được nội dung file PDF. File có thể bị hỏng hoặc sai định dạng.')
    }

    useEffect(() => {
        if (readingMode !== 'book' || !pdfRef.current || !containerRef.current) return
        let cancelled = false

        pdfRef.current.getPage(currentPage).then((page) => {
            if (cancelled) return
            const viewport = page.getViewport({ scale: 1 })
            const containerWidth = containerRef.current!.clientWidth
            const containerHeight = containerRef.current!.clientHeight
            setBookBaseScale(Math.min(containerWidth / viewport.width, containerHeight / viewport.height))
        })

        return () => { cancelled = true }
    }, [currentPage, readingMode, baseScale])

    const activeBaseScale = readingMode === 'book' ? bookBaseScale : baseScale
    const scale = activeBaseScale != null ? activeBaseScale * (zoomLevel / 100) : undefined

    const pageHeight = nativePageHeight != null && baseScale != null
        ? nativePageHeight * baseScale * (zoomLevel / 100)
        : null

    return {
        containerRef,
        scale,
        pageHeight,
        zoomLevel,
        zoomIn,
        zoomOut,
        canZoomIn: zoomLevel < ZOOM_MAX,
        canZoomOut: zoomLevel > ZOOM_MIN,
        loadError,
        handleLoadSuccess,
        handleLoadError,
    }
}