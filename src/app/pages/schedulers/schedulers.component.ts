import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RunScheduleModalComponent } from '../../shared/components/run-schedule-modal/run-schedule-modal.component';

type ScheduleStatus = 'active' | 'paused' | 'ended';
type ScheduleType = 'recurring' | 'once';

interface ScheduleRow {
  id: string;
  name: string;
  suite: string;
  type: ScheduleType;
  scheduleSummary: string;
  nextRun: string;
  lastRun: string;
  status: ScheduleStatus;
  projectName: string;
  environment: string;
  ownerName: string;
}

interface ToastState {
  type: 'success' | 'danger';
  message: string;
}

@Component({
  selector: 'app-schedulers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RunScheduleModalComponent],
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.scss'],
})
export class SchedulersComponent {
  searchText = '';
  statusTab: 'status-all' | 'status-active' | 'status-paused' | 'status-ended' = 'status-all';
  projectFilter = 'Tất cả project';
  envFilter = 'Tất cả môi trường';
  suiteFilter = 'Tất cả suite';
  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  scheduleModalOpen = false;
  scheduleModalMode: 'create' | 'edit' = 'create';
  scheduleEditing?: ScheduleRow;

  deleteModalOpen = false;
  deleteLoading = false;
  scheduleToDelete: ScheduleRow | null = null;

  toast: ToastState | null = null;
  private toastTimer?: number;

  statusTabs = [
    { id: 'status-all', label: 'Tất cả' },
    { id: 'status-active', label: 'Đang hoạt động' },
    { id: 'status-paused', label: 'Tạm dừng' },
    { id: 'status-ended', label: 'Kết thúc' },
  ] as const;

  projectOptions = ['Tất cả project', 'DVCLT', 'CSKCB_V2', 'CTDL', 'TWD'];
  envOptions = ['Tất cả môi trường', 'DEV', 'UAT', 'STAGING', 'PROD'];
  suiteOptions = ['Tất cả suite', 'Login – Full Flow', 'Payments Regression', 'API Mobile', 'Scheduler Monitor'];

  schedules: ScheduleRow[] = [
    {
      id: 'SCH-001',
      name: 'Login – Daily UAT',
      suite: 'Login – Full Flow',
      type: 'recurring',
      scheduleSummary: 'Hàng ngày • 08:00',
      nextRun: 'Hôm nay • 08:00',
      lastRun: 'Hôm qua • 08:03 • Passed',
      status: 'active',
      projectName: 'DVCLT',
      environment: 'UAT',
      ownerName: 'Phúc',
    },
    {
      id: 'SCH-002',
      name: 'Payments – Weekly Regression',
      suite: 'Payments Regression',
      type: 'recurring',
      scheduleSummary: 'Hàng tuần • Thứ 2-6 • 02:00',
      nextRun: 'Ngày mai • 02:00',
      lastRun: '03/02/2025 • 02:05 • 1 fail',
      status: 'paused',
      projectName: 'CSKCB_V2',
      environment: 'STAGING',
      ownerName: 'Minh',
    },
    {
      id: 'SCH-003',
      name: 'API Mobile – One time',
      suite: 'API Mobile',
      type: 'once',
      scheduleSummary: '20/02/2025 • 09:30',
      nextRun: '20/02/2025 • 09:30',
      lastRun: 'Chưa chạy',
      status: 'active',
      projectName: 'CTDL',
      environment: 'DEV',
      ownerName: 'An',
    },
    {
      id: 'SCH-004',
      name: 'Nightly Monitor',
      suite: 'Scheduler Monitor',
      type: 'recurring',
      scheduleSummary: 'Hàng ngày • 02:00',
      nextRun: 'Đêm nay • 02:00',
      lastRun: '02/02/2025 • 02:04 • Passed',
      status: 'ended',
      projectName: 'TWD',
      environment: 'PROD',
      ownerName: 'Tuyết',
    },
  ];

