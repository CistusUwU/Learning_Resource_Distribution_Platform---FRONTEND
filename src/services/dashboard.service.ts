import axiosInstance from "@lib/axios";
import type { AdminDashboardData, StaffDashboardData, RevenueTrendPoint } from "@app-types/dashboard.type";

export class DashboardService {
    async getAdminDashboard(): Promise<AdminDashboardData> {
        const { data } = await axiosInstance.get<AdminDashboardData>('/dashboard/admin')
        return data
    }

    async getAdminRevenueTrend(): Promise<RevenueTrendPoint[]> {
        const { data } = await axiosInstance.get<RevenueTrendPoint[]>('/dashboard/admin/revenue-trend')
        return data
    }

    async getStaffDashboard(): Promise<StaffDashboardData> {
        const { data } = await axiosInstance.get<StaffDashboardData>('/dashboard/staff')
        return data
    }
}

export const dashboardService = new DashboardService()