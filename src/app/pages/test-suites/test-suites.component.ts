import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type Tone = 'primary' | 'success' | 'warn' | 'danger';

interface SuiteItem {
  id: string;
  name: string;
  project: string;
  tag: { label: string; tone: Tone } | null;
  specs: number;
  description?: string;
}

interface SuiteForm {
  suiteName: string;
  project: string;
  environment: string;
  description: string;
  tags: string;
}

interface SpecRow {
  id: string;
  name: string;
  module: string;
  tags: string[];
  lastRun: string;
  selected: boolean;
}

@Component({
  selector: 'app-test-suites',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './test-suites.component.html',
  styleUrls: ['./test-suites.component.scss'],
})
export class TestSuitesComponent {
  @ViewChild('suiteNameInput') suiteNameInput?: ElementRef<HTMLInputElement>;

  suites: SuiteItem[] = [
    { id: 'SUITE-001', name: 'Login – Full Flow', project: 'DVCLT', tag: { label: 'smoke', tone: 'primary' }, specs: 5 },
    { id: 'SUITE-002', name: 'Payments – Regression', project: 'CSKCB_V2', tag: { label: 'regression', tone: 'warn' }, specs: 12 },
    { id: 'SUITE-003', name: 'API – Mobile', project: 'CTDL', tag: { label: 'api', tone: 'success' }, specs: 8 },
    { id: 'SUITE-004', name: 'Scheduler – Nightly', project: 'TWD', tag: { label: 'nightly', tone: 'primary' }, specs: 6 },
  ];

  selectedSuiteId = this.suites[0]?.id ?? '';
  isNewSuite = false;
  suiteSearch = '';
  deleteModalOpen = false;
  suiteToDelete: SuiteItem | null = null;
  deleteLoading = false;
  deleteSuccessMsg = '';
  deleteErrorMsg = '';
  private deleteToastTimer?: number;

  suiteForm: SuiteForm = {
    suiteName: this.suites[0]?.name ?? '',
    project: this.suites[0]?.project ?? '',
    environment: '',
    description: 'Suite kiểm tra luồng đăng nhập đầy đủ.',
    tags: 'smoke, auth',
  };

  specs: SpecRow[] = [
    { id: 'SPEC-001', name: 'login.spec.ts', module: 'Login', tags: ['smoke'], lastRun: '03/02/2025 • Passed', selected: true },
    { id: 'SPEC-002', name: 'payment.regression.spec.ts', module: 'Payment', tags: ['regression'], lastRun: '01/02/2025 • 2 fail', selected: true },
    { id: 'SPEC-003', name: 'profile-upload.spec.ts', module: 'Upload', tags: ['upload'], lastRun: '28/01/2025 • Skipped', selected: false },
    { id: 'SPEC-004', name: 'scheduler-monitor.spec.ts', module: 'Scheduler', tags: ['cron'], lastRun: '25/01/2025 • Passed', selected: false },
    { id: 'SPEC-005', name: 'api-mobile.spec.ts', module: 'API', tags: ['api'], lastRun: '20/01/2025 • Passed', selected: false },
  ];

