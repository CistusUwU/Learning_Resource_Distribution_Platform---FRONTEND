import axiosInstance from "@lib/axios";
import type { StaffBook } from "@app-types/book.type";

export class StaffService {
    async getMyBooks(): Promise<StaffBook[]> {
        const { data } = await axiosInstance.get<StaffBook[]>('/staff/books')
        return data
    }
}

export const staffService = new StaffService()