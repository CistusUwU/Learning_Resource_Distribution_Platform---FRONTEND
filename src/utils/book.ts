import type { BadgeTone } from '@components/ui/badge'
import type { BookApprovalStatus } from '@app-types/book.type'

export function formatBookApprovalStatus(status: BookApprovalStatus): string {
  if (status === 'DRAFT') return 'Bản nháp'
  if (status === 'PENDING') return 'Chờ duyệt'
  if (status === 'APPROVED') return 'Đã duyệt'
  if (status === 'REJECTED') return 'Bị từ chối'
  return 'Cần chỉnh sửa'
}

export function bookApprovalStatusToTone(status: BookApprovalStatus): BadgeTone {
  if (status === 'APPROVED') return 'success'
  if (status === 'PENDING') return 'warning'
  if (status === 'UPDATE_REQUIRED') return 'warning'
  if (status === 'REJECTED') return 'error'
  return 'neutral'
}