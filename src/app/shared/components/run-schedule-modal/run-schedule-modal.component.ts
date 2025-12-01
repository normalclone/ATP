import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type Mode = 'run-now' | 'schedule-once' | 'schedule-recurring';

interface SpecItem {
  id: string;
  name: string;
  description?: string;
  module: string;
  lastRun?: string;
  selected: boolean;
}

interface EnvForm {
  project: string;
  environment: string;
  browser: string;
  device: string;
}

interface RunNowForm {
  runName: string;
  parallel: string;
  notifyDiscord: boolean;
  allowSkipFlaky: boolean;
  note: string;
}

interface ScheduleOnceForm {
  runDate: string;
  runTime: string;
  runName: string;
  parallel: string;
  notifyDiscord: boolean;
  allowSkipFlaky: boolean;
  note: string;
}

interface RecurringForm {
  repeatType: string;
  runTime: string;
  daysOfWeek: Set<string>;
  dayOfMonth: string;
  startDate: string;
  endCondition: 'none' | 'count' | 'date';
  endAfterRuns: string;
  endDate: string;
  jobName: string;
  parallel: string;
  notifyDiscord: boolean;
  allowSkipFlaky: boolean;
}

@Component({
  selector: 'app-run-schedule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './run-schedule-modal.component.html',
  styleUrls: ['./run-schedule-modal.component.scss'],
})
export class RunScheduleModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ mode: Mode; specs: SpecItem[] }>();

  search = '';
  mode: Mode = 'run-now';
  selectAll = false;
  moduleFilter = 'Tất cả';
  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  envForm: EnvForm = {
    project: '',
    environment: '',
    browser: 'Chrome',
    device: '',
  };

  runNowForm: RunNowForm = {
    runName: 'Login - UAT - {timestamp}',
    parallel: '1',
    notifyDiscord: true,
    allowSkipFlaky: false,
    note: '',
  };

  scheduleOnceForm: ScheduleOnceForm = {
    runDate: '',
    runTime: '',
    runName: 'Login - UAT - schedule-24-02-2025',
    parallel: '1',
    notifyDiscord: true,
    allowSkipFlaky: false,
    note: '',
  };

  recurringForm: RecurringForm = {
    repeatType: 'Hàng ngày',
    runTime: '',
    daysOfWeek: new Set<string>(),
    dayOfMonth: '',
    startDate: '',
    endCondition: 'none',
    endAfterRuns: '',
    endDate: '',
    jobName: 'Login - UAT - daily-08h',
    parallel: '1',
    notifyDiscord: true,
    allowSkipFlaky: false,
  };

  specs: SpecItem[] = [
    {
      id: 'SPEC-001',
      name: 'login.spec.ts',
      description: 'Kiểm tra đăng nhập cơ bản',
      module: 'Login',
      lastRun: '03/02/2025 • Passed',
      selected: true,
    },
    {
      id: 'SPEC-002',
      name: 'payment.regression.spec.ts',
      description: 'Thanh toán đơn hàng',
      module: 'Payment',
      lastRun: '01/02/2025 • 2 fail',
      selected: true,
    },
    {
      id: 'SPEC-003',
      name: 'profile-upload.spec.ts',
      description: 'Upload hồ sơ',
      module: 'Upload',
      lastRun: '28/01/2025 • Skipped',
      selected: false,
    },
    {
      id: 'SPEC-004',
      name: 'scheduler-monitor.spec.ts',
      description: 'Kiểm tra cron chạy nightly',
      module: 'Scheduler',
      lastRun: '25/01/2025 • Passed',
      selected: false,
    },
  ];

  projectOptions = ['Chọn project...', 'DVCLT', 'CSKCB_V2', 'CTDL', 'TWD'];
  environmentOptions = ['Chọn môi trường...', 'DEV', 'UAT', 'STAGING', 'PROD'];
  browserOptions = ['Chọn browser...', 'Chrome', 'Firefox', 'Safari', 'Edge', 'Mobile Web'];
  deviceOptions = ['Chọn device...', 'Desktop', 'iPhone', 'Android', 'Tablet'];

  get filteredSpecs(): SpecItem[] {
    const keyword = this.search.trim().toLowerCase();
    return this.specs.filter((s) => {
      const matchKeyword =
        !keyword ||
        s.name.toLowerCase().includes(keyword) ||
        s.description?.toLowerCase().includes(keyword) ||
        s.module.toLowerCase().includes(keyword);
      const matchModule = this.moduleFilter === 'Tất cả' || s.module === this.moduleFilter;
      return matchKeyword && matchModule;
    });
  }

  get pagedSpecs(): SpecItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSpecs.slice(start, start + this.pageSize);
  }

  get totalItems(): number {
    return this.filteredSpecs.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, idx) => idx + 1);
  }

  get selectedCount(): number {
    return this.specs.filter((s) => s.selected).length;
  }

  get primaryLabel(): string {
    switch (this.mode) {
      case 'schedule-once':
        return 'Đặt lịch 1 lần';
      case 'schedule-recurring':
        return 'Tạo lịch định kỳ';
      default:
        return 'Chạy ngay';
    }
  }

  toggleSelectAll(checked: boolean) {
    this.selectAll = checked;
    for (const spec of this.pagedSpecs) {
      spec.selected = checked;
    }
    this.updateSelectAllState();
  }

  toggleSpec(spec: SpecItem, checked: boolean) {
    spec.selected = checked;
    this.updateSelectAllState();
  }

  private updateSelectAllState() {
    const pageSpecs = this.pagedSpecs;
    this.selectAll = pageSpecs.length > 0 && pageSpecs.every((s) => s.selected);
  }

  changeMode(mode: Mode) {
    this.mode = mode;
  }

  toggleDay(day: string) {
    const next = new Set(this.recurringForm.daysOfWeek);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }
    this.recurringForm.daysOfWeek = next;
  }

  canSubmit(): boolean {
    if (this.selectedCount === 0) return false;

    const envValid = this.envForm.project && this.envForm.environment;
    if (!envValid) return false;

    if (this.mode === 'run-now') {
      return !!this.runNowForm.runName;
    }

    if (this.mode === 'schedule-once') {
      return !!this.scheduleOnceForm.runName && !!this.scheduleOnceForm.runDate && !!this.scheduleOnceForm.runTime;
    }

    // schedule-recurring
    const recurringValid = this.recurringForm.runTime && this.recurringForm.jobName;
    if (!recurringValid) return false;

    if (this.recurringForm.endCondition === 'count' && !this.recurringForm.endAfterRuns) return false;
    if (this.recurringForm.endCondition === 'date' && !this.recurringForm.endDate) return false;
    return true;
  }

  get moduleOptions(): string[] {
    const uniques = Array.from(new Set(this.specs.map((s) => s.module)));
    return ['Tất cả', ...uniques];
  }

  onFilterChanged() {
    this.currentPage = 1;
    this.updateSelectAllState();
  }

  onPageChange(page: number) {
    if (page < 1) return;
    const maxPage = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = Math.min(page, maxPage);
    this.updateSelectAllState();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateSelectAllState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      this.syncBodyScroll();
    }
  }

  ngOnDestroy() {
    this.restoreBodyScroll();
  }

  private previousBodyOverflow?: string;

  private syncBodyScroll() {
    if (typeof document === 'undefined') return;
    if (this.open) {
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      this.restoreBodyScroll();
    }
  }

  private restoreBodyScroll() {
    if (typeof document === 'undefined') return;
    if (this.previousBodyOverflow !== undefined) {
      document.body.style.overflow = this.previousBodyOverflow;
      this.previousBodyOverflow = undefined;
    }
  }

  submitAction() {
    if (!this.canSubmit()) return;
    this.submit.emit({ mode: this.mode, specs: this.specs.filter((s) => s.selected) });
  }

  closeModal() {
    this.close.emit();
  }
}
