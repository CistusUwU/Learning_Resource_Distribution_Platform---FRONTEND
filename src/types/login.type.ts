import { UserRole } from "@/types/role.type"


export type LoginTab = 'STUDENT' | 'STAFF'

export interface LoginPayLoad{
    identifier: string
    password:string
    role: 'STUDENT' | 'STAFF'
}

export interface UserInfo {
    id: number
    university_id: string
    full_name: string
    email: string
    role: UserRole
}

export interface LoginResponse {
    access_token: string
    user: UserInfo
}