  specSearch = '';
  moduleFilter = 'Tất cả';
  tagFilter = 'Tất cả';
  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  get filteredSuites(): SuiteItem[] {
    const keyword = this.suiteSearch.trim().toLowerCase();
    if (!keyword) return this.suites;
    return this.suites.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.project.toLowerCase().includes(keyword) ||
        s.tag?.label.toLowerCase().includes(keyword)
    );
  }

  get filteredSpecs(): SpecRow[] {
    const keyword = this.specSearch.trim().toLowerCase();
    return this.specs.filter((s) => {
      const matchKeyword =
        !keyword ||
        s.name.toLowerCase().includes(keyword) ||
        s.module.toLowerCase().includes(keyword) ||
        s.tags.some((t) => t.toLowerCase().includes(keyword));
      const matchModule = this.moduleFilter === 'Tất cả' || s.module === this.moduleFilter;
      const matchTag = this.tagFilter === 'Tất cả' || s.tags.includes(this.tagFilter);
      return matchKeyword && matchModule && matchTag;
    });
  }

  get pagedSpecs(): SpecRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSpecs.slice(start, start + this.pageSize);
  }

  get totalSpecs(): number {
    return this.filteredSpecs.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalSpecs / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, idx) => idx + 1);
  }

  get selectedSpecCount(): number {
    return this.specs.filter((s) => s.selected).length;
  }

  get moduleOptions(): string[] {
    const uniques = Array.from(new Set(this.specs.map((s) => s.module)));
    return ['Tất cả', ...uniques];
  }

  get tagOptions(): string[] {
    const uniques = Array.from(new Set(this.specs.flatMap((s) => s.tags)));
    return ['Tất cả', ...uniques];
  }

  selectSuite(id: string) {
    this.selectedSuiteId = id;
    this.isNewSuite = false;
    const suite = this.suites.find((s) => s.id === id);
    if (suite) {
      this.suiteForm.suiteName = suite.name;
      this.suiteForm.project = suite.project;
      this.suiteForm.environment = '';
      this.suiteForm.description = suite.description ?? '';
      this.suiteForm.tags = suite.tag ? suite.tag.label : '';
      this.specs.forEach((s) => (s.selected = false));
    }
  }

  startNewSuite() {
    this.selectedSuiteId = '';
    this.isNewSuite = true;
    this.suiteForm = {
      suiteName: '',
      project: '',
      environment: '',
      description: '',
      tags: '',
    };
    this.specs.forEach((s) => (s.selected = false));
    setTimeout(() => {
      this.suiteNameInput?.nativeElement?.focus();
    });
  }

  toggleSpec(spec: SpecRow, checked: boolean) {
    spec.selected = checked;
  }

  toggleSelectAll(checked: boolean) {
    for (const row of this.pagedSpecs) {
      row.selected = checked;
    }
  }

  resetSuiteForm() {
    if (this.isNewSuite) {
      this.startNewSuite();
    } else {
      this.selectSuite(this.selectedSuiteId);
    }
  }

  saveSuiteForm() {
    // TODO: wire API save suite config
  }

  resetSuiteSpecs() {
    this.specs.forEach((s) => (s.selected = false));
  }

  saveSuiteSpecs() {
    // TODO: wire API save suite-spec mapping
  }

  openDeleteConfirm(suite: SuiteItem) {
    this.suiteToDelete = suite;
    this.deleteModalOpen = true;
    this.deleteLoading = false;
    this.deleteErrorMsg = '';
    this.deleteSuccessMsg = '';
    this.clearToastTimer();
  }

  closeDeleteConfirm() {
    this.deleteModalOpen = false;
    this.suiteToDelete = null;
  }

  confirmDeleteSuite() {
    if (!this.suiteToDelete || this.deleteLoading) return;
    this.deleteLoading = true;
    this.deleteErrorMsg = '';
    this.deleteSuccessMsg = '';

    try {
      // TODO: replace with real API call delete suite by ID
      const removedId = this.suiteToDelete.id;
      this.suites = this.suites.filter((s) => s.id !== removedId);

      if (this.selectedSuiteId === removedId) {
        if (this.suites.length > 0) {
          this.selectSuite(this.suites[0].id);
        } else {
          this.startNewSuite();
        }
      }

      this.deleteSuccessMsg = 'Xoá Test Suite thành công.';
      this.startToastTimer('success');
      this.closeDeleteConfirm();
    } catch (e) {
      this.deleteErrorMsg = 'Không thể xoá Test Suite. Vui lòng thử lại hoặc liên hệ quản trị.';
      this.startToastTimer('error');
    } finally {
      this.deleteLoading = false;
    }
  }

  dismissSuccessToast() {
    this.deleteSuccessMsg = '';
    this.clearToastTimer();
  }

  dismissErrorToast() {
    this.deleteErrorMsg = '';
    this.clearToastTimer();
  }

  private startToastTimer(kind: 'success' | 'error') {
    this.clearToastTimer();
    const duration = kind === 'success' ? 4000 : 6000;
    this.deleteToastTimer = window.setTimeout(() => {
      if (kind === 'success') {
        this.deleteSuccessMsg = '';
      } else {
        this.deleteErrorMsg = '';
      }
    }, duration);
  }

  private clearToastTimer() {
    if (this.deleteToastTimer) {
      window.clearTimeout(this.deleteToastTimer);
      this.deleteToastTimer = undefined;
    }
  }

  onSpecFiltersChange() {
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    if (page < 1) return;
    const max = this.totalPages;
    this.currentPage = Math.min(page, max);
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }
}
