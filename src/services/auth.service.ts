import axiosInstance from "@/lib/axios"
import type { LoginPayLoad, LoginResponse } from "@/types/login.type"

export class AuthService {
    async login(payload: LoginPayLoad): Promise<LoginResponse> {
        const { data } = await axiosInstance.post<LoginResponse>('/auth/login', payload)
        return data
    }
}

export const authService = new AuthService()