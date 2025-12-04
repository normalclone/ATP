import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type SchedulerStatus = 'active' | 'paused' | 'ended';
type ScheduleType = 'recurring' | 'once' | 'cron';

interface SchedulerRow {
  id: string;
  name: string;
  projectCode: string;
  envName: string;
  ownerName: string;
  suiteName: string;
  scheduleType: ScheduleType;
  schedulePatternDisplay: string;
  nextRunDisplay: string;
  nextRunDate?: number;
  nextRunSoon?: boolean;
  lastRunTimeDisplay: string;
  lastRunSummary: string;
  lastRunStatus: 'passed' | 'failed' | 'running' | 'never';
  status: SchedulerStatus;
}

@Component({
  selector: 'app-schedulers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.scss'],
})
export class SchedulersComponent {
  statusTabs = [
    { id: 'all', label: 'Tất cả', value: 'all' },
    { id: 'active', label: 'Đang hoạt động', value: 'active' },
    { id: 'paused', label: 'Tạm dừng', value: 'paused' },
    { id: 'ended', label: 'Kết thúc', value: 'ended' },
  ];

  projectList = ['Tất cả project', 'DVCLT', 'CSKCB_V2', 'CTDL', 'TWD', 'QA'];
  envList: string[] = [];
  suiteList = ['Tất cả suite', 'Login – Full Flow', 'Payments Regression', 'API Mobile', 'Scheduler Monitor'];
  dateRangeOptions = [
    { id: 'all', label: 'Tất cả thời gian' },
    { id: 'today', label: 'Hôm nay' },
    { id: 'next7', label: '7 ngày tới' },
    { id: 'next30', label: '30 ngày tới' },
  ];

  statusFilter: 'all' | SchedulerStatus = 'all';
  projectFilter = '';
  projectDisplay = 'Automation Project';
  envFilter = '';
  envDisplay = 'DEV';
  suiteFilter = this.suiteList[0];
  keyword = '';
  dateRange = 'all';

  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  pageIndex = 1;

  allRows: SchedulerRow[] = [
    {
      id: 'SCH-001',
      name: 'Login – Daily UAT',
      projectCode: 'DVCLT',
      envName: 'UAT',
      ownerName: 'Phúc',
      suiteName: 'Login – Full Flow',
      scheduleType: 'recurring',
      schedulePatternDisplay: 'Hàng ngày · 08:00',
      nextRunDisplay: 'Hôm nay · 08:00',
      nextRunDate: new Date('2025-02-03T08:00:00').getTime(),
      nextRunSoon: false,
      lastRunTimeDisplay: 'Hôm qua · 08:03',
      lastRunSummary: 'Passed',
      lastRunStatus: 'passed',
      status: 'active',
    },
    {
      id: 'SCH-002',
      name: 'Payments – Weekly Regression',
      projectCode: 'CSKCB_V2',
      envName: 'STG',
      ownerName: 'Phúc',
      suiteName: 'Payments Regression',
      scheduleType: 'recurring',
      schedulePatternDisplay: 'Hàng tuần · Thứ 2-6 · 02:00',
      nextRunDisplay: 'Ngày mai · 02:00',
      nextRunDate: new Date('2025-02-04T02:00:00').getTime(),
      nextRunSoon: true,
      lastRunTimeDisplay: '03/02/2025 · 02:05',
      lastRunSummary: '1 fail',
      lastRunStatus: 'failed',
      status: 'paused',
    },
    {
      id: 'SCH-003',
      name: 'API Mobile – One time',
      projectCode: 'CTDL',
      envName: 'DEV',
      ownerName: 'An',
      suiteName: 'API Mobile',
      scheduleType: 'once',
      schedulePatternDisplay: '20/02/2025 · 09:30',
      nextRunDisplay: '20/02/2025 · 09:30',
      nextRunDate: new Date('2025-02-20T09:30:00').getTime(),
      nextRunSoon: false,
      lastRunTimeDisplay: 'Chưa chạy',
      lastRunSummary: '-',
      lastRunStatus: 'never',
      status: 'active',
    },
    {
      id: 'SCH-004',
      name: 'Nightly Monitor',
      projectCode: 'TWD',
      envName: 'PROD',
      ownerName: 'Tuyết',
      suiteName: 'Scheduler Monitor',
      scheduleType: 'cron',
      schedulePatternDisplay: 'Hàng ngày · 02:00',
      nextRunDisplay: 'Đêm nay · 02:00',
      nextRunDate: new Date('2025-02-03T02:00:00').getTime(),
      nextRunSoon: true,
      lastRunTimeDisplay: '02/02/2025 · 02:04',
      lastRunSummary: 'Passed',
      lastRunStatus: 'passed',
      status: 'ended',
    },
    {
      id: 'SCH-005',
      name: 'Smoke on Merge',
      projectCode: 'QA',
      envName: 'DEV',
      ownerName: 'Toan',
      suiteName: 'Smoke Suite',
      scheduleType: 'cron',
      schedulePatternDisplay: 'Theo merge CI',
      nextRunDisplay: 'Theo pipeline',
      nextRunDate: new Date('2025-02-05T02:00:00').getTime(),
      nextRunSoon: false,
      lastRunTimeDisplay: 'Hôm qua · 14:10',
      lastRunSummary: 'Running',
      lastRunStatus: 'running',
      status: 'active',
    },
  ];

