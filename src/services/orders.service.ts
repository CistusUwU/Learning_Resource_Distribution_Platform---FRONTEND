import axiosInstance from "@lib/axios";
import { Order } from "@app-types/order.type";

export class OrdersService {
    async getMyOrders(): Promise<Order[]>{
        const { data } = await axiosInstance.get<Order[]>('/orders')
        return data
    }
}

export const ordersService = new OrdersService()