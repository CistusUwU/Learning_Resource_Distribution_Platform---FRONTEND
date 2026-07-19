import axiosInstance from "@lib/axios"
import { PaymentReturnResult } from "@app-types/payment.type"

export class PaymentService {
  async createPayment(orderCode: string): Promise<string> {
    const { data } = await axiosInstance.post<string>(`/payment/create/${orderCode}`)
    return data
  }

  async verifyReturn(queryString: string): Promise<PaymentReturnResult> {
    const { data } = await axiosInstance.get<PaymentReturnResult>(`/payment/vnpay-return?${queryString}`)
    return data
  }
}

export const paymentService = new PaymentService()