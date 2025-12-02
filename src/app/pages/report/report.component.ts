import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RunReportEmbedComponent } from '../../shared/components/run-report-embed/run-report-embed.component';

type RunStatus = 'pass' | 'fail' | 'running';

interface Run {
  runId: string;
  branch: string;
  environment: string;
  status: RunStatus;
  totals: { passed: number; failed: number; skipped: number };
  duration: string;
  trigger: 'Manual' | 'CI' | 'Scheduler';
  runAt: string;
  runner: string;
  commit: string;
  modules: { name: string; total: number; failed: number }[];
  failedTests: { id: string; title: string; priority: 'High' | 'Medium' | 'Low'; module: string }[];
  reportType?: 'allure' | 'mochawesome' | null;
  reportUrl?: string | null;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RunReportEmbedComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnDestroy {
  toast: { type: 'success' | 'warn' | 'danger'; message: string } | null = null;
  private toastTimer?: number;
  // Filters
  searchText = '';
  branch = 'Tất cả';
  environment = 'Tất cả';
  trigger = 'Tất cả';
  dateRange = 'Tất cả';

  // Pagination
  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  // State
  runs: Run[] = [
    {
      runId: '#325',
      branch: 'master',
      environment: 'STG',
      status: 'fail',
      totals: { passed: 94, failed: 8, skipped: 0 },
      duration: '04m 12s',
      trigger: 'CI',
      runAt: '02/12/2025 09:30',
      runner: 'Auto pipeline',
      commit: 'c12a9f1',
      reportType: 'mochawesome',
      reportUrl: '/assets/mock-reports/run-325/Mochawesome.html',
      modules: [
        { name: 'Login', total: 26, failed: 2 },
        { name: 'Payments', total: 40, failed: 5 },
        { name: 'Profile', total: 36, failed: 1 },
      ],
      failedTests: [
        { id: 'TC_PAY_004', title: 'Timeout khi thanh toán', priority: 'High', module: 'Payments' },
        { id: 'TC_LOGIN_012', title: 'Nhớ đăng nhập bị lỗi', priority: 'Medium', module: 'Login' },
        { id: 'TC_PAY_021', title: 'Sai checksum giao dịch', priority: 'High', module: 'Payments' },
      ],
    },
    {
      runId: '#324',
      branch: 'develop',
      environment: 'DEV',
      status: 'pass',
      totals: { passed: 95, failed: 0, skipped: 0 },
      duration: '03m 41s',
      trigger: 'Manual',
      runAt: '01/12/2025 16:05',
      runner: 'Phúc',
      commit: 'a98bc22',
      modules: [
        { name: 'Login', total: 26, failed: 0 },
        { name: 'Payments', total: 40, failed: 0 },
        { name: 'Profile', total: 29, failed: 0 },
      ],
      failedTests: [],
    },
    {
      runId: '#323',
      branch: 'master',
      environment: 'STG',
      status: 'running',
      totals: { passed: 40, failed: 0, skipped: 0 },
      duration: 'Đang chạy',
      trigger: 'Scheduler',
      runAt: '01/12/2025 02:00',
      runner: 'Nightly job',
      commit: '98ff201',
      modules: [
        { name: 'Login', total: 26, failed: 0 },
        { name: 'Payments', total: 40, failed: 0 },
      ],
      failedTests: [],
    },
    {
      runId: '#322',
      branch: 'feature/login-v2',
      environment: 'DEV',
      status: 'fail',
      totals: { passed: 80, failed: 5, skipped: 3 },
      duration: '05m 32s',
      trigger: 'CI',
      runAt: '30/11/2025 20:14',
      runner: 'Auto pipeline',
      commit: 'b71cdd9',
      reportType: null,
      reportUrl: null,
      modules: [
        { name: 'Login', total: 32, failed: 5 },
        { name: 'Payments', total: 30, failed: 0 },
        { name: 'Profile', total: 26, failed: 0 },
      ],
      failedTests: [
        { id: 'TC_LOGIN_110', title: 'SAML flow lỗi redirect', priority: 'High', module: 'Login' },
      ],
    },
  ];

  filteredRuns: Run[] = [...this.runs];
  pagedRuns: Run[] = [...this.runs];
  selectedRun: Run | null = null;
  runDetailOpen = false;
  isLoading = false;
  activeRunDetailTab: 'overview' | 'report' = 'overview';

  summaryCards = [
    { label: 'Tổng số run', value: 325, badge: '10 ngày gần nhất', tone: 'primary' as const },
    { label: 'Pass rate (10 run gần nhất)', value: '87%', badge: 'Ổn định', tone: 'success' as const },
    { label: 'Failed tests (last run)', value: 8, badge: 'Run #325', tone: 'danger' as const },
    { label: 'Flaky tests', value: 12, badge: 'Trong 30 ngày', tone: 'warn' as const },
  ];

  branchOptions = ['Tất cả', 'master', 'develop', 'feature/login-v2'];
  environmentOptions = ['Tất cả', 'DEV', 'STG', 'PROD'];
  triggerOptions = ['Tất cả', 'Manual', 'CI', 'Scheduler'];
  dateRangeOptions = ['Tất cả', 'Hôm nay', '7 ngày gần nhất', '30 ngày gần nhất'];

  applyFilters() {
    const keyword = this.searchText.trim().toLowerCase();
    this.filteredRuns = this.runs.filter((run) => {
      const matchKeyword =
        !keyword ||
        run.runId.toLowerCase().includes(keyword) ||
        run.branch.toLowerCase().includes(keyword) ||
        run.commit.toLowerCase().includes(keyword) ||
        run.runner.toLowerCase().includes(keyword);

      const matchBranch = this.branch === 'Tất cả' || run.branch === this.branch;
      const matchEnv = this.environment === 'Tất cả' || run.environment === this.environment;
      const matchTrigger = this.trigger === 'Tất cả' || run.trigger === this.trigger;
      const matchDate = this.dateRange === 'Tất cả' ? true : true; // TODO: apply real date filter

      return matchKeyword && matchBranch && matchEnv && matchTrigger && matchDate;
    });

    this.currentPage = 1;
    this.updatePagedRuns();
  }

  refreshFilters() {
    this.searchText = '';
    this.branch = 'Tất cả';
    this.environment = 'Tất cả';
    this.trigger = 'Tất cả';
    this.dateRange = 'Tất cả';
    this.filteredRuns = [...this.runs];
    this.currentPage = 1;
    this.updatePagedRuns();
  }

  updatePagedRuns() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedRuns = this.filteredRuns.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    if (page < 1) return;
    const safe = Math.min(page, this.totalPages);
    this.currentPage = safe;
    this.updatePagedRuns();
  }

