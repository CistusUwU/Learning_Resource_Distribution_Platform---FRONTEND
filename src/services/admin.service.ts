import axiosInstance from "@lib/axios";
import type { AdminPendingBook, AdminManagedBook } from "@app-types/book.type";
import type { PaginatedResponse } from "@app-types/pagination.type";

export class AdminService {
    async getPendingBooksCount(): Promise<number> {
        const { data } = await axiosInstance.get<PaginatedResponse<AdminPendingBook>>('/admin/books/pending', {
            params: { limit: 1 },
        })
        return data.total
    }

    async getManagedBooks(params: { page?: number; limit?: number; search?: string; status?: 'APPROVED' | 'PENDING' }): Promise<PaginatedResponse<AdminManagedBook>> {
        const { data } = await axiosInstance.get<PaginatedResponse<AdminManagedBook>>('/admin/books', { params })
        return data
    }

    async approveBook(bookId: number): Promise<{ success: boolean }> {
        const { data } = await axiosInstance.patch<{ success: boolean }>(`/admin/books/${bookId}/approve`)
        return data
    }

    async rejectBook(bookId: number, reason: string): Promise<{ success: boolean }> {
        const { data } = await axiosInstance.patch<{ success: boolean }>(`/admin/books/${bookId}/reject`, {
            rejection_reason: reason,
        })
        return data
    }

    async toggleArchive(bookId: number): Promise<{ success: boolean }> {
        const { data } = await axiosInstance.patch<{ success: boolean }>(`/admin/books/${bookId}/archive`)
        return data
    }
}

export const adminService = new AdminService()