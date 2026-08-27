import axiosInstance from "@lib/axios";
import type { StaffBook, BookApprovalStatus } from "@app-types/book.type";
import type { PaginatedResponse } from "@app-types/pagination.type";
import { MyRevenueData } from "@app-types/revenue.type";

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

    async createBook(dto: {
        title: string
        description?: string
        price: number
        file_url: string
        cover_image?: string
        majorIds: number[]
    }): Promise<StaffBook> {
        const { data } = await axiosInstance.post<StaffBook>('/staff/books', dto)
        return data
    }

    async updateBook(bookId: number, dto: {
        title?: string
        description?: string
        price?: number
        file_url?: string
        cover_image?: string
        majorIds?: number[]
    }): Promise<StaffBook> {
        const { data } = await axiosInstance.put<StaffBook>(`/staff/books/${bookId}`, dto)
        return data
    }

    async uploadPdf(file: File): Promise<{ file_url: string; file_name: string; file_size: number }> {
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await axiosInstance.post('/staff/upload/pdf', formData, {
            headers: { 'Content-Type': undefined },
        })
        return data
    }

    async uploadCover(file: File): Promise<{ cover_image: string; file_name: string; file_size: number }> {
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await axiosInstance.post('/staff/upload/cover', formData, {
            headers: { 'Content-Type': undefined },
        })
        return data
    }

    async getMyRevenue(): Promise<MyRevenueData> {
        const { data } = await axiosInstance.get<MyRevenueData>('/staff/revenue')
        return data
    }
}

export const staffService = new StaffService()