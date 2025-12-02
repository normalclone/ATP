import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type Tone = 'primary' | 'success' | 'warn' | 'danger';
type RunStatus = 'pass' | 'fail' | 'running';

interface DashboardKpi {
  label: string;
  value: string;
  subLabel?: string;
  tone?: Tone;
}

interface TrendPoint {
  date: string;
  pass: number;
  fail: number;
}
type TrendMetric = 'pass' | 'fail';

interface RunActivity {
  id: string;
  status: RunStatus;
  branch: string;
  env: string;
  trigger: string;
  time: string;
  reportUrl?: string | null;
}

interface HotModuleRow {
  module: string;
  testcases: number;
  runs7d: number;
  failRate: number;
  flaky: number;
}

interface HighlightTest {
  id: string;
  title: string;
  module: string;
  type: 'flaky' | 'failed';
  note: string;
}

interface JobStatus {
  name: string;
  status: 'pass' | 'fail' | 'missed';
  lastRun: string;
}

interface TestcaseDetail {
  id: string;
  name: string;
  preCondition: string;
  priority: string;
  updatedAt: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedProject = 'DVCLT';
  env = 'STG';
  @ViewChild('trendChartArea') trendChartArea?: ElementRef<HTMLElement>;
  constructor(private sanitizer: DomSanitizer) {}

  kpis: DashboardKpi[] = [
    { label: 'Tổng testcase', value: '1,240', subLabel: '+32 mới tuần này', tone: 'primary' },
    { label: 'Run 7 ngày', value: '48', subLabel: 'CI: 36 • Manual: 12', tone: 'primary' },
    { label: 'Pass rate', value: '87%', subLabel: 'Ổn định (7 ngày)', tone: 'success' },
    { label: 'Flaky tests', value: '12', subLabel: 'Cần xem lại selector/data', tone: 'warn' },
  ];

  extraKpi: DashboardKpi = {
    label: 'Bug do automation phát hiện',
    value: '21',
    subLabel: 'Sprint hiện tại',
    tone: 'danger',
  };

  trend: TrendPoint[] = [
    { date: '26/11', pass: 5, fail: 2 },
    { date: '27/11', pass: 7, fail: 1 },
    { date: '28/11', pass: 4, fail: 3 },
    { date: '29/11', pass: 6, fail: 2 },
    { date: '30/11', pass: 8, fail: 1 },
    { date: '01/12', pass: 9, fail: 0 },
    { date: '02/12', pass: 7, fail: 2 },
  ];

  activities: RunActivity[] = [
    {
      id: '#325',
      status: 'fail',
      branch: 'master',
      env: 'STG',
      trigger: 'CI (GitLab)',
      time: '09:30',
      reportUrl: 'assets/mock-reports/run-325/Mochawesome.html',
    },
    {
      id: '#324',
      status: 'pass',
      branch: 'develop',
      env: 'DEV',
      trigger: 'Manual',
      time: '16:05',
      reportUrl: 'assets/report/Mochawesome.html',
    },
    {
      id: '#323',
      status: 'pass',
      branch: 'release/v2.3',
      env: 'STG',
      trigger: 'CI (GitLab)',
      time: '10:42',
      reportUrl: 'assets/report/Mochawesome.html',
    },
    {
      id: '#322',
      status: 'running',
      branch: 'feature/login-v2',
      env: 'DEV',
      trigger: 'CI (GitLab)',
      time: '09:58',
      reportUrl: null,
    },
  ];

  hotModules: HotModuleRow[] = [
    { module: 'Login', testcases: 24, runs7d: 12, failRate: 18, flaky: 2 },
    { module: 'Citizen Info', testcases: 68, runs7d: 20, failRate: 27, flaky: 3 },
    { module: 'Upload hồ sơ', testcases: 41, runs7d: 9, failRate: 8, flaky: 1 },
    { module: 'Thanh toán', testcases: 27, runs7d: 6, failRate: 15, flaky: 2 },
  ];

  highlights: HighlightTest[] = [
    {
      id: 'TC_LOGIN_006',
      title: 'Đăng nhập nhiều lần sai liên tiếp (lock account)',
      module: 'Login',
      type: 'flaky',
      note: 'Lúc pass lúc fail, nghi ngờ timing / selector.',
    },
    {
      id: 'TC_CITIZEN_012',
      title: 'Không load được thông tin dân cư khi timeout API',
      module: 'Citizen Info',
      type: 'failed',
      note: 'Fail 3 lần liên tiếp trong 7 ngày.',
    },
    {
      id: 'TC_PAYMENT_004',
      title: 'Thanh toán thất bại nhưng vẫn trừ tiền',
      module: 'Thanh toán',
      type: 'failed',
      note: 'Fail trên STG & PROD pipeline.',
    },
  ];

