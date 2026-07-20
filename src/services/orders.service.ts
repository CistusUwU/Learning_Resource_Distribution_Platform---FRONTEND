import axiosInstance from "@lib/axios";
import { CreateOrderResponse, Order } from "@app-types/order.type";

export class OrdersService {
    async getMyOrders(): Promise<Order[]>{
        const { data } = await axiosInstance.get<Order[]>('/orders')
        return data
    }

    async createOrder(bookIds: number[]): Promise<CreateOrderResponse> {
        const { data } = await axiosInstance.post<CreateOrderResponse>('/orders', { bookIds })
        return data
    }
}

export const ordersService = new OrdersService()