  get filteredSchedules(): ScheduleRow[] {
    const keyword = this.searchText.trim().toLowerCase();
    return this.schedules.filter((row) => {
      const matchStatus =
        this.statusTab === 'status-all' ||
        (this.statusTab === 'status-active' && row.status === 'active') ||
        (this.statusTab === 'status-paused' && row.status === 'paused') ||
        (this.statusTab === 'status-ended' && row.status === 'ended');

      const matchProject = this.projectFilter === 'Tất cả project' || row.projectName === this.projectFilter;
      const matchEnv = this.envFilter === 'Tất cả môi trường' || row.environment === this.envFilter;
      const matchSuite = this.suiteFilter === 'Tất cả suite' || row.suite === this.suiteFilter;

      const matchKeyword =
        !keyword ||
        row.name.toLowerCase().includes(keyword) ||
        row.suite.toLowerCase().includes(keyword) ||
        row.projectName.toLowerCase().includes(keyword) ||
        row.ownerName.toLowerCase().includes(keyword) ||
        row.scheduleSummary.toLowerCase().includes(keyword);

      return matchStatus && matchProject && matchEnv && matchSuite && matchKeyword;
    });
  }

  get totalItems(): number {
    return this.filteredSchedules.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, idx) => idx + 1);
  }

  get pagedSchedules(): ScheduleRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSchedules.slice(start, start + this.pageSize);
  }

  changeStatusTab(tabId: SchedulersComponent['statusTab']) {
    this.statusTab = tabId;
    this.currentPage = 1;
  }

  onFiltersChange() {
    this.currentPage = 1;
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    if (page < 1) return;
    const safePage = Math.min(page, this.totalPages);
    this.currentPage = safePage;
  }

  onPageSizeChange(size: string | number) {
    const parsed = Number(size);
    if (Number.isNaN(parsed)) return;
    this.pageSize = parsed;
    this.currentPage = 1;
  }

  typeLabel(type: ScheduleType): string {
    return type === 'recurring' ? 'ĐKỳ' : '1 lần';
  }

  statusLabel(status: ScheduleStatus): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      default:
        return 'Ended';
    }
  }

  typeBadgeClass(type: ScheduleType): string {
    return type === 'recurring' ? 'badge type-recurring' : 'badge type-once';
  }

  statusBadgeClass(status: ScheduleStatus): string {
    if (status === 'active') return 'badge status-active';
    if (status === 'paused') return 'badge status-paused';
    return 'badge status-ended';
  }

  runNow(row: ScheduleRow) {
    // TODO: connect API trigger run now
    this.showToast('success', `Đã trigger chạy ngay cho lịch "${row.name}".`);
  }

  togglePause(row: ScheduleRow) {
    if (row.status === 'ended') {
      this.showToast('danger', 'Lịch đã kết thúc, không thể kích hoạt lại.');
      return;
    }
    row.status = row.status === 'active' ? 'paused' : 'active';
    const message =
      row.status === 'active'
        ? `Đã kích hoạt lại lịch "${row.name}".`
        : `Đã tạm dừng lịch "${row.name}".`;
    this.showToast('success', message);
  }

  openCreateSchedule() {
    this.scheduleModalMode = 'create';
    this.scheduleEditing = undefined;
    this.scheduleModalOpen = true;
  }

  editSchedule(row: ScheduleRow) {
    this.scheduleModalMode = 'edit';
    this.scheduleEditing = row;
    this.scheduleModalOpen = true;
  }

  closeScheduleModal() {
    this.scheduleModalOpen = false;
  }

  handleScheduleSubmit() {
    // TODO: wire modal submit to real save/create
    const action = this.scheduleModalMode === 'edit' ? 'Cập nhật' : 'Tạo';
    this.showToast('success', `${action} lịch chạy test thành công.`);
    this.scheduleModalOpen = false;
  }

  openDeleteConfirm(row: ScheduleRow) {
    this.scheduleToDelete = row;
    this.deleteModalOpen = true;
    this.deleteLoading = false;
  }

  closeDeleteConfirm() {
    this.deleteModalOpen = false;
    this.scheduleToDelete = null;
    this.deleteLoading = false;
  }

  confirmDelete() {
    if (!this.scheduleToDelete || this.deleteLoading) return;
    this.deleteLoading = true;
    const id = this.scheduleToDelete.id;
    const name = this.scheduleToDelete.name;
    // TODO: replace with API call
    this.schedules = this.schedules.filter((row) => row.id !== id);
    this.closeDeleteConfirm();
    this.currentPage = 1;
    this.showToast('success', `Xoá lịch "${name}" thành công.`);
  }

  private showToast(type: ToastState['type'], message: string) {
    this.toast = { type, message };
    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }
    const duration = type === 'success' ? 4000 : 6000;
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, duration);
  }

  dismissToast() {
    this.toast = null;
    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }
  }
}