  jobs: JobStatus[] = [
    { name: 'Nightly CI', status: 'pass', lastRun: 'Hôm nay 02:05' },
    { name: 'Regression Sunday', status: 'missed', lastRun: 'Chủ nhật tuần trước (missed)' },
    { name: 'Smoke on Merge', status: 'pass', lastRun: 'Hôm qua 17:20' },
  ];

  testcaseDetails: Record<string, TestcaseDetail> = {
    TC_LOGIN_006: {
      id: 'TC_LOGIN_006',
      name: 'Dang nhap nhieu lan sai lien tiep (lock account)',
      preCondition: 'Nguoi dung co tai khoan hop le, o trang dang nhap.',
      priority: 'Medium',
      updatedAt: '29/12/2024 - Phuc',
      status: 'fail',
    },
    TC_CITIZEN_012: {
      id: 'TC_CITIZEN_012',
      name: 'Khong load duoc thong tin dan cu khi timeout API',
      preCondition: 'Nguoi dung o trang thong tin dan cu, API dang timeout.',
      priority: 'High',
      updatedAt: '30/01/2025 - Linh',
      status: 'fail',
    },
    TC_PAYMENT_004: {
      id: 'TC_PAYMENT_004',
      name: 'Thanh toan that bai nhung van tru tien',
      preCondition: 'Nguoi dung da dat hang thanh cong va den buoc thanh toan.',
      priority: 'High',
      updatedAt: '28/01/2025 - Quang',
      status: 'fail',
    },
  };

  selectedTestcaseDetail: TestcaseDetail | null = null;
  showTestcaseDetailModal = false;

  hoveredBar: { point: TrendPoint; metric: TrendMetric } | null = null;
  hoverPos = { x: 0, y: 0 };

  selectedRun: RunActivity | null = null;
  activeRunTab: 'overview' | 'html' = 'html';
  safeReportUrl: SafeResourceUrl | null = null;
  showRunDetailModal = false;

  onViewRunReport(run: RunActivity): void {
    if (run.reportUrl) {
      this.selectedRun = run;
      this.activeRunTab = 'html';
      this.safeReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(run.reportUrl);
      this.showRunDetailModal = true;
    } else {
      console.warn('Run chưa có report hoặc report không tồn tại.', run.id);
      this.showInlineToast('warn', `Run ${run.id} chưa có report để xem.`);
    }
  }

  closeRunDetail(): void {
    this.showRunDetailModal = false;
    this.selectedRun = null;
    this.safeReportUrl = null;
  }

  toast: { type: 'success' | 'warn' | 'danger'; message: string } | null = null;
  private toastTimer?: number;

  private showInlineToast(type: 'success' | 'warn' | 'danger', message: string) {
    this.toast = { type, message };
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, type === 'success' ? 3000 : 5000);
  }

  dismissToast() {
    this.toast = null;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }
  }

  onProjectChange(project: string): void {
    this.selectedProject = project;
    // TODO: sau này gọi API load thống kê theo project
  }

  onViewFullReport(): void {
    console.log('Điều hướng sang màn Run Test / Report Viewer cho project', this.selectedProject);
    // TODO: navigate routerLink tới trang Run Test / Report Viewer
  }

  getFailRateClass(value: number): string {
    if (value >= 25) return 'text-danger';
    if (value >= 15) return 'text-warn';
    return 'text-muted';
  }

  showTrendHover(point: TrendPoint, metric: TrendMetric, event: MouseEvent) {
    this.hoveredBar = { point, metric };
    this.updateHoverPos(event);
  }

  updateHoverPos(event: MouseEvent) {
    const container = this.trendChartArea?.nativeElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    this.hoverPos = {
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top + 12,
    };
  }

  hideTrendHover() {
    this.hoveredBar = null;
  }

  onOpenTestcase(testcase: HighlightTest) {
    const detail = this.testcaseDetails[testcase.id];
    this.selectedTestcaseDetail = detail ?? {
      id: testcase.id,
      name: testcase.title,
      preCondition: 'Chua khai bao tien dieu kien.',
      priority: 'Medium',
      updatedAt: 'Chua cap nhat',
      status: testcase.type === 'failed' ? 'fail' : 'flaky',
    };
    this.showTestcaseDetailModal = true;
  }

  closeTestcaseDetail() {
    this.showTestcaseDetailModal = false;
    this.selectedTestcaseDetail = null;
  }
}
