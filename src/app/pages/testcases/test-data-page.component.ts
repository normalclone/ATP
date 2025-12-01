import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Priority = 'High' | 'Medium' | 'Low';
type ProjectCode = 'DVCLT' | 'CSKCB_V2' | 'CTDL' | 'TWD' | 'OTHER';

interface Testcase {
  id: string;
  title: string;
  priority: Priority;
  tags: string[];
  module: string;
  project: ProjectCode;
  updatedAt: string;
}

interface Module {
  code: string;
  name: string;
  testcaseCount: number;
}

interface ImportHistory {
  title: string;
  badge: string;
  meta: string[];
}

interface SummaryMetric {
  label: string;
  value: number;
  badge: string;
  tone: 'primary' | 'danger' | 'warn' | 'success';
}

type FilterValue = 'all' | string;

@Component({
  selector: 'app-test-data-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-data-page.component.html',
  styleUrls: ['./test-data-page.component.scss'],
})
export class TestDataPageComponent implements OnInit {
  modules: Module[] = [
    { code: 'L', name: 'Login', testcaseCount: 24 },
    { code: 'CI', name: 'Citizen Info', testcaseCount: 68 },
    { code: 'HS', name: 'Upload hồ sơ', testcaseCount: 41 },
    { code: 'DUY', name: 'Duyệt hồ sơ', testcaseCount: 32 },
    { code: 'TRC', name: 'Tra cứu', testcaseCount: 19 },
    { code: 'API', name: 'API Mobile', testcaseCount: 53 },
    { code: 'PAY', name: 'Thanh toán', testcaseCount: 27 },
    { code: 'SYS', name: 'Cấu hình hệ thống', testcaseCount: 10 },
  ];

  summaryCards: SummaryMetric[] = [
    { label: 'Tổng số testcase', value: 1240, badge: '+32 mới', tone: 'primary' },
    { label: 'Ưu tiên cao', value: 240, badge: '19.3%', tone: 'danger' },
    { label: 'Ưu tiên trung bình', value: 700, badge: '56.5%', tone: 'warn' },
    { label: 'Ưu tiên thấp', value: 300, badge: '24.2%', tone: 'success' },
  ];

  filterOptions = {
    priority: ['Tất cả', 'High', 'Medium', 'Low'],
    tag: ['Tất cả', 'smoke', 'regression', 'auth', 'file', 'security', 'form'],
    project: ['Tất cả', 'DVCLT', 'CSKCB_V2', 'CTDL', 'TWD'],
  };

  filters: { searchText: string; priority: FilterValue; tag: FilterValue; project: FilterValue } = {
    searchText: '',
    priority: 'all',
    tag: 'all',
    project: 'all',
  };

  selectedModule = this.modules[0].code;
  isLoading = false;
  showHistoryModal = false;

