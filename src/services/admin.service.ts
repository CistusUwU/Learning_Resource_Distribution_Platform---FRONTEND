import axiosInstance from "@lib/axios";

export class AdminService{
    async getPendingBooksCount(): Promise<number> {
        const { data } = await axiosInstance.get<unknown[]>('/admin/books/pending')
        return data.length
    }
}

export const adminService = new AdminService()