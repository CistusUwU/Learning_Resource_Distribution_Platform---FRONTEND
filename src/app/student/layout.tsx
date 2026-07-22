import { CartProvider } from "@providers/cart-provider"
import { OrdersProvider } from "@providers/orders-provider"

export default function StudentLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <OrdersProvider>
        <CartProvider>{children}</CartProvider>
      </OrdersProvider>
    )
  }