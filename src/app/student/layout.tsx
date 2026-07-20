import { CartProvider } from "@providers/cart-provider"

export default function StudentLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <CartProvider>{children}</CartProvider>
  }