  filteredRows: SchedulerRow[] = [];
  pagedRows: SchedulerRow[] = [];

  constructor() {
    const storedEnv = localStorage.getItem('envValue');
    const storedProject = localStorage.getItem('projectName');
    this.envDisplay = (storedEnv || 'DEV').toUpperCase();
    this.envFilter = this.envDisplay;
    this.projectDisplay = storedProject || 'Automation Project';
    this.projectFilter = this.projectDisplay;
    this.applyFilters();
  }

  setStatusFilter(value: 'all' | SchedulerStatus | string) {
    const next = (value as any) === 'all' ? 'all' : (value as SchedulerStatus);
    if (this.statusFilter === next) return;
    this.statusFilter = next;
    this.pageIndex = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.pageIndex = 1;
    this.applyFilters();
  }

  onDateRangeChange() {
    this.pageIndex = 1;
    this.applyFilters();
  }

  onSearch(term: string) {
    this.keyword = term;
    this.pageIndex = 1;
    this.applyFilters();
  }

  onPageChange(page: number) {
    if (page === this.pageIndex) return;
    this.pageIndex = page;
    this.updatePaged();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.updatePaged();
  }

  get totalSchedules(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  actionRunNow(row: SchedulerRow) {
    console.log('Run now', row.id);
  }

  actionToggle(row: SchedulerRow) {
    row.status = row.status === 'active' ? 'paused' : 'active';
  }

  actionEdit(row: SchedulerRow) {
    console.log('Edit schedule', row.id);
  }

  actionDelete(row: SchedulerRow) {
    console.log('Delete schedule', row.id);
  }

  typeLabel(type: ScheduleType) {
    switch (type) {
      case 'recurring':
        return 'ĐKỳ';
      case 'once':
        return '1 lần';
      default:
        return 'CRON';
    }
  }

  typeClass(type: ScheduleType) {
    switch (type) {
      case 'recurring':
        return 'primary';
      case 'once':
        return 'success';
      default:
        return 'neutral';
    }
  }

  lastRunLabel(status: SchedulerRow['lastRunStatus']) {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running';
      default:
        return 'Chưa chạy';
    }
  }

  lastRunClass(status: SchedulerRow['lastRunStatus']) {
    switch (status) {
      case 'passed':
        return 'badge success';
      case 'failed':
        return 'badge danger';
      case 'running':
        return 'badge primary';
      default:
        return 'badge neutral';
    }
  }

  statusLabel(status: SchedulerStatus) {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      default:
        return 'Ended';
    }
  }

  statusClass(status: SchedulerStatus) {
    switch (status) {
      case 'active':
        return 'badge success';
      case 'paused':
        return 'badge warn';
      default:
        return 'badge danger';
    }
  }

  private applyFilters() {
    const keyword = this.keyword.trim().toLowerCase();
    this.filteredRows = this.allRows.filter((row) => {
      if (this.statusFilter !== 'all' && row.status !== this.statusFilter) return false;
      if (this.projectFilter && row.projectCode !== this.projectFilter) return false;
      if (this.envFilter && row.envName !== this.envFilter) return false;
      if (this.suiteFilter !== this.suiteList[0] && row.suiteName !== this.suiteFilter) return false;
      if (this.dateRange !== 'all' && row.nextRunDate) {
        const now = Date.now();
        const diffDays = (row.nextRunDate - now) / (1000 * 60 * 60 * 24);
        if (this.dateRange === 'today' && (diffDays < 0 || diffDays > 1)) return false;
        if (this.dateRange === 'next7' && (diffDays < 0 || diffDays > 7)) return false;
        if (this.dateRange === 'next30' && (diffDays < 0 || diffDays > 30)) return false;
      }
      if (keyword) {
        const text = `${row.name} ${row.suiteName} ${row.projectCode} ${row.ownerName}`.toLowerCase();
        if (!text.includes(keyword)) return false;
      }
      return true;
    });
    this.updatePaged();
  }

  private updatePaged() {
    const start = (this.pageIndex - 1) * this.pageSize;
    this.pagedRows = this.filteredRows.slice(start, start + this.pageSize);
  }
}
