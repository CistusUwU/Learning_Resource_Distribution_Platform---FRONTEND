import type { NavItem } from "@/types/nav.type";
import { staffNavItems } from "./staff-nav-items";



export const adminNavItems: NavItem[] = [
  ...staffNavItems,
  {
    path: '/staff/library',
    label: 'Thư viện chung',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7l9-4 9 4-9 4-9-4zm0
           6l9 4 9-4"
        />
      </svg>
    ),
  },
  {
    path: '/staff/admin/approvals',
    label: 'Duyệt sách',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m-9
           9h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2
           2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: '/staff/admin/transactions',
    label: 'Sao kê GD',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 8h14M5 16h10" />
      </svg>
    ),
  },
  {
    path: '/staff/admin/revenue',
    label: 'Phân chia DT',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19V6m4 13V10M7 19v-6" />
      </svg>
    ),
  },
  {
    path: '/staff/admin/tags',
    label: 'Nhãn',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h6M7 17h4" />
      </svg>
    ),
  },
  {
    path: '/staff/admin/staff',
    label: 'Quyền giảng viên',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20v-2a4 4 0
           00-4-4H7a4 4 0
           00-4 4v2m14-10a4 4 0
           11-8 0 4 4 0 018 0zm5
           10v-2a3 3 0 00-2-2.816"
        />
      </svg>
    ),
  },
  {
    path: '/staff/admin/logs',
    label: 'Nhật ký',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h5M5 5h14v14H5z" />
      </svg>
    ),
  },
];

