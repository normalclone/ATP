export type NavigationIcon =
  | 'gauge'
  | 'database'
  | 'bar-chart-3'
  | 'calendar-clock'
  | 'alert-triangle'
  | 'users'
  | 'layers'
  | 'settings';

export interface NavigationItem {
  label: string;
  route: string;
  icon: NavigationIcon;
  exact?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Tổng quan', route: '/dashboard', icon: 'gauge', exact: true },
  { label: 'Dữ liệu test', route: '/testcases', icon: 'database', exact: true },
  { label: 'Cấu hình test suite', route: '/suites', icon: 'settings', exact: true },
  { label: 'Report', route: '/report', icon: 'bar-chart-3', exact: true },
  { label: 'Lịch chạy', route: '/schedulers', icon: 'calendar-clock', exact: true },
  { label: 'Cảnh báo', route: '/alerts', icon: 'alert-triangle', exact: true },
  { label: 'Thư viện UI', route: '/components', icon: 'layers', exact: true },
];

export const SUPER_ADMIN_ITEMS: NavigationItem[] = [
  { label: 'Quản lý dự án', route: '/projects', icon: 'users', exact: false },
];
