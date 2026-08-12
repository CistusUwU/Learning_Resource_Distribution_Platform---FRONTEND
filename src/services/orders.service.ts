import axiosInstance from "@lib/axios";
import { CreateOrderResponse, Order } from "@app-types/order.type";
import type { PaginatedResponse } from "@app-types/pagination.type";

export class OrdersService {
    async getMyOrders(params: { page?: number; limit?: number; status?: Order['status'] }): Promise<PaginatedResponse<Order>> {
        const { data } = await axiosInstance.get<PaginatedResponse<Order>>('/orders', { params })
        return data
    }

    async createOrder(bookIds: number[]): Promise<CreateOrderResponse> {
        const { data } = await axiosInstance.post<CreateOrderResponse>('/orders', { bookIds })
        return data
    }
}

export const ordersService = new OrdersService()