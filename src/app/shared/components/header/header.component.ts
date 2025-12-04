import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  styles: [
    `
      select option {
        background: var(--bg, #2b2d31);
        color: var(--text, #e3e5e8);
      }

      .menu-item {
        width: 100%;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        font-size: 13px;
        color: var(--text, #e3e5e8);
        text-decoration: none;
        background: transparent;
        border: 0;
        text-align: left;
        transition: background 120ms ease, color 120ms ease;
      }

      .menu-item:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .menu-item.danger {
        color: #fca5a5;
      }

      .menu-divider {
        height: 1px;
        background: var(--border-border-subtle, #3a3d44);
      }

      .logout-modal {
        background: var(--bg-elev, #2b2d31);
        border: 1px solid var(--border-border-subtle, #3a3d44);
        border-radius: 14px;
        padding: 14px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
        width: 360px;
        max-width: 90vw;
      }

      .toast-inline {
        position: fixed;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        background: #3fbf7f;
        color: #0b160f;
        padding: 10px 14px;
        border-radius: 999px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        z-index: 110;
      }
    `,
  ],
  template: `
    <header class="sticky top-0 z-40 border-b border-border-soft bg-bg/80 backdrop-blur-md">
      <div class="mx-auto w-full max-w-[1600px] px-4">
        <div class="flex h-16 items-center justify-between gap-3">
          <div class="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              class="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-white/5 text-text md:hidden"
              (click)="menuToggle.emit()"
              aria-label="Mở menu điều hướng"
            >
              <span class="flex flex-col gap-1">
                <span class="block h-0.5 w-5 rounded-full bg-text"></span>
                <span class="block h-0.5 w-5 rounded-full bg-text"></span>
                <span class="block h-0.5 w-4 rounded-full bg-text"></span>
              </span>
            </button>

            <button
              type="button"
              class="focus-ring group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-lg font-semibold text-text transition hover:bg-white/5 active:bg-white/10"
              (click)="handleProjectClick()"
              role="button"
              aria-haspopup="listbox"
              aria-expanded="false"
            >
              <span class="truncate max-w-[160px] text-left md:max-w-[240px]" [title]="projectName">
                {{ projectName }}
              </span>
              <lucide-icon name="chevron-down" class="h-3 w-3 text-text-dim transition group-hover:text-text"></lucide-icon>
            </button>

            <div class="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-white/5 px-3 py-2 text-sm text-text">
              <label class="text-xs text-text-dim" for="env-select">ENV</label>
              <select
                id="env-select"
                [(ngModel)]="envValue"
                (ngModelChange)="onEnvChange($event)"
                class="bg-transparent text-text focus:outline-none"
                aria-label="Chọn môi trường"
              >
                <option *ngFor="let env of envOptions" [value]="env">{{ env | uppercase }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2 md:gap-3">
            <form
              class="hidden min-w-[280px] max-w-sm items-center rounded-xl border border-border-subtle bg-white/5 px-3 py-2 text-sm text-text md:flex"
              role="search"
              (submit)="handleSearch($event)"
            >
              <lucide-icon name="search" class="mr-2 h-4 w-4 text-text-dim"></lucide-icon>
              <input
                [(ngModel)]="searchQuery"
                name="search"
                type="search"
                class="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
                [placeholder]="searchPlaceholder"
                aria-label="Tìm kiếm"
              />
            </form>

            <button
              type="button"
              class="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-white/5 text-text md:hidden"
              (click)="toggleMobileSearch()"
              aria-label="Mở tìm kiếm"
            >
              <lucide-icon name="search" class="h-4 w-4"></lucide-icon>
            </button>

            <button
              type="button"
              class="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-white/5 text-text"
              (click)="notificationsToggle.emit()"
              aria-label="Mở thông báo"
            >
              <lucide-icon name="bell" class="h-5 w-5"></lucide-icon>
            </button>

            <button
              type="button"
              class="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-md font-semibold text-text shadow-soft transition hover:bg-primary-hover"
              (click)="runNow.emit()"
            >
              <lucide-icon name="play" class="h-5 w-5"></lucide-icon>
              <span class="hidden sm:inline">Chạy/Đặt lịch</span>
              <span class="sm:hidden">Chạy</span>
            </button>

          </div>
        </div>

        <form *ngIf="mobileSearchOpen" class="md:hidden" role="search" (submit)="handleSearch($event)">
          <div
            class="mt-3 flex items-center gap-2 rounded-xl border border-border-subtle bg-white/5 px-3 py-2 text-sm text-text"
          >
            <lucide-icon name="search" class="h-4 w-4 text-text-dim"></lucide-icon>
            <input
              [(ngModel)]="searchQuery"
              name="search-mobile"
              type="search"
              class="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
              [placeholder]="searchPlaceholder"
              aria-label="Tìm kiếm"
            />
            <button
              type="button"
              class="focus-ring h-8 w-8 rounded-full border border-border-subtle text-text"
              (click)="toggleMobileSearch()"
              aria-label="Đóng tìm kiếm"
            >
              <lucide-icon name="x" class="h-3 w-3"></lucide-icon>
            </button>
          </div>
        </form>
      </div>
    </header>

  `,
})
export class HeaderComponent {
  @Input() projectName = 'Automation Project';
  @Input() searchPlaceholder = 'Tìm case, report, lịch chạy…';
  @Input() envValue = 'dev';

  @Output() menuToggle = new EventEmitter<void>();
  @Output() notificationsToggle = new EventEmitter<void>();
  @Output() projectClick = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() runNow = new EventEmitter<void>();
  @Output() envChange = new EventEmitter<string>();

  searchQuery = '';
  mobileSearchOpen = false;
  envOptions = ['prod', 'dev', 'beta', 'khac'];
  constructor(private auth: AuthService, private router: Router) {}

  handleProjectClick() {
    this.projectClick.emit();
  }

  toggleMobileSearch() {
    this.mobileSearchOpen = !this.mobileSearchOpen;
  }

  handleSearch(event: Event) {
    event.preventDefault();
    const query = this.searchQuery.trim();
    if (query) {
      this.search.emit(query);
    }
  }

  onEnvChange(value: string) {
    this.envValue = value;
    this.envChange.emit(value);
  }

}
