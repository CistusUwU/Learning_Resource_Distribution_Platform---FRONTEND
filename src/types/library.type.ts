export interface LibraryItem {
    library_id: number
    purchased_date: string | null
    reading_progress: number | null
    last_accessed: string | null
    book: {
        book_id: number
        title: string
        cover_image: string | null
        price: string
    }
}