import axiosInstance from "@lib/axios";
import { LibraryItem } from "@app-types/library.type";

export class LibraryService {
    async getMyLibrary(): Promise<LibraryItem[]> {
        const { data } = await axiosInstance.get<LibraryItem[]>('/library')
        return data
    }

    async getLibraryItem(bookId: number): Promise<LibraryItem> {
        const { data } = await axiosInstance.get<LibraryItem>(`/library/${bookId}`)
        return data
    }

    async updateProgress(bookId: number, page: number): Promise<void> {
        await axiosInstance.patch(`/library/${bookId}/progress`, { page })
    }
}

export const libraryService = new LibraryService()