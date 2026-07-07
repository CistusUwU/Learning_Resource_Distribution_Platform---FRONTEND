'use client'

import { useEffect, useState } from "react"
import StudentShell from "@/layouts/student-shell/student-shell"
import { PendingPaymentBanner } from "@/components/student/pending-payment-banner"
import { useAuth } from "@/providers/auth-provider"
import { libraryService } from "@/services/library.service"

export default function StudentDashboardPage() {
    const { user } = useAuth()
    const [bookCount, setBookCount] = useState<number | null>(null)

    useEffect(() => {
        libraryService.getMyLibrary()
            .then((items) => setBookCount(items.length))
            .catch(() => setBookCount(0))
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Chào buổi sáng'
        if (hour < 18) return 'Chào buổi chiều'
        return 'Chào buổi tối'
    }

    return (
        <StudentShell>
            <div className="space-y-8 pb-10">
                <PendingPaymentBanner />

                <div className="rounded-[2.5rem] bg-white dark:bg-[#0F172A] dark:bg-slate-800/80 relative overflow-hidden p-10 border border-slate-350 dark:border-slate-800">
                    <div className="absolute top-[-10%] right-[-10%] w-[520px] h-[520px] bg-blue-600/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-3xl" />
                    <div className="relative z-10 space-y-6">                       
                        <p className="text-sm font-bold text-slate-400">Chào mừng quay lại</p>
                        <h1 className="mt-2 text-5xl font-extrabold leading-tight text-white">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                {user?.full_name}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-7 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Giáo trình</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                            {bookCount === null ? '...' : bookCount}
                        </p>
                    </div>
                </div>
            </div>
        </StudentShell>
    )
}