  filteredTestcases: Testcase[] = [];
  pagedTestcases: Testcase[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 1;

  private allTestcases: Testcase[] = [
    {
      id: 'TC_LOGIN_001',
      title: 'Đăng nhập với tài khoản hợp lệ',
      priority: 'High',
      tags: ['smoke'],
      module: 'Login',
      project: 'DVCLT',
      updatedAt: '03/02/2025 - Phúc',
    },
    {
      id: 'TC_LOGIN_002',
      title: 'Đăng nhập sai mật khẩu',
      priority: 'High',
      tags: ['auth'],
      module: 'Login',
      project: 'DVCLT',
      updatedAt: '03/02/2025 - Phúc',
    },
    {
      id: 'TC_LOGIN_003',
      title: 'Đăng nhập tài khoản bị khóa',
      priority: 'Medium',
      tags: ['auth'],
      module: 'Login',
      project: 'CSKCB_V2',
      updatedAt: '20/01/2025 - Tuyết',
    },
    {
      id: 'TC_LOGIN_004',
      title: 'Đăng nhập khi bỏ trống username',
      priority: 'Low',
      tags: ['form'],
      module: 'Login',
      project: 'CSKCB_V2',
      updatedAt: '15/01/2025 - Toàn',
    },
    {
      id: 'TC_LOGIN_005',
      title: 'Đăng nhập khi bỏ trống password',
      priority: 'Low',
      tags: ['form'],
      module: 'Login',
      project: 'CTDL',
      updatedAt: '15/01/2025 - Toàn',
    },
    {
      id: 'TC_LOGIN_006',
      title: 'Đăng nhập nhiều lần sai liên tiếp (lock account)',
      priority: 'Medium',
      tags: ['security'],
      module: 'Login',
      project: 'TWD',
      updatedAt: '29/12/2024 - Phúc',
    },
  ];

  importHistory: ImportHistory[] = [
    {
      title: 'Import #18 - 03/02/2025',
      badge: '312 testcase',
      meta: ['Người thực hiện: Phúc', 'Module: Login, Citizen Info', 'File: tc_full_2025_02_03.xlsx'],
    },
    {
      title: 'Import #17 - 20/01/2025',
      badge: '156 testcase',
      meta: ['Người thực hiện: Tuyết', 'Module: Login', 'File: tc_login_2025_01_20.xlsx'],
    },
    {
      title: 'Import #16 - 05/01/2025',
      badge: '98 testcase',
      meta: ['Người thực hiện: Toàn', 'Module: Upload hồ sơ', 'File: tc_upload_2025_01_05.xlsx'],
    },
    {
      title: 'Import #15 - 29/12/2024',
      badge: '240 testcase',
      meta: ['Người thực hiện: Phúc', 'Module: Login, Tra cứu', 'File: tc_pack_2024_12_29.xlsx'],
    },
  ];

  ngOnInit() {
    this.filterTestcases(true);
  }

  get currentModuleName(): string {
    return this.modules.find((m) => m.code === this.selectedModule)?.name ?? '';
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, idx) => idx + 1);
  }

  selectModule(code: string) {
    if (code === this.selectedModule) return;
    this.selectedModule = code;
    this.applyFilters(true);
  }

  resetFilters() {
    this.filters = { searchText: '', priority: 'all', tag: 'all', project: 'all' };
    this.applyFilters(true);
  }

  applyFilters(resetPage = true) {
    this.filterTestcases(resetPage);
    this.triggerLoading();
  }

  onPageChange(page: number) {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.updatePagedTestcases();
  }

  openHistory() {
    this.showHistoryModal = true;
  }

  closeHistory() {
    this.showHistoryModal = false;
  }

  startImport() {
    // TODO: Wire real import flow
    console.log('Import triggered for module', this.currentModuleName);
  }

  priorityBadgeClasses(priority: Priority) {
    switch (priority) {
      case 'High':
        return 'bg-danger-soft border border-danger-border text-text-badge-danger';
      case 'Medium':
        return 'bg-warn-soft border border-warn-border text-text-badge-warn';
      default:
        return 'bg-success-soft border border-success-border text-text-badge-success';
    }
  }

  private filterTestcases(resetPage = false) {
    let rows = this.allTestcases.filter((tc) => tc.module === this.currentModuleName);

    if (this.filters.priority !== 'all') {
      rows = rows.filter((tc) => tc.priority === this.filters.priority);
    }

    if (this.filters.tag !== 'all') {
      rows = rows.filter((tc) => tc.tags.includes(this.filters.tag));
    }

    if (this.filters.project !== 'all') {
      rows = rows.filter((tc) => tc.project === this.filters.project);
    }

    const keyword = this.filters.searchText.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(
        (tc) =>
          tc.id.toLowerCase().includes(keyword) ||
          tc.title.toLowerCase().includes(keyword) ||
          tc.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }

    this.filteredTestcases = rows;
    this.totalItems = rows.length;
    if (resetPage) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.updatePagedTestcases();
  }

  private updatePagedTestcases() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTestcases = this.filteredTestcases.slice(start, end);
  }

  private triggerLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400);
  }
}
