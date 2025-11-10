import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

interface ColorToken {
  label: string;
  token: string;
  sampleClass: string;
  value: string;
}

interface TypographySample {
  label: string;
  class: string;
  usage: string;
}

interface SpacingToken {
  label: string;
  width: string;
}

interface ButtonVariant {
  label: string;
  classes: string;
}

interface ButtonSize {
  label: string;
  classes: string;
}

interface BadgeVariant {
  label: string;
  classes: string;
}

interface InputField {
  id: string;
  label: string;
  placeholder: string;
  state: 'default' | 'error' | 'disabled' | 'readonly';
  helper?: string;
}

interface ToggleItem {
  label: string;
  description: string;
  checked: boolean;
}

interface TableRow {
  suite: string;
  env: string;
  status: 'success' | 'warning' | 'danger';
  duration: string;
  owner: string;
}

interface AlertItem {
  title: string;
  description: string;
  variant: 'success' | 'info' | 'warn' | 'danger';
  action?: string;
}

interface TabGroup {
  id: string;
  label: string;
  tabs: { name: string; active: boolean }[];
  variant: 'underline' | 'pill';
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PaginationButton {
  label: string;
  active?: boolean;
  disabled?: boolean;
}

interface ProgressState {
  label: string;
  value: number;
  tone: 'primary' | 'warn' | 'danger';
}

type CodeSampleMap = Record<string, string>;

interface GallerySection {
  id: keyof ComponentsGalleryComponent['codeSamples'];
  title: string;
  description: string;
  colSpan?: string;
}

@Component({
  selector: 'app-components-gallery',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-bg via-bg to-bg-deep text-text">
      <section class="mx-auto max-w-[1400px] space-y-6 px-4 py-8 lg:px-6">
        <header class="rounded-2xl border border-border-soft bg-bg-elev/70 p-6 shadow-soft/40">
          <p class="text-xs uppercase tracking-[0.2em] text-text-dim">Design System</p>
          <div class="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-text">Thư viện thành phần ATP</h1>
              <p class="mt-2 max-w-3xl text-sm text-text-dim">
                Token màu, font, pattern button/form/bảng/modal dùng chung cho toàn ứng dụng.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a
                class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-white/5 px-4 py-2 text-sm text-text transition hover:bg-white/10"
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noreferrer"
                >Tailwind docs</a
              >
              <button
                type="button"
                class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-text transition hover:bg-primary-hover"
              >
                Sao chép token
              </button>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            *ngFor="let section of sections"
            class="rounded-2xl border border-border-soft bg-bg-elev p-5 shadow-soft/30"
            [ngClass]="section.colSpan"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-text">{{ section.title }}</h3>
                <p class="text-xs text-text-dim">{{ section.description }}</p>
              </div>
              <button
                type="button"
                class="text-xs text-text-dim underline-offset-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                (click)="toggleCode(section.id)"
              >
                {{ isCodeVisible(section.id) ? 'Ẩn code' : 'Xem code' }}
              </button>
            </div>

            <ng-container [ngSwitch]="section.id">
              <ng-container *ngSwitchCase="'foundation-colors'">
                <div class="mt-4 space-y-3">
                  <div
                    *ngFor="let token of colorTokens"
                    class="flex items-center gap-3 rounded-xl border border-border-subtle bg-white/5 p-3"
                  >
                    <div class="h-10 w-12 rounded-lg border border-border-subtle" [ngClass]="token.sampleClass"></div>
                    <div>
                      <p class="text-sm font-medium">{{ token.label }}</p>
                      <p class="text-xs text-text-dim">{{ token.token }} · {{ token.value }}</p>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'foundation-typo'">
                <div class="mt-4 space-y-3">
                  <div *ngFor="let type of typeScale" class="rounded-xl border border-border-subtle bg-white/5 p-3">
                    <p [ngClass]="type.class">{{ type.label }}</p>
                    <p class="text-xs text-text-dim">{{ type.usage }}</p>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'foundation-spacing'">
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs uppercase text-text-dim">Spacing</p>
                    <div class="mt-2 space-y-2">
                      <div *ngFor="let space of spacingScale" class="flex items-center gap-3">
                        <div class="flex-1 rounded-full bg-white/5">
                          <div class="h-2 rounded-full bg-primary" [style.width]="space.width"></div>
                        </div>
                        <span class="w-20 text-xs text-text-dim">{{ space.label }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-center text-xs text-text-dim">
                    <div class="rounded-2xl border border-border-subtle bg-white/5 p-3">rounded-2xl · Card</div>
                    <div class="rounded-xl border border-border-subtle bg-white/5 p-3">rounded-xl · Input</div>
                    <div class="rounded-lg border border-border-subtle bg-white/5 p-3">rounded-lg · Tooltip</div>
                    <div class="rounded-full border border-border-subtle bg-white/5 p-3">rounded-full · Pill</div>
                  </div>
                  <div class="rounded-2xl border border-border-subtle bg-white/5 p-4 text-center shadow-soft">
                    shadow-soft · 0 8px 30px rgba(0,0,0,.35)
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'buttons'">
                <div class="mt-4 space-y-5">
                  <div *ngFor="let size of buttonSizes" class="flex flex-wrap gap-3">
                    <button
                      *ngFor="let variant of buttonVariants"
                      type="button"
                      class="inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      [ngClass]="size.classes + ' ' + variant.classes"
                    >
                      {{ variant.label }} · {{ size.label }}
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-3">
                    <button
                      type="button"
                      class="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 font-medium text-text shadow-soft transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <span class="h-3 w-3 animate-spin rounded-full border-2 border-white/50 border-t-transparent"></span>
                      Loading
                    </button>
                    <button
                      type="button"
                      disabled
                      class="inline-flex h-10 items-center rounded-xl border border-border-subtle px-4 font-medium text-text/50 opacity-60"
                    >
                      Disabled
                    </button>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'badges'">
                <div class="mt-4 space-y-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      *ngFor="let badge of badgeVariants"
                      class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                      [ngClass]="badge.classes"
                    >
                      {{ badge.label }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs">
                    <span class="rounded-full border border-border-subtle bg-white/5 px-3 py-1">Env · Production</span>
                    <span class="rounded-full border border-border-subtle bg-white/5 px-3 py-1">Status · Regression</span>
                    <span class="rounded-full border border-border-subtle bg-white/5 px-3 py-1">Priority · P1</span>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'inputs'">
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                  <div *ngFor="let field of inputFields" class="space-y-1">
                    <label class="text-xs text-text-dim" [for]="field.id">{{ field.label }}</label>
                    <ng-container [ngSwitch]="field.id === 'notes'">
                      <textarea
                        *ngSwitchCase="true"
                        rows="3"
                        [id]="field.id"
                        class="w-full rounded-xl border px-3 py-2 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/40"
                        [ngClass]="inputClass(field.state)"
                        [placeholder]="field.placeholder"
                        [readonly]="field.state === 'readonly'"
                        [disabled]="field.state === 'disabled'"
                      ></textarea>
                      <input
                        *ngSwitchDefault
                        [id]="field.id"
                        [type]="field.id === 'password' ? 'password' : 'text'"
                        class="h-10 w-full rounded-xl border px-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/40"
                        [ngClass]="inputClass(field.state)"
                        [placeholder]="field.placeholder"
                        [readonly]="field.state === 'readonly'"
                        [disabled]="field.state === 'disabled'"
                      />
                    </ng-container>
                    <p class="text-xs" [ngClass]="field.state === 'error' ? 'text-danger' : 'text-text-dim'">
                      {{ field.helper }}
                    </p>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-text-dim">Tìm kiếm</label>
                      <div
                        class="mt-1 flex h-10 items-center rounded-xl border border-border-subtle bg-white/5 px-3 text-sm text-text focus-within:ring-2 focus-within:ring-primary/40"
                      >
                        <lucide-icon name="search" class="mr-2 h-4 w-4 text-text-dim"></lucide-icon>
                        <input
                          class="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
                          placeholder="Tìm testcase, báo cáo..."
                        />
                        <button type="button" class="text-xs text-text-dim">Clear</button>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-text-dim">Select</label>
                      <div
                        class="mt-1 flex h-10 items-center justify-between rounded-xl border border-border-subtle bg-white/5 px-3 text-sm text-text"
                      >
                        <span>Run nightly</span>
                        <span class="text-text-dim">▾</span>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-text-dim">Textarea</label>
                      <textarea
                        rows="3"
                        class="mt-1 w-full rounded-xl border border-border-subtle bg-white/5 px-3 py-2 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Ghi chú nhanh cho QA..."
                      ></textarea>
                    </div>
                    <div>
                      <label class="text-xs text-text-dim">Ngày chạy</label>
                      <div class="mt-2 grid gap-2 sm:grid-cols-2">
                        <div
                          class="flex h-10 items-center rounded-xl border border-border-subtle bg-white/5 px-3 text-sm text-text focus-within:ring-2 focus-within:ring-primary/40"
                        >
                          <lucide-icon name="calendar" class="mr-2 h-4 w-4 text-text-dim"></lucide-icon>
                          <input
                            type="date"
                            class="w-full bg-transparent text-sm text-text focus:outline-none"
                            aria-label="Ngay bat dau"
                          />
                        </div>
                        <div
                          class="flex h-10 items-center rounded-xl border border-border-subtle bg-white/5 px-3 text-sm text-text focus-within:ring-2 focus-within:ring-primary/40"
                        >
                          <lucide-icon name="clock-3" class="mr-2 h-4 w-4 text-text-dim"></lucide-icon>
                          <input
                            type="time"
                            class="w-full bg-transparent text-sm text-text focus:outline-none"
                            aria-label="Gio bat dau"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-text-dim">Multi select</label>
                      <div
                        class="mt-1 flex flex-wrap gap-2 rounded-2xl border border-border-subtle bg-white/5 px-3 py-2 text-xs text-text"
                      >
                        <button class="rounded-full bg-primary/20 px-3 py-1 text-primary">Regression</button>
                        <button class="rounded-full bg-white/10 px-3 py-1 text-text">Smoke</button>
                        <button class="rounded-full bg-white/10 px-3 py-1 text-text">Chaos</button>
                        <button class="rounded-full border border-border-subtle px-3 py-1 text-text-dim">+ Thêm</button>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-text-dim">Upload log</label>
                      <label
                        class="mt-1 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border-subtle bg-white/5 px-4 py-3 text-sm text-text hover:border-primary hover:text-primary"
                      >
                        <span>Chọn file .log hoặc kéo thả</span>
                        <span class="text-xs text-text-dim">Max 5MB</span>
                        <input type="file" class="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'toggles'">
                <div class="mt-4 space-y-4">
                  <label
                    *ngFor="let item of toggleItems"
                    class="flex cursor-pointer items-center justify-between rounded-2xl border border-border-subtle bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p class="text-sm font-medium">{{ item.label }}</p>
                      <p class="text-xs text-text-dim">{{ item.description }}</p>
                    </div>
                    <input type="checkbox" class="peer sr-only" [checked]="item.checked" />
                    <div class="relative h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-primary">
                      <span class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                  <div class="flex items-center gap-4 text-sm">
                    <label class="inline-flex items-center gap-2">
                      <input type="checkbox" class="h-4 w-4 rounded border border-border-subtle bg-white/5 text-primary focus:ring-primary" checked />
                      Checkbox
                    </label>
                    <label class="inline-flex items-center gap-2">
                      <input type="radio" name="radio" class="h-4 w-4 border border-border-subtle text-primary focus:ring-primary" checked />
                      Radio
                    </label>
                  </div>
                  <div>
                    <p class="text-xs text-text-dim">Slider</p>
                    <div class="mt-2 h-2 rounded-full bg-white/10">
                      <div class="h-full w-3/4 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'table'">
                <div class="mt-4 rounded-2xl border border-border-subtle bg-white/5">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead class="text-xs uppercase tracking-wide text-text-dim">
                        <tr class="border-b border-white/10 text-left">
                          <th class="px-4 py-3">Suite</th>
                          <th class="px-4 py-3">Env</th>
                          <th class="px-4 py-3">Status</th>
                          <th class="px-4 py-3">Duration</th>
                          <th class="px-4 py-3">Owner</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/5">
                        <tr *ngFor="let row of tableRows" class="transition hover:bg-white/5">
                          <td class="px-4 py-3 font-medium text-text">{{ row.suite }}</td>
                          <td class="px-4 py-3 text-text-dim">{{ row.env }}</td>
                          <td class="px-4 py-3">
                            <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" [ngClass]="statusBadgeClass(row.status)">
                              {{ row.status | titlecase }}
                            </span>
                          </td>
                          <td class="px-4 py-3 text-text">{{ row.duration }}</td>
                          <td class="px-4 py-3 text-text-dim">{{ row.owner }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="border-t border-white/10 px-4 py-3 text-xs text-text-dim">Loading → skeleton → empty state</div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'alerts'">
                <div class="mt-4 space-y-3">
                  <div
                    *ngFor="let alert of alerts"
                    class="rounded-2xl border px-4 py-3 text-sm shadow-soft/20"
                    [ngClass]="alertVariantClasses(alert.variant)"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold">{{ alert.title }}</p>
                        <p class="text-xs text-text-soft">{{ alert.description }}</p>
                      </div>
                      <button *ngIf="alert.action" type="button" class="text-xs font-medium underline-offset-2 hover:underline">
                        {{ alert.action }}
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'tabs'">
                <div class="mt-4 space-y-4">
                  <div *ngFor="let group of tabGroups" class="space-y-2">
                    <p class="text-xs text-text-dim">{{ group.label }}</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        *ngFor="let tab of group.tabs"
                        type="button"
                        [ngClass]="group.variant === 'underline' ? 'border-b-2 px-3 pb-1 text-sm' : 'rounded-full px-4 py-1.5 text-xs'"
                        class="font-medium transition"
                        [class.border-transparent]="group.variant === 'underline' && !tab.active"
                        [class.border-primary]="group.variant === 'underline' && tab.active"
                        [class.text-text]="tab.active"
                        [class.text-text-dim]="!tab.active"
                        [class.bg-white/10]="group.variant === 'pill' && tab.active"
                        [class.bg-white/5]="group.variant === 'pill' && !tab.active"
                      >
                        {{ tab.name }}
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'modal'">
                <div class="mt-4 space-y-4">
                  <div class="rounded-2xl border border-border-subtle bg-white/5 p-4">
                    <p class="text-xs text-text-dim">Modal</p>
                    <div class="mt-2 rounded-2xl border border-border-subtle bg-bg p-4 shadow-soft">
                      <div class="flex items-start justify-between">
                        <div>
                          <h4 class="text-sm font-semibold">Đặt lịch chạy</h4>
                          <p class="text-xs text-text-dim">Chọn môi trường và cron.</p>
                        </div>
                        <button class="text-xs text-text-dim">✕</button>
                      </div>
                      <div class="mt-4 space-y-2 text-xs text-text-dim">
                        <div class="rounded-xl border border-border-subtle bg-white/5 px-3 py-2">Env · Production</div>
                        <div class="rounded-xl border border-border-subtle bg-white/5 px-3 py-2">Cron · 0 2 * * *</div>
                      </div>
                      <div class="mt-4 flex justify-end gap-2">
                        <button class="rounded-xl border border-border-subtle px-3 py-1.5 text-xs text-text">Huỷ</button>
                        <button class="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-text">Lưu</button>
                      </div>
                    </div>
                  </div>
                  <div class="rounded-2xl border border-border-subtle bg-white/5 p-4">
                    <p class="text-xs text-text-dim">Drawer</p>
                    <div class="mt-2 flex gap-4 rounded-2xl border border-border-subtle bg-bg p-4">
                      <div class="w-1/3 rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-text-dim">Overlay</div>
                      <div class="flex-1 rounded-xl border border-white/10 bg-bg-elev/80 p-4">
                        <p class="text-sm font-semibold">Notification drawer</p>
                        <p class="text-xs text-text-dim">Nội dung cuộn · padding 24px.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'tooltip'">
                <div class="mt-4 space-y-4">
                  <div class="inline-flex flex-col items-center gap-2">
                    <button class="rounded-xl border border-border-subtle bg-white/5 px-4 py-2 text-sm">Hover me</button>
                    <div class="rounded-lg border border-border-subtle bg-white/10 px-3 py-1 text-xs text-text">
                      Tooltip: “Xem cấu hình job”
                    </div>
                  </div>
                  <div class="rounded-2xl border border-border-subtle bg-white/5 p-3 text-sm">
                    <p class="text-xs text-text-dim">Dropdown</p>
                    <div class="mt-2 divide-y divide-border-soft rounded-xl border border-border-subtle bg-bg">
                      <button class="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-white/5">
                        Run now <span class="text-xs text-text-dim">⌘ + R</span>
                      </button>
                      <button class="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-white/5">
                        Đặt lịch <span class="text-xs text-text-dim">⌘ + S</span>
                      </button>
                      <button class="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-danger hover:bg-danger/20">
                        Huỷ cron
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'progress'">
                <div class="mt-4 space-y-4">
                  <div class="space-y-2">
                    <div *ngFor="let prog of progressStates">
                      <div class="flex items-center justify-between text-xs text-text-dim">
                        <p>{{ prog.label }}</p>
                        <p>{{ prog.value }}%</p>
                      </div>
                      <div class="h-2 rounded-full bg-white/10">
                        <div class="h-full rounded-full" [ngClass]="progressBarClass(prog.tone)" [style.width]="prog.value + '%'"></div>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-3 animate-pulse rounded-full bg-white/10"></div>
                    <div class="h-3 animate-pulse rounded-full bg-white/10"></div>
                    <div class="h-3 w-2/3 animate-pulse rounded-full bg-white/10"></div>
                  </div>
                  <div class="rounded-2xl border border-dashed border-border-subtle bg-white/5 p-6 text-center text-sm text-text-dim">
                    <p class="font-medium text-text">Chưa có dữ liệu</p>
                    <p class="text-xs">Nhấn “Run now” để tạo báo cáo đầu tiên.</p>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'navigation'">
                <div class="mt-4 space-y-4">
                  <nav class="flex items-center gap-1 text-xs text-text-dim">
                    <ng-container *ngFor="let crumb of breadcrumbs; let last = last">
                      <a *ngIf="!crumb.current" class="text-text-dim hover:text-text" [href]="crumb.href">{{ crumb.label }}</a>
                      <span *ngIf="crumb.current" class="text-text">{{ crumb.label }}</span>
                      <span *ngIf="!last">/</span>
                    </ng-container>
                  </nav>
                  <div class="flex flex-wrap items-center gap-2 text-sm">
                    <button
                      *ngFor="let page of pagination"
                      type="button"
                      class="h-8 w-8 rounded-lg border border-border-subtle bg-white/5 text-xs transition hover:bg-white/10"
                      [class.bg-white/15]="page.active"
                      [class.text-text]="page.active"
                      [class.text-text-dim]="!page.active"
                      [disabled]="page.disabled"
                    >
                      {{ page.label }}
                    </button>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'cards'">
                <div class="mt-4 space-y-4">
                  <div class="rounded-2xl border border-border-subtle bg-white/5 p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-semibold">Tổng quan chạy</p>
                        <p class="text-xs text-text-dim">3 suite đang pending</p>
                      </div>
                      <div class="flex gap-2 text-xs">
                        <button class="rounded-lg border border-border-subtle px-3 py-1 text-text">Filter</button>
                        <button class="rounded-lg bg-primary px-3 py-1 text-text">Run</button>
                      </div>
                    </div>
                    <div class="mt-4 grid gap-3 sm:grid-cols-2">
                      <div class="rounded-xl border border-border-subtle bg-bg p-3">
                        <p class="text-xs text-text-dim">Pass rate</p>
                        <p class="text-lg font-semibold">96%</p>
                      </div>
                      <div class="rounded-xl border border-border-subtle bg-bg p-3">
                        <p class="text-xs text-text-dim">Flaky</p>
                        <p class="text-lg font-semibold">4 cases</p>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-text-dim">
                    <p>Grid helpers:</p>
                    <div class="mt-2 grid grid-cols-2 gap-2 text-center md:grid-cols-4">
                      <div class="rounded-xl border border-border-subtle bg-white/5 p-2">grid-cols-2</div>
                      <div class="rounded-xl border border-border-subtle bg-white/5 p-2">grid-cols-3</div>
                      <div class="rounded-xl border border-border-subtle bg-white/5 p-2">grid-cols-4</div>
                      <div class="rounded-xl border border-border-subtle bg-white/5 p-2">gap-6</div>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'chart'">
                <div class="mt-4 rounded-2xl border border-border-subtle bg-gradient-to-br from-bg via-bg to-bg-elev p-6 text-center text-sm text-text-dim">
                  <div class="mx-auto flex h-48 max-w-lg flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-subtle">
                    <p class="text-text">Chart placeholder</p>
                    <p class="text-xs">Series: Pass · DDR · Deviation · Flaky</p>
                  </div>
                </div>
              </ng-container>

              <ng-container *ngSwitchDefault>
                <div class="mt-4 text-xs text-text-dim">
                  Template sẽ được bổ sung.
                </div>
              </ng-container>
            </ng-container>

            <ng-container *ngIf="isCodeVisible(section.id)">
              <pre
                class="mt-4 overflow-x-auto rounded-xl border border-border-subtle bg-black/20 p-3 text-[11px] text-text-soft"
              >
{{ codeSamples[section.id] }}</pre
              >
            </ng-container>
          </article>
        </div>
      </section>
    </div>
  `,
})
export class ComponentsGalleryComponent {
  private codeOpen = new Set<string>();

  sections: GallerySection[] = [
    { id: 'foundation-colors', title: 'Color tokens', description: 'Nền, chữ, trạng thái.' },
    { id: 'foundation-typo', title: 'Typography', description: 'Font scale system-ui.' },
    { id: 'foundation-spacing', title: 'Spacing · Radius · Shadow', description: 'Chuẩn hoá padding, bo góc.' },
    { id: 'buttons', title: 'Buttons', description: 'Primary · Ghost · Danger · đủ size.', colSpan: 'md:col-span-2' },
    { id: 'badges', title: 'Badges · Pills', description: 'Trạng thái job, env.' },
    { id: 'inputs', title: 'Form controls', description: 'Input, select, textarea, search.', colSpan: 'md:col-span-2' },
    { id: 'toggles', title: 'Switch · Checkbox · Radio', description: 'Tone primary + border subtle.' },
    { id: 'table', title: 'Bảng kết quả chạy', description: 'Header mờ, row hover.', colSpan: 'md:col-span-2' },
    { id: 'alerts', title: 'Alerts · Toasts', description: 'Success / Info / Warn / Danger.' },
    { id: 'tabs', title: 'Tabs', description: 'Underline + pill.' },
    { id: 'modal', title: 'Modal · Drawer', description: 'Nền bg-elev, overlay blur.' },
    { id: 'tooltip', title: 'Tooltip · Dropdown', description: 'Tương phản cao, bo nhỏ.' },
    { id: 'progress', title: 'Progress · Skeleton · Empty', description: 'State chuẩn cho loading.' },
    { id: 'navigation', title: 'Breadcrumb · Pagination', description: 'Điều hướng phụ.' },
    { id: 'cards', title: 'Card · Layout helpers', description: 'Title + toolbar + grid.' },
    { id: 'chart', title: 'Chart placeholder', description: 'Khung cho Chart.js' },
  ];

  colorTokens: ColorToken[] = [
    { label: 'Nền chính', token: '--bg', sampleClass: 'bg-bg', value: '#1e1f22' },
    { label: 'Nền nổi', token: '--bg-elev', sampleClass: 'bg-bg-elev', value: '#2b2d31' },
    { label: 'Chữ chính', token: '--text', sampleClass: 'bg-text', value: '#e3e5e8' },
    { label: 'Chữ mờ', token: '--text-dim', sampleClass: 'bg-text-dim', value: '#b5bac1' },
    { label: 'Primary', token: '--primary', sampleClass: 'bg-primary', value: '#5865F2' },
    { label: 'Danger', token: '--danger', sampleClass: 'bg-danger', value: '#d83c3e' },
  ];

  typeScale: TypographySample[] = [
    { label: 'Heading XL · 32px', class: 'text-2xl font-semibold', usage: 'Page title' },
    { label: 'Heading LG · 20px', class: 'text-xl font-semibold', usage: 'Card / section title' },
    { label: 'Body · 14px', class: 'text-base', usage: 'Nội dung chính' },
    { label: 'Caption · 12px', class: 'text-xs text-text-dim', usage: 'Hint · helper text' },
  ];

  spacingScale: SpacingToken[] = [
    { label: 'XS · 4px', width: '20%' },
    { label: 'SM · 8px', width: '35%' },
    { label: 'MD · 16px', width: '55%' },
    { label: 'LG · 24px', width: '75%' },
    { label: 'XL · 32px', width: '90%' },
  ];

  buttonVariants: ButtonVariant[] = [
    { label: 'Primary', classes: 'bg-primary hover:bg-primary-hover text-text' },
    { label: 'Ghost', classes: 'bg-white/5 hover:bg-white/10 text-text/90 border border-white/15' },
    { label: 'Danger', classes: 'bg-danger hover:bg-danger-hover text-text' },
  ];

  buttonSizes: ButtonSize[] = [
    { label: 'SM', classes: 'h-9 px-3 text-xs' },
    { label: 'MD', classes: 'h-10 px-4 text-sm' },
    { label: 'LG', classes: 'h-12 px-6 text-base' },
  ];

  badgeVariants: BadgeVariant[] = ['primary', 'success', 'warn', 'danger'].map((tone) => ({
    label:
      tone === 'primary' ? 'Primary' : tone === 'success' ? 'Success' : tone === 'warn' ? 'Warning' : 'Danger',
    classes: `bg-${tone}-soft border border-${tone}-border text-text-badge-${tone}`,
  }));

  inputFields: InputField[] = [
    { id: 'username', label: 'Username', placeholder: 'qa_automation', state: 'default', helper: 'Bắt buộc' },
    { id: 'password', label: 'Password', placeholder: '••••••••', state: 'default', helper: 'Giữ bí mật' },
    { id: 'notes', label: 'Ghi chú', placeholder: 'Mô tả testcase...', state: 'default', helper: 'Tối đa 200 ký tự' },
    { id: 'readonly', label: 'Readonly field', placeholder: 'Chế độ chỉ xem', state: 'readonly', helper: 'Không thể sửa' },
    { id: 'disabled', label: 'Disabled field', placeholder: 'Không khả dụng', state: 'disabled', helper: 'Ẩn khi không có quyền' },
    { id: 'error', label: 'Error field', placeholder: 'Suite name', state: 'error', helper: 'Tên đã tồn tại' },
  ];

  toggleItems: ToggleItem[] = [
    { label: 'Bật scheduler nightly', description: 'Tự chạy 02:00 hằng ngày', checked: true },
    { label: 'Gửi email khi lỗi', description: 'Thông báo Slack + Email', checked: false },
  ];

  tableRows: TableRow[] = [
    { suite: 'Login Smoke', env: 'Production', status: 'success', duration: '03m 12s', owner: 'QA · Thu' },
    { suite: 'Payment Regression', env: 'Staging', status: 'warning', duration: '12m 45s', owner: 'QA · Minh' },
    { suite: 'Scheduler Monitor', env: 'Dev', status: 'danger', duration: '01m 30s', owner: 'QA · An' },
  ];

  alerts: AlertItem[] = [
    { title: 'Tất cả ổn định', description: 'Không có lỗi nghiêm trọng', variant: 'success' },
    { title: 'Server staging cảnh báo', description: 'CPU > 85%', variant: 'warn', action: 'Xem log' },
    { title: 'API payment timeout', description: '5 testcase fail', variant: 'danger', action: 'Retry ngay' },
    { title: 'Bản build nightly hoàn tất', description: 'Báo cáo sẵn sàng', variant: 'info', action: 'Xem' },
  ];

  tabGroups: TabGroup[] = [
    {
      id: 'underline',
      label: 'Tabs dạng underline',
      variant: 'underline',
      tabs: [
        { name: 'Overview', active: true },
        { name: 'Runs', active: false },
        { name: 'Flaky', active: false },
      ],
    },
    {
      id: 'pill',
      label: 'Tabs dạng pill',
      variant: 'pill',
      tabs: [
        { name: 'Tất cả', active: true },
        { name: 'Passed', active: false },
        { name: 'Failed', active: false },
      ],
    },
  ];

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Design system', current: true },
  ];

  pagination: PaginationButton[] = [
    { label: '‹', disabled: true },
    { label: '1', active: true },
    { label: '2' },
    { label: '3' },
    { label: '›' },
  ];

  progressStates: ProgressState[] = [
    { label: 'Login suite', value: 72, tone: 'primary' },
    { label: 'Regression', value: 45, tone: 'warn' },
    { label: 'Bugfix batch', value: 10, tone: 'danger' },
  ];

  codeSamples: CodeSampleMap = {
    'foundation-colors': `<div class="rounded-xl border border-border-subtle bg-white/5 p-3">
  <div class="h-10 w-12 rounded-lg bg-bg"></div>
  <p class="text-xs text-text-dim">--bg</p>
</div>`,
    'foundation-typo': `<p class="text-2xl font-semibold">Heading</p>
<p class="text-xs text-text-dim">Caption</p>`,
    'foundation-spacing': `<div class="rounded-full bg-white/5">
  <div class="h-2 w-1/2 rounded-full bg-primary"></div>
</div>`,
    buttons: `<button class="h-10 rounded-xl bg-primary px-4 text-sm text-text">Primary</button>`,
    badges: `<span class="rounded-full bg-primary-soft px-3 py-1 text-xs text-text-badge-primary">Primary</span>`,
    inputs: `<label class="text-xs text-text-dim">Username</label>
<input class="h-10 w-full rounded-xl border border-border-subtle bg-white/5 px-3" />`,
    toggles: `<label class="flex items-center justify-between rounded-2xl border px-4 py-3">
  <input type="checkbox" class="sr-only peer" />
  <span class="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-primary"></span>
</label>`,
    table: `<table class="w-full text-sm">
  <thead class="text-xs text-text-dim">
    <tr class="border-b border-white/10">
      <th class="px-4 py-3 text-left">Suite</th>
    </tr>
  </thead>
</table>`,
    alerts: `<div class="rounded-2xl border border-success-border bg-success-soft px-4 py-3">
  <p class="text-sm font-semibold">Tất cả ổn định</p>
</div>`,
    tabs: `<div class="flex gap-4 border-b border-white/10">
  <button class="border-b-2 border-primary pb-1 text-text">Overview</button>
</div>`,
    modal: `<div class="rounded-2xl border border-border-subtle bg-bg-elev p-4">
  <h4 class="text-sm font-semibold">Đặt lịch chạy</h4>
</div>`,
    tooltip: `<div class="rounded-lg border border-border-subtle bg-white/10 px-3 py-1 text-xs">
  Tooltip content
</div>`,
    progress: `<div class="h-2 rounded-full bg-white/10">
  <div class="h-full w-2/3 rounded-full bg-primary"></div>
</div>`,
    navigation: `<nav class="text-xs text-text-dim">
  <a class="text-text" href="#">Dashboard</a> /
  <span>Design system</span>
</nav>
<div class="flex gap-2">
  <button class="h-8 w-8 rounded-lg border border-border-subtle">1</button>
</div>`,
    cards: `<div class="rounded-2xl border border-border-subtle bg-white/5 p-4">
  <div class="flex items-center justify-between">
    <p class="text-sm font-semibold">Card title</p>
    <button class="text-xs">Action</button>
  </div>
</div>`,
    chart: `<div class="h-48 rounded-2xl border border-dashed border-border-subtle"></div>`,
  };

  toggleCode(id: GallerySection['id']) {
    const next = new Set(this.codeOpen);
    next.has(id) ? next.delete(id) : next.add(id);
    this.codeOpen = next;
  }

  isCodeVisible(id: GallerySection['id']) {
    return this.codeOpen.has(id);
  }

  inputClass(state: InputField['state']) {
    switch (state) {
      case 'error':
        return 'border-danger bg-white/5 text-text';
      case 'disabled':
        return 'border-border-subtle/50 text-text/40 bg-white/5 cursor-not-allowed';
      case 'readonly':
        return 'border-border-subtle bg-white/5 text-text/80';
      default:
        return 'border-border-subtle bg-white/5';
    }
  }

  statusBadgeClass(status: TableRow['status']) {
    switch (status) {
      case 'success':
        return 'bg-success-soft border border-success-border text-text-badge-success';
      case 'warning':
        return 'bg-warn-soft border border-warn-border text-text-badge-warn';
      default:
        return 'bg-danger-soft border border-danger-border text-text-badge-danger';
    }
  }

  alertVariantClasses(variant: AlertItem['variant']) {
    switch (variant) {
      case 'success':
        return 'border-success-border bg-success-soft text-text';
      case 'warn':
        return 'border-warn-border bg-warn-soft text-text';
      case 'danger':
        return 'border-danger-border bg-danger-soft text-text';
      default:
        return 'border-border-subtle bg-white/5 text-text';
    }
  }

  progressBarClass(tone: ProgressState['tone']) {
    switch (tone) {
      case 'warn':
        return 'bg-warn';
      case 'danger':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }
}
