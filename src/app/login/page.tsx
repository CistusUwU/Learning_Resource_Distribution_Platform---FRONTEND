'use client'

import { useAuth } from "@providers/auth-provider";
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react";

import { LoginPayLoad, LoginTab } from "@app-types/login.type";
import { ThemeToggle } from "@components/theme-toggle";

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [loginTab, setLoginTab] = useState<LoginTab>('STUDENT')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        if (!identifier.trim()) {
          setError(loginTab === 'STUDENT'
            ? 'Vui lòng nhập mã số sinh viên'
            : 'Vui lòng nhập mã số cán bộ giảng viên')
          return
        }

        if (!password) {
          setError('Vui lòng nhập mật khẩu')
          return
        }

        setIsLoading(true)

        try {
            const payload: LoginPayLoad = {
                identifier: identifier.trim(),
                password,
                role: loginTab === 'STUDENT' ? 'STUDENT' : 'STAFF',
            }

            const userInfo = await login(payload)
            if (userInfo.role === 'STAFF' || userInfo.role === 'ADMIN') {
                router.push('/staff')
            } else {
                router.push('/student')
            }
        } catch (err: any) {
          const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
          setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-slate-900 flex">
    
          {/* Left Side */}
          <div className="hidden lg:flex lg:w-7/12 bg-[#0F172A] flex-col justify-between p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
    
            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-white font-bold text-2xl">
                MedEd <span className="text-blue-400">Hub</span>
              </span>
            </div>
    
            {/* Tagline */}
            <div className="relative z-10">
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                Nền tảng học tập <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Chất lượng cao
                </span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Đăng nhập để truy cập lộ trình học tập cá nhân hóa, ngân hàng câu hỏi trắc nghiệm và trợ lý AI thông minh hỗ trợ 24/7.
              </p>
            </div>
    
            <div className="relative z-10 text-slate-500 text-sm">
              &copy; 2026 MedEd Hub Platform.
            </div>
          </div>
    
          {/* Right Side */}
          <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-8 lg:p-16 bg-white dark:bg-slate-800">
    
          <div className="absolute top-6 right-6">
              <ThemeToggle />
          </div>

            {/* Mobile logo */}
            <div className="lg:hidden self-start mb-10 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">MedEd Hub</span>
            </div>
    
            <div className="w-full max-w-sm">    
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Đăng nhập
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {loginTab === 'STUDENT'
                    ? 'Chào mừng sinh viên quay trở lại!'
                    : 'Chào mừng cán bộ giảng viên quay trở lại!'}
                </p>
              </div>
    
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
    
              {/* Tab */}
              <div className="mb-6 p-1 flex rounded-2xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                {(['STUDENT', 'STAFF'] as LoginTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => { setLoginTab(tab); setError('') }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      loginTab === tab
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab === 'STUDENT' ? 'Sinh viên' : 'Cán bộ'}
                  </button>
                ))}
              </div>
    
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
    
                {/* Identifier */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {loginTab === 'STUDENT' ? 'Mã số sinh viên' : 'Mã số cán bộ'}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginTab === 'STUDENT' ? 'SV001' : 'GV001'}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-60"
                  />
                </div>
    
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
    
                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </form>
    
              <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 text-center">
                Vui lòng liên hệ quản trị viên nếu quên mật khẩu.
              </p>
            </div>
          </div>
        </div>
      )
}