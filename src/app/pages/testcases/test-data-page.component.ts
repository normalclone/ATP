import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

type Priority = 'High' | 'Medium' | 'Low';
type ProjectCode = 'DVCLT' | 'CSKCB_V2' | 'CTDL' | 'TWD' | 'OTHER';

interface Testcase {
  id: string;
  title: string;
  priority: Priority;
  tags: string[];
  module: string;
  moduleCode?: string;
  project: ProjectCode;
  updatedAt: string;
  preCondition?: string;
  description?: string;
  lastResult?: string;
  owner?: string;
  lastRunId?: string;
  status?: 'pass' | 'fail' | 'flaky';
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

interface ImportRow {
  tcId: string;
  title: string;
  module?: string;
  priority?: string;
  steps?: string;
  errorReason?: string;
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
    { label: 'Ưu tiên High', value: 240, badge: '19.3%', tone: 'danger' },
    { label: 'Ưu tiên Medium', value: 700, badge: '56.5%', tone: 'warn' },
    { label: 'Ưu tiên Low', value: 300, badge: '24.2%', tone: 'success' },
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
  showDetailModal = false;
  showHistoryModal = false;
  selectedTestcase: Testcase | null = null;

  filteredTestcases: Testcase[] = [];
  pagedTestcases: Testcase[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 1;
  showImportModal = false;
  uploadInProgress = false;
  uploadPercent = 0;
  importing = false;
  fileSelected = false;
  selectedFileName = '';
  importDescription = '';
  importProject: string | null = 'Automation Project';
  importMode: 'override' | 'append' | 'skip-errors' = 'append';
  validRows: ImportRow[] = [];
  errorRows: ImportRow[] = [];
  private allTestcases: Testcase[] = [
    {
      id: 'TC_LOGIN_001',
      title: 'Dang nhap voi tai khoan hop le',
      priority: 'High',
      tags: ['smoke'],
      module: 'Login',
      moduleCode: 'L',
      project: 'DVCLT',
      updatedAt: '03/02/2025 - Phuc',
      preCondition: 'Nguoi dung o trang dang nhap, co tai khoan hop le.',
      description: 'Kiem tra dang nhap thanh cong khi thong tin hop le.',
      status: 'pass',
      lastRunId: '#324',
    },
    {
      id: 'TC_LOGIN_002',
      title: 'Dang nhap sai mat khau',
      priority: 'High',
      tags: ['auth'],
      module: 'Login',
      moduleCode: 'L',
      project: 'DVCLT',
      updatedAt: '03/02/2025 - Phuc',
      preCondition: 'Nguoi dung o trang dang nhap.',
      description: 'Thong bao loi dung, khong lock account khi nhap sai 1 lan.',
      status: 'pass',
      lastRunId: '#324',
    },
    {
      id: 'TC_LOGIN_003',
      title: 'Dang nhap tai khoan bi khoa',
      priority: 'Medium',
      tags: ['auth'],
      module: 'Login',
      moduleCode: 'L',
      project: 'CSKCB_V2',
      updatedAt: '20/01/2025 - Tuyet',
      preCondition: 'Tai khoan dang o trang thai khoa.',
      description: 'Tai khoan khoa khong duoc dang nhap, hien thi thong bao ro rang.',
      status: 'pass',
      lastRunId: '#323',
    },
    {
      id: 'TC_LOGIN_004',
      title: 'Dang nhap bo trong username',
      priority: 'Low',
      tags: ['form'],
      module: 'Login',
      moduleCode: 'L',
      project: 'CSKCB_V2',
      updatedAt: '15/01/2025 - Toan',
      preCondition: 'Nguoi dung o trang dang nhap.',
      description: 'Validate truong username, hien thi loi bat buoc.',
      status: 'pass',
      lastRunId: '#323',
    },
    {
      id: 'TC_LOGIN_005',
      title: 'Dang nhap bo trong password',
      priority: 'Low',
      tags: ['form'],
      module: 'Login',
      moduleCode: 'L',
      project: 'CTDL',
      updatedAt: '15/01/2025 - Toan',
      preCondition: 'Nguoi dung o trang dang nhap.',
      description: 'Validate truong password, hien thi loi bat buoc.',
      status: 'pass',
      lastRunId: '#323',
    },
    {
      id: 'TC_LOGIN_006',
      title: 'Dang nhap nhieu lan sai lien tiep (lock account)',
      priority: 'Medium',
      tags: ['security'],
      module: 'Login',
      moduleCode: 'L',
      project: 'TWD',
      updatedAt: '29/12/2024 - Phuc',
      preCondition: 'Nguoi dung co tai khoan hop le, o trang dang nhap.',
      description: 'Tai khoan bi lock sau 5 lan sai, thong bao khoi tao unlock.',
      status: 'fail',
      lastRunId: '#325',
    },
    {
      id: 'TC_CITIZEN_012',
      title: 'Khong load duoc thong tin dan cu khi timeout API',
      priority: 'High',
      tags: ['regression', 'api'],
      module: 'Citizen Info',
      moduleCode: 'CI',
      project: 'DVCLT',
      updatedAt: '30/01/2025 - Linh',
      preCondition: 'Nguoi dung o trang thong tin dan cu, API thong tin dan cu dang timeout.',
      description: 'Xu ly fallback UI va retry khi API thong tin dan cu timeout.',
      status: 'fail',
      lastRunId: '#325',
    },
    {
      id: 'TC_PAYMENT_004',
      title: 'Thanh toan that bai nhung van tru tien',
      priority: 'High',
      tags: ['payment', 'critical'],
      module: 'Thanh toA?n',
      moduleCode: 'PAY',
      project: 'DVCLT',
      updatedAt: '28/01/2025 - Quang',
      preCondition: 'Nguoi dung da dat hang thanh cong, chuyen sang buoc thanh toan.',
      description: 'Rollback giao dich va thong bao nguoi dung khi payment fail.',
      status: 'fail',
      lastRunId: '#325',
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

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.filterTestcases(true);
    this.route.queryParamMap.subscribe((params) => {
      const testcaseId = params.get('testcase');
      if (testcaseId) {
        this.openTestcaseDetailById(testcaseId);
      }
    });
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
    this.resetImportState();
    this.showImportModal = true;
  }

  closeImport() {
    this.showImportModal = false;
    this.importing = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fileSelected = true;
    this.selectedFileName = file.name;
    this.uploadInProgress = true;
    this.uploadPercent = 0;
    this.validRows = [];
    this.errorRows = [];
    const steps = [20, 45, 70, 100];
    steps.forEach((val, idx) => {
      setTimeout(() => {
        this.uploadPercent = val;
        if (val === 100) {
          this.uploadInProgress = false;
          this.populatePreviewData();
        }
      }, 200 * (idx + 1));
    });
  }

  onImport() {
    if (!this.canImport) return;
    this.importing = true;
    setTimeout(() => {
      this.importing = false;
      this.showImportModal = false;
    }, 500);
  }

  get canImport(): boolean {
    return !this.uploadInProgress && this.fileSelected && this.errorRows.length === 0 && this.validRows.length > 0;
  }

  openTestcaseDetail(testcase: Testcase) {
    this.selectedTestcase = testcase;
    this.showDetailModal = true;
  }

  openTestcaseDetailById(testcaseId: string) {
    const testcase = this.findTestcaseById(testcaseId);
    if (!testcase) return;
    this.syncSelectionForTestcase(testcase);
    this.openTestcaseDetail(testcase);
  }

  closeTestcaseDetail() {
    this.showDetailModal = false;
    this.selectedTestcase = null;
  }

  goToTestcaseManager() {
    this.closeTestcaseDetail();
    this.router.navigate(['/testcases']);
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

  private syncSelectionForTestcase(testcase: Testcase) {
    const moduleByCode = testcase.moduleCode
      ? this.modules.find((m) => m.code === testcase.moduleCode)
      : undefined;
    const moduleMatch = moduleByCode ?? this.modules.find((m) => m.name === testcase.module);
    if (moduleMatch) this.selectedModule = moduleMatch.code;
    this.filters.searchText = testcase.id;
    this.filterTestcases(true);
  }

  private findTestcaseById(testcaseId: string): Testcase | undefined {
    return this.allTestcases.find((tc) => tc.id === testcaseId);
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

  private resetImportState() {
    this.uploadInProgress = false;
    this.uploadPercent = 0;
    this.importing = false;
    this.fileSelected = false;
    this.selectedFileName = '';
    this.importDescription = '';
    this.importProject = null;
    this.importMode = 'append';
    this.validRows = [];
    this.errorRows = [];
  }

  private populatePreviewData() {
    this.validRows = [
      {
        tcId: 'TC_LOGIN_010',
        title: 'Reset password qua email',
        module: 'Login',
        priority: 'Medium',
        steps: 'Điền email hợp lệ, nhận mail reset',
      },
      {
        tcId: 'TC_PAY_021',
        title: 'Thanh toán thẻ Visa 3DS',
        module: 'Payment',
        priority: 'High',
        steps: 'Điền thẻ, qua 3DS, xác nhận thành công',
      },
      {
        tcId: 'TC_CI_112',
        title: 'Tìm kiếm công dân theo CCCD',
        module: 'Citizen Info',
        priority: 'Low',
        steps: 'Nhập CCCD hợp lệ, hiển thị thông tin',
      },
    ];

    this.errorRows = [
      {
        tcId: 'TC_LOGIN_099',
        title: 'Đăng nhập bỏ trống password',
        module: 'Login',
        priority: 'High',
        steps: 'Bỏ trống password',
        errorReason: 'Thiếu cột Expected Result',
      },
      {
        tcId: 'TC_PAY_099',
        title: 'Thanh toán COD cho đơn quốc tế',
        module: 'Payment',
        priority: 'Medium',
        steps: 'COD không áp dụng quốc tế',
        errorReason: 'Giá trị Priority không hợp lệ',
      },
    ];
  }
}
