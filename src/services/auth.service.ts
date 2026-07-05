import axiosInstance from "@/lib/axios"
import type { LoginPayLoad, LoginResponse, UserInfo } from "@/types/login.type"

export class AuthService {
    async login(payload: LoginPayLoad): Promise<LoginResponse> {
        const { data } = await axiosInstance.post<LoginResponse>('/auth/login', payload)
        return data
    }

    async getCurrentUser(): Promise<UserInfo> {
        const { data } = await axiosInstance.get<UserInfo>('/users/me')
        return data
    }

}


export const authService = new AuthService()