import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

interface NotificationItem {
  title: string;
  description: string;
  time: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
}

@Component({
  selector: 'app-notification-drawer',
  standalone: true,
  imports: [CommonModule, NgFor],
  template: `
    <div class="fixed inset-0 z-50 transition duration-150 ease-in" [class.pointer-events-none]="!open">
      <div
        class="absolute inset-0 bg-black/60 transition-opacity duration-150 ease-in"
        [class.opacity-0]="!open"
        [class.opacity-100]="open"
        (click)="close.emit()"
      ></div>

      <aside
        class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col gap-4 border-l border-border-soft bg-gradient-to-b from-bg via-bg to-bg-deep px-6 py-6 text-text shadow-[0_10px_40px_rgba(0,0,0,0.65)] backdrop-blur-md transition-transform duration-150 ease-in"
        [class.translate-x-full]="!open"
        [class.translate-x-0]="open"
      >
        <header class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold leading-tight">Thông báo</h2>
            <p class="text-sm text-text-dim">Bạn có {{ notifications.length }} cập nhật gần đây</p>
          </div>

          <button
            type="button"
            class="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white/5 text-text"
            (click)="close.emit()"
            aria-label="Đóng danh sách thông báo"
          >
            <svg
              aria-hidden="true"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <section class="flex-1 space-y-3 overflow-y-auto pr-1">
          <article
            *ngFor="let item of notifications"
            class="rounded-xl border border-border-subtle bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
          >
            <div class="flex items-center justify-between gap-3">
              <h3 class="font-semibold text-text">
                {{ item.title }}
              </h3>
              <span class="text-xs text-text-dim">{{ item.time }}</span>
            </div>
            <p class="mt-2 text-text-dim leading-relaxed">{{ item.description }}</p>
            <div class="mt-3 flex items-center justify-end">
              <span
                class="rounded-full px-3 py-1 text-xs font-medium"
                [ngClass]="toneClass(item.tone)"
              >
                {{ toneLabel(item.tone) }}
              </span>
            </div>
          </article>
        </section>

        <footer class="flex items-center justify-between border-t border-border-subtle pt-4 text-xs text-text-dim">
          <span>Đánh dấu tất cả là đã đọc</span>
          <button
            type="button"
            class="focus-ring rounded-md border border-border-subtle px-3 py-1 text-xs text-text-dim transition hover:bg-white/10"
          >
            Xóa tất cả
          </button>
        </footer>
      </aside>
    </div>
  `,
})
export class NotificationDrawerComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  notifications: NotificationItem[] = [
    {
      title: 'Suite Login & Session',
      description: 'Ca chạy #1129 đã hoàn thành. 5 testcase thất bại cần kiểm tra.',
      time: '5 phút trước',
      tone: 'warning',
    },
    {
      title: 'Scheduler • Payments',
      description: 'Lịch chạy nightly (02:00) đã được kích hoạt thành công.',
      time: '1 giờ trước',
      tone: 'success',
    },
    {
      title: 'New defect linked',
      description: 'Report REP-03-002 đã được liên kết với ticket JIRA #QA-455.',
      time: 'Hôm qua',
      tone: 'info',
    },
  ];

  toneLabel(tone: NotificationItem['tone']): string {
    switch (tone) {
      case 'success':
        return 'Thành công';
      case 'warning':
        return 'Cảnh báo';
      case 'danger':
        return 'Nguy hiểm';
      default:
        return 'Thông tin';
    }
  }

  toneClass(tone: NotificationItem['tone']): string {
    switch (tone) {
      case 'success':
        return 'bg-success-soft text-text-badge-success border border-success-border';
      case 'warning':
        return 'bg-warn-soft text-text-badge-warn border border-warn-border';
      case 'danger':
        return 'bg-danger-soft text-text-badge-danger border border-danger-border';
      default:
        return 'bg-white/10 text-text-badge-primary border border-border-subtle';
    }
  }
}
