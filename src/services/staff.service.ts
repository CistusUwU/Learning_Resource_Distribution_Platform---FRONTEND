import axiosInstance from "@lib/axios";
import type { StaffBook, BookApprovalStatus } from "@app-types/book.type";
import type { PaginatedResponse } from "@app-types/pagination.type";

export class StaffService {
    async getMyBooks(params: { page?: number; limit?: number; status?: BookApprovalStatus }): Promise<PaginatedResponse<StaffBook>> {
        const { data } = await axiosInstance.get<PaginatedResponse<StaffBook>>('/staff/books', { params })
        return data
    }

    async submitBook(bookId: number): Promise<StaffBook> {
        const { data } = await axiosInstance.post<StaffBook>(`/staff/books/${bookId}/submit`)
        return data
    }

    async cancelSubmission(bookId: number): Promise<{ success: boolean }> {
        const { data } = await axiosInstance.patch<{ success: boolean }>(`/staff/books/${bookId}/cancel`)
        return data
    }
}

export const staffService = new StaffService()