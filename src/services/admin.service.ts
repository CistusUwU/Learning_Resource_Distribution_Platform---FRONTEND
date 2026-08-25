import axiosInstance from "@lib/axios";
import type { AdminPendingBook, AdminManagedBook } from "@app-types/book.type";
import type { PaginatedResponse } from "@app-types/pagination.type";
import type { LecturerRevenueStat, LecturerTransaction, PayoutBatch } from "@app-types/revenue.type";

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

    async getRevenueStats(params: { month?: number; quarter?: number; year?: number; page?: number; limit?: number }): Promise<PaginatedResponse<LecturerRevenueStat>> {
        const { data } = await axiosInstance.get<PaginatedResponse<LecturerRevenueStat>>('/admin/revenue/stats', { params })
        return data
    }

    async getLecturerTransactions(lecturerId: number, params: { page?: number; limit?: number }): Promise<PaginatedResponse<LecturerTransaction>> {
        const { data } = await axiosInstance.get<PaginatedResponse<LecturerTransaction>>(
            `/admin/revenue/lecturers/${lecturerId}/transactions`,
            { params }
        )
        return data
    }

    async getPayoutBatches(params: { page?: number; limit?: number }): Promise<PaginatedResponse<PayoutBatch>> {
        const { data } = await axiosInstance.get<PaginatedResponse<PayoutBatch>>('/admin/revenue/payouts', { params })
        return data
    }

    async createPayout(dto: { month: number; year: number; note?: string }): Promise<PayoutBatch> {
        const { data } = await axiosInstance.post<PayoutBatch>('/admin/revenue/payouts', dto)
        return data
    }

    async confirmPayout(id: string): Promise<PayoutBatch> {
        const { data } = await axiosInstance.patch<PayoutBatch>(`/admin/revenue/payouts/${id}/confirm`)
        return data
    }

    async exportPayoutCSV(id: string): Promise<string> {
        const { data } = await axiosInstance.get<string>(`/admin/revenue/payouts/${id}/export`, {
            responseType: 'text',
        })
        return data
    }
}

export const adminService = new AdminService()