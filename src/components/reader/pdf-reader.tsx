'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { ReaderToolbar } from './reader-toolbar'
import { usePdfScale } from '@hooks/use-pdf-scale'
import { useReaderShortcuts } from '@hooks/use-reader-shortcuts'

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

interface PdfReaderProps {
    data: Blob
    studioCollapsed: boolean
    onToggleStudio: () => void
    initialPage?: number
    onPageChange?: (page: number) => void
}

const WINDOW_SIZE = 10
const SCROLL_THROTTLE_MS = 100

export function PdfReader({ data, studioCollapsed, onToggleStudio, initialPage, onPageChange }: PdfReaderProps) {
    const [readingMode, setReadingMode] = useState<'book' | 'scroll'>('book')
    const [currentPage, setCurrentPage] = useState(initialPage && initialPage > 0 ? initialPage : 1)
    const [numPages, setNumPages] = useState(0)
    const lastScrollCheckRef = useRef(0)

    const {
        containerRef,
        scale,
        pageHeight,
        zoomLevel,
        zoomIn,
        zoomOut,
        canZoomIn,
        canZoomOut,
        loadError,
        handleLoadSuccess: handleScaleLoadSuccess,
        handleLoadError,
    } = usePdfScale(readingMode, currentPage)

    const goPrev = () => setCurrentPage((page) => Math.max(1, page - 1))
    const goNext = () => setCurrentPage((page) => Math.min(numPages, page + 1))

    useReaderShortcuts({
        containerRef,
        readingMode,
        numPages,
        goPrev,
        goNext,
        zoomIn,
        zoomOut,
        setCurrentPage,
    })

    const handleDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
        setNumPages(pdf.numPages)
        handleScaleLoadSuccess(pdf)
    }

    const handleScroll = () => {
        if (readingMode !== 'scroll' || pageHeight == null || !containerRef.current) return

        const now = Date.now()
        if (now - lastScrollCheckRef.current < SCROLL_THROTTLE_MS) return
        lastScrollCheckRef.current = now

        const scrollTop = containerRef.current.scrollTop
        const page = Math.min(numPages, Math.max(1, Math.floor(scrollTop / pageHeight) + 1))
        setCurrentPage(page)
    }

    const windowStart = Math.max(1, currentPage - WINDOW_SIZE)
    const windowEnd = Math.min(numPages, currentPage + WINDOW_SIZE)

    useEffect(() => {
        if (numPages > 0 && currentPage > numPages) {
            setCurrentPage(numPages)
        }
    }, [numPages, currentPage])

    useEffect(() => {
        onPageChange?.(currentPage)
    }, [currentPage, onPageChange])

    useEffect(() => {
        if (readingMode === 'scroll' && pageHeight != null && containerRef.current) {
            containerRef.current.scrollTop = (currentPage - 1) * pageHeight
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readingMode])

    return (
        <div className="flex-1 min-w-0 flex flex-col">
            <ReaderToolbar
                readingMode={readingMode}
                onChangeReadingMode={setReadingMode}
                currentPage={currentPage}
                numPages={numPages}
                onPrev={goPrev}
                onNext={goNext}
                zoomLevel={zoomLevel}
                canZoomOut={canZoomOut}
                canZoomIn={canZoomIn}
                onZoomOut={zoomOut}
                onZoomIn={zoomIn}
                studioCollapsed={studioCollapsed}
                onToggleStudio={onToggleStudio}
            />

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center [overflow-anchor:none]"
            >
                <Document
                    file={data}
                    onLoadSuccess={handleDocumentLoadSuccess}
                    onLoadError={handleLoadError}
                    error={
                        loadError && (
                            <p className="text-sm text-red-600 dark:text-red-400 text-center py-10 px-4">
                                {loadError}
                            </p>
                        )
                    }
                >
                    {readingMode === 'book' && scale != null && (
                        <Page pageNumber={currentPage} scale={scale} />
                    )}
                    {readingMode === 'scroll' && scale != null && pageHeight != null && (
                        <>
                            <div style={{ height: (windowStart - 1) * pageHeight }} />

                            {Array.from(
                                { length: windowEnd - windowStart + 1 },
                                (_, i) => windowStart + i
                            ).map((pageNum) => (
                                <div key={pageNum} className="mb-2 flex justify-center">
                                    <Page pageNumber={pageNum} scale={scale} />
                                </div>
                            ))}

                            <div style={{ height: (numPages - windowEnd) * pageHeight }} />
                        </>
                    )}
                </Document>
            </div>
        </div>
    )
}