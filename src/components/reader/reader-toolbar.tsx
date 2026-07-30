'use client'

import { BookOpen, AlignJustify, ChevronLeft, ChevronRight, Minus, Plus, PanelRightOpen, PanelRightClose } from 'lucide-react'

interface ReaderToolbarProps {
    readingMode: 'book' | 'scroll'
    onChangeReadingMode: (mode: 'book' | 'scroll') => void
    currentPage: number
    numPages: number
    onPrev: () => void
    onNext: () => void
    zoomLevel: number
    canZoomOut: boolean
    canZoomIn: boolean
    onZoomOut: () => void
    onZoomIn: () => void
    studioCollapsed: boolean
    onToggleStudio: () => void
}

const groupLabel = 'text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-center mb-1'

const navBtn =
    'inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'

const valueBox =
    'inline-flex items-center justify-center min-w-[64px] h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200'

const modeBtn =
    'flex flex-col items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors'
const modeBtnActive = 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
const modeBtnInactive =
    'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'

export function ReaderToolbar({
    readingMode,
    onChangeReadingMode,
    currentPage,
    numPages,
    onPrev,
    onNext,
    zoomLevel,
    canZoomOut,
    canZoomIn,
    onZoomOut,
    onZoomIn,
    studioCollapsed,
    onToggleStudio,
}: ReaderToolbarProps) {
    return (
        <div className="shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-1 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl mb-2">
            <div className="justify-self-start">
                <p className={groupLabel}>Chế độ đọc</p>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className={modeBtn + ' ' + (readingMode === 'book' ? modeBtnActive : modeBtnInactive)}
                        onClick={() => onChangeReadingMode('book')}
                        title="Từng trang"
                    >
                        <BookOpen size={18} />
                    </button>
                    <button
                        type="button"
                        className={modeBtn + ' ' + (readingMode === 'scroll' ? modeBtnActive : modeBtnInactive)}
                        onClick={() => onChangeReadingMode('scroll')}
                        title="Cuộn trang"
                    >
                        <AlignJustify size={18} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        className={navBtn}
                        onClick={onPrev}
                        disabled={readingMode === 'scroll' || currentPage <= 1}
                        title="Trang trước"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className={valueBox}>{currentPage} / {numPages}</span>
                    <button
                        type="button"
                        className={navBtn}
                        onClick={onNext}
                        disabled={readingMode === 'scroll' || currentPage >= numPages}
                        title="Trang sau"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                <span className="w-px h-10 bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-1.5">
                    <button type="button" className={navBtn} onClick={onZoomOut} disabled={!canZoomOut} title="Thu nhỏ">
                        <Minus size={18} />
                    </button>
                    <span className={valueBox}>{zoomLevel}%</span>
                    <button type="button" className={navBtn} onClick={onZoomIn} disabled={!canZoomIn} title="Phóng to">
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <button
                type="button"
                className={navBtn + ' justify-self-end'}
                onClick={onToggleStudio}
                title={studioCollapsed ? 'Mở công cụ' : 'Ẩn panel'}
            >
                {studioCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
            </button>
        </div>
    )
}