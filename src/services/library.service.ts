import axiosInstance from "@/lib/axios";
import { LibraryItem } from "@/types/library.type";

export class LibraryService {
    async getMyLibrary(): Promise<LibraryItem[]> {
        const { data } = await axiosInstance.get<LibraryItem[]>('/library')
        return data
    }

    async getLibraryItem(bookId: number): Promise<LibraryItem> {
        const { data } = await axiosInstance.get<LibraryItem>(`/library/${bookId}`)
        return data
    }
}

export const libraryService = new LibraryService()