  onPageSizeChange(size: string | number) {
    const parsed = Number(size);
    if (Number.isNaN(parsed)) return;
    this.pageSize = parsed;
    this.currentPage = 1;
    this.updatePagedRuns();
  }

  get totalItems(): number {
    return this.filteredRuns.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, idx) => idx + 1);
  }

  statusBadgeClass(status: RunStatus): string {
    if (status === 'pass') return 'badge badge-success';
    if (status === 'fail') return 'badge badge-danger';
    return 'badge badge-warn';
  }

  statusLabel(status: RunStatus): string {
    if (status === 'pass') return 'Pass';
    if (status === 'fail') return 'Fail';
    return 'Running';
  }

  openRunDetail(run: Run) {
    this.selectedRun = run;
    this.runDetailOpen = true;
    this.activeRunDetailTab = 'overview';
  }

  onViewRunRecord(run: Run) {
    console.log('View run record', run.runId);
    // TODO: mở modal chi tiết hoặc điều hướng tới Report Viewer
  }

  onDownloadRunArtifact(run: Run) {
    console.log('Download artifact for', run.runId);
    // TODO: gọi API tải artifact/report tương ứng
  }

  openLatestRun() {
    if (this.filteredRuns.length === 0) return;
    this.openRunDetail(this.filteredRuns[0]);
  }

  closeRunDetail() {
    this.runDetailOpen = false;
    this.selectedRun = null;
  }

  onViewRunReport(run: Run): void {
    this.selectedRun = run;
    this.activeRunDetailTab = 'report';
    this.runDetailOpen = true;
  }

  onDownloadRunReport(run: Run): void {
    const url = (run as any).downloadUrl || run.reportUrl;
    if (!url) {
      console.warn('No report URL to download for run', run.runId);
      if ((this as any).toast?.warn) {
        (this as any).toast.warn(`Run ${run.runId} chưa có report để tải.`);
      } else {
        this.showToast('warn', `Run ${run.runId} chưa có report để tải.`);
      }
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const self: any = this as any;
      if (self.toast?.success) {
        self.toast.success(`Đã bắt đầu tải report cho ${run.runId}.`);
      } else if (self.notificationService?.success) {
        self.notificationService.success(`Đã bắt đầu tải report cho ${run.runId}.`);
      } else {
        this.showToast('success', `Đã bắt đầu tải report cho ${run.runId}.`);
      }
    } catch (err) {
      console.error('Download report error', err);
      this.showToast('danger', `Không thể tải report cho ${run.runId}.`);
    }
  }

  private showToast(type: 'success' | 'warn' | 'danger', message: string) {
    this.toast = { type, message };
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    const duration = type === 'success' ? 4000 : 6000;
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, duration);
  }

  dismissToast() {
    this.toast = null;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }
}
