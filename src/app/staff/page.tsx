'use client'

import { useAuth } from "@/providers/auth-provider";
import { staffService } from "@/services/staff.service";
import { adminService } from "@/services/admin.service"
import type { StaffBook } from "@/types/book.type";
import { useEffect, useState } from "react";

export default function StaffHomePage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<StaffBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState<number>(0)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await staffService.getMyBooks()
        setBooks(data)
        if (user?.role === 'ADMIN') {
          const count = await adminService.getPendingBooksCount()
          setPendingCount(count)
        }
      } catch {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const total = books.length
  const approved = books.filter(b => b.approval_status === 'APPROVED').length
  const pending = books.filter(b => b.approval_status === 'PENDING').length
  const draft = books.filter(b => b.approval_status === 'DRAFT').length

  return (
    <div className="space-y-8 pb-10">
        <div className="rounded-[2.5rem] bg-[#0F172A] dark:bg-slate-800/80 relative overflow-hidden p-10 border border-slate-800">
            <div className="absolute top-[-10%] right-[-10%] w-[520px] h-[520px] bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="relative z-10">
                <p className="text-sm font-bold text-slate-400">Chào mừng quay lại</p>
                <h1 className="mt-2 text-5xl font-extrabold leading-tight text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        {user?.full_name}
                    </span>
                </h1>
                <p className="mt-3 text-slate-400 text-lg leading-relaxed max-w-2xl">
                    Tải lên và quản lý giáo trình, kiểm soát phạm vi hiển thị và theo dõi quy trình duyệt.
                </p>
            </div>
        </div>

        {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold">
                {error}
            </div>
        )}

        {loading ? (
            <div className="text-center py-16 text-slate-600 dark:text-slate-400 font-semibold">Đang tải...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-6">
                    <p className="text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tổng sách</p>
                    <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100">{total}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-6">
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Đã duyệt</p>
                    <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100">{approved}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-6">
                    <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chờ duyệt</p>
                    <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100">{pending}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-6">
                    <p className="text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Bản nháp</p>
                    <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100">{draft}</p>
                </div>
                {user?.role === 'ADMIN' && (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm p-6">
                        <p className="text-sm font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest">Chờ duyệt toàn hệ thống</p>
                        <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100">{pendingCount}</p>
                    </div>
                )}
            </div>
        )}
    </div>
  )
}