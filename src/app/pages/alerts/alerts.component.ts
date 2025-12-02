import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Tone = 'primary' | 'success' | 'warn' | 'danger';

interface SummaryItem {
  id: string;
  label: string;
  value: string;
  badgeTone: Tone;
  subLabel?: string;
}

interface AlertRow {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  module: string;
  occurrences: number;
  lastSeen: string;
  testcaseKey: string;
  lastRunId: string;
}

interface FlakyRow {
  testcaseKey: string;
  flakyScore: number;
  runsCount: number;
  lastStatus: 'pass' | 'fail' | 'running';
}

interface ModuleRiskRow {
  module: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  failureTrend: string;
  coverage: string;
  recentChanges: string;
}

interface RootCauseBlock {
  title: string;
  content: string;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  dateRange = '7 ngày gần đây';
  projectFilter = 'Tất cả project';
  severityFilter = 'Tất cả';
  activeRightTab: 'flaky' | 'module' | 'root' = 'flaky';

  summaryItems: SummaryItem[] = [
    { id: 'failedTestsToday', label: 'Failed tests (hôm nay)', value: '18', badgeTone: 'danger' },
    { id: 'flakyTests', label: 'Flaky tests', value: '12', badgeTone: 'warn' },
    { id: 'repeatedFailures', label: 'Lỗi lặp lại', value: '7', badgeTone: 'danger' },
    { id: 'moduleRisk', label: 'Module risk score', value: 'High', badgeTone: 'danger' },
    { id: 'stabilityIndex', label: 'Stability index', value: '82%', badgeTone: 'primary' },
    { id: 'averageDurationDelta', label: 'Avg duration (Δ)', value: '+6%', badgeTone: 'warn' },
  ];

  // Fake data for charts
  failureTrend = [
    { day: 'T2', fail: 5, flaky: 2 },
    { day: 'T3', fail: 7, flaky: 3 },
    { day: 'T4', fail: 4, flaky: 1 },
    { day: 'T5', fail: 6, flaky: 2 },
    { day: 'T6', fail: 8, flaky: 2 },
    { day: 'T7', fail: 3, flaky: 1 },
    { day: 'CN', fail: 2, flaky: 1 },
  ];

  topModules = [
    { module: 'Payments', fails: 12 },
    { module: 'Login', fails: 9 },
    { module: 'Citizen Info', fails: 7 },
    { module: 'Profile', fails: 5 },
    { module: 'Upload', fails: 4 },
  ];

  errorTypes = [
    { type: 'Timeout', percent: 35 },
    { type: 'Element not found', percent: 25 },
    { type: 'API 5xx', percent: 20 },
    { type: 'Assertion', percent: 12 },
    { type: 'Data', percent: 8 },
  ];

  passFailRatio = [
    { label: 'Pass', percent: 78 },
    { label: 'Fail', percent: 18 },
    { label: 'Skip', percent: 4 },
  ];

  alerts: AlertRow[] = [
    {
      id: 'AL-001',
      severity: 'high',
      title: 'Timeout khi thanh toán trên STG',
      module: 'Payments',
      occurrences: 5,
      lastSeen: 'Hôm nay 09:30',
      testcaseKey: 'TC_PAYMENT_004',
      lastRunId: '#325',
    },
    {
      id: 'AL-002',
      severity: 'medium',
      title: 'Element not found: button Submit',
      module: 'Citizen Info',
      occurrences: 3,
      lastSeen: 'Hôm nay 08:40',
      testcaseKey: 'TC_CITIZEN_012',
      lastRunId: '#324',
    },
    {
      id: 'AL-003',
      severity: 'low',
      title: 'API 5xx sporadic',
      module: 'Login',
      occurrences: 2,
      lastSeen: 'Hôm qua 17:10',
      testcaseKey: 'TC_LOGIN_006',
      lastRunId: '#322',
    },
  ];

  flakyRows: FlakyRow[] = [
    { testcaseKey: 'TC_LOGIN_006', flakyScore: 32, runsCount: 18, lastStatus: 'fail' },
    { testcaseKey: 'TC_CITIZEN_012', flakyScore: 22, runsCount: 12, lastStatus: 'pass' },
    { testcaseKey: 'TC_PAYMENT_004', flakyScore: 18, runsCount: 20, lastStatus: 'fail' },
  ];

  moduleRiskRows: ModuleRiskRow[] = [
    { module: 'Payments', riskLevel: 'High', failureTrend: 'Tăng 20% tuần này', coverage: '78%', recentChanges: 'Nhiều merge hôm qua' },
    { module: 'Login', riskLevel: 'Medium', failureTrend: 'Ổn định', coverage: '85%', recentChanges: 'Ít thay đổi' },
    { module: 'Citizen Info', riskLevel: 'Low', failureTrend: 'Giảm 10%', coverage: '72%', recentChanges: 'Không đổi' },
  ];

  rootCauseBlocks: RootCauseBlock[] = [
    {
      title: 'Tổng kết',
      content:
        'TC_PAYMENT_004 thất bại 5 lần liên tiếp. 80% khả năng lỗi backend API /payment, 15% sai data test, 5% lỗi selector UI.',
    },
    {
      title: 'Xác suất nguyên nhân',
      content: 'Backend 80%, Test data 15%, UI selector 5%.',
    },
    {
      title: 'Đề xuất xử lý',
      content: 'Kiểm tra log backend, ổn định data, thêm wait theo API.',
    },
    {
      title: 'Thao tác nhanh',
      content: 'Tạo ticket JIRA, gắn vào báo cáo tuần, ping module owner.',
    },
  ];

  // Drawer state
  showAlertDrawer = false;
  selectedAlert: AlertRow | null = null;

  openAlertDrawer(alert: AlertRow) {
    this.selectedAlert = alert;
    this.showAlertDrawer = true;
  }

  closeAlertDrawer() {
    this.showAlertDrawer = false;
    this.selectedAlert = null;
  }

  severityClass(sev: AlertRow['severity']): string {
    if (sev === 'high') return 'badge-danger';
    if (sev === 'medium') return 'badge-warn';
    return 'badge-primary';
  }

  flakyBadgeClass(score: number): string {
    if (score >= 30) return 'badge-danger';
    if (score >= 20) return 'badge-warn';
    return 'badge-primary';
  }

  riskBadgeClass(level: ModuleRiskRow['riskLevel']): string {
    if (level === 'High') return 'badge-danger';
    if (level === 'Medium') return 'badge-warn';
    return 'badge-success';
  }
}
