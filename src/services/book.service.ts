import axiosInstance from "@lib/axios";
import { Book, StoreBookListResponse, BookQueryParams } from "@app-types/book.type";

export class BookService {
    async getBook(bookId: number): Promise<Book> {
        const { data } = await axiosInstance.get<Book>(`/books/${bookId}`)
        return data
    }

    async getBooks(query: BookQueryParams): Promise<StoreBookListResponse> {
        const { ids, ...rest } = query
        const params = ids && ids.length > 0
            ? { ...rest, ids: ids.join(',') }
            : rest
        
        const { data } = await axiosInstance.get<StoreBookListResponse>('/books', {
            params,
        })
        return data
    }
}

export const bookService = new BookService()