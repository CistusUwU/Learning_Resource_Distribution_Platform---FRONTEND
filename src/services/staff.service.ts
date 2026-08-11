import axiosInstance from "@lib/axios";
import type { StaffBook } from "@app-types/book.type";

export class StaffService {
    async getMyBooks(): Promise<StaffBook[]> {
        const { data } = await axiosInstance.get<StaffBook[]>('/staff/books')
        return data
    }
    async submitBook(bookId: number): Promise<StaffBook> {
        const { data } = await axiosInstance.post<StaffBook>(`/staff/books/${bookId}/submit`)
        return data
    }
    async cancelSubmission(bookId: number): Promise<StaffBook> {
        const { data } = await axiosInstance.patch<StaffBook>(`/staff/books/${bookId}/cancel`)
        return data
    }
}

export const staffService = new StaffService()