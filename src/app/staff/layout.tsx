import StaffShell from "@layouts/staff-shell/staff-shell"
import type { ReactNode } from 'react'

export default function StaffLayout({
    children,
  }: {
    children: ReactNode
  }) {
    return <StaffShell>{children}</StaffShell>
  }