'use client'

import { TokenManager } from "@/lib/axios"
import { authService } from "@/services/auth.service"
import type { LoginPayLoad, UserInfo } from "@/types/login.type"
import { createContext, ReactNode, useCallback, useContext, useState } from "react"

interface AuthContextValue {
    isAuthenticated: boolean
    user: UserInfo | null
    login: (payload: LoginPayLoad) => Promise<UserInfo>
    logout: () => void
}   

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        () => !!TokenManager.get()
    )

    const [user, setUser] = useState<UserInfo | null>(null)

    const login = useCallback(async (payload: LoginPayLoad): Promise<UserInfo> => {
        const { access_token, user: userInfo } = await authService.login(payload)
        TokenManager.set(access_token)
        setIsAuthenticated(true)
        setUser(userInfo)
        return userInfo
    }, [])

    const logout = useCallback(() =>{
        TokenManager.clear()
        setIsAuthenticated(false)
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw Error('useAuth must be used within AuthProvider')
    return ctx
}

