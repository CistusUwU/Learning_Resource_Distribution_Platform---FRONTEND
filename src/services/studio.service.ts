import axiosInstance from "@lib/axios";
import { ChatMessage, StudioHistoryDetail, StudioHistoryItem, StudioToolType } from "@app-types/studio.type";

const AI_TIMEOUT_MS = 280_000

export class StudioService {
    async generate(bookId: number, type: StudioToolType, isAuto = false): Promise<StudioHistoryDetail> {
        const { data } = await axiosInstance.post<StudioHistoryDetail>('/studio/generate', {
            bookId,
            type,
            isAuto,
        }, {
            timeout: AI_TIMEOUT_MS,
        })
        return data
    }

    async getHistory(bookId: number): Promise<StudioHistoryItem[]> {
        const { data } = await axiosInstance.get<StudioHistoryItem[]>('/studio/history', {
            params: { bookId },
        })
        return data
    }

    async getHistoryItem(id: string): Promise<StudioHistoryDetail> {
        const { data } = await axiosInstance.get<StudioHistoryDetail>(`/studio/history/${id}`)
        return data
    }

    async deleteHistoryItem(id: string): Promise<{ success: boolean }> {
        const { data } = await axiosInstance.delete<{ success: boolean }>(`/studio/history/${id}`)
        return data
    }

    async chat(bookId: number, message: string, history: ChatMessage[]): Promise<{ reply: string }> {
        const { data } = await axiosInstance.post<{ reply: string }>('/studio/chat', {
            bookId,
            message,
            history,
        }, {
            timeout: AI_TIMEOUT_MS,
        })
        return data
    }
}

export const studioService = new StudioService()