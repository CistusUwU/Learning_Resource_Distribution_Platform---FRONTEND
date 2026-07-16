import axiosInstance from "@lib/axios";
import { Book } from "@app-types/book.type";

export class BookService {
    async getBook(bookId: number): Promise<Book> {
        const { data } = await axiosInstance.get<Book>(`/books/${bookId}`)
        return data
    }
}

export const bookService = new BookService()