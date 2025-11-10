import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  NAVIGATION_ITEMS,
  NavigationItem,
  SUPER_ADMIN_ITEMS,
} from '../../constants/navigation';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink],
  template: `
    <div class="fixed inset-0 z-50 transition duration-300 md:hidden" [class.pointer-events-none]="!open">
      <div
        class="absolute inset-0 bg-black/60 transition-opacity duration-300"
        [class.opacity-0]="!open"
        [class.opacity-100]="open"
        (click)="close.emit()"
      ></div>

      <aside
        class="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col gap-5 border-r border-border-soft bg-gradient-to-b from-bg via-bg to-bg-deep px-5 py-6 text-text shadow-[0_10px_40px_rgba(0,0,0,0.65)] backdrop-blur-md transition-transform duration-300 ease-out"
        [class.-translate-x-full]="!open"
        [class.translate-x-0]="open"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.5 3.5h11l1.79 4.48a2 2 0 0 1-.23 1.84L13 19.5a2 2 0 0 1-3.38 0L4.94 9.82a2 2 0 0 1-.23-1.84L6.5 3.5Z"
                />
                <path stroke-linecap="round" d="M8.5 3.5h7" />
                <path stroke-linecap="round" d="M6.5 7.5h11" />
              </svg>
            </div>
            <div>
              <p class="text-base font-semibold leading-tight">Auto Report Manager</p>
              <p class="text-xs text-text-dim">Discord-style • Dark</p>
            </div>
          </div>

          <button
            type="button"
            class="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white/5 text-text"
            (click)="close.emit()"
            aria-label="Đóng menu"
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
        </div>

        <nav class="flex-1 overflow-y-auto">
          <p class="px-1 text-[11px] uppercase tracking-wide text-white/40">Điều hướng</p>
          <ul class="mt-3 flex flex-col gap-1.5">
            <li *ngFor="let item of navItems">
              <a
                [routerLink]="item.route"
                class="group flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-text-dim transition hover:bg-white/10 hover:text-text"
                (click)="close.emit()"
              >
                <svg
                  aria-hidden="true"
                  class="h-5 w-5 flex-none text-text-dim transition group-hover:text-text"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <ng-container [ngSwitch]="item.icon">
                    <g *ngSwitchCase="'gauge'">
                      <path d="M5.05 11a7 7 0 1 1 13.9 0" />
                      <path stroke-linecap="round" d="M12 15l2.5-2.5" />
                      <path d="M12 3v2" />
                      <path d="M6.22 6.22 7.64 7.64" />
                      <path d="M3 11h2" />
                      <path d="M19 11h2" />
                      <path d="M16.36 6.64 14.94 8.06" />
                      <path stroke-linecap="round" d="M12 15l.01-.01" />
                    </g>
                    <g *ngSwitchCase="'database'">
                      <ellipse cx="12" cy="5" rx="8" ry="3" />
                      <path d="M4 5v10c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
                      <path d="M4 10c0 1.66 3.58 3 8 3s8-1.34 8-3" />
                    </g>
                    <g *ngSwitchCase="'report'">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path stroke-linecap="round" d="M7 14h3v4H7zm4-6h3v10h-3zm4 3h3v7h-3z" />
                    </g>
                    <g *ngSwitchCase="'calendar'">
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <path d="M16 2v4" stroke-linecap="round" />
                      <path d="M8 2v4" stroke-linecap="round" />
                      <path d="M3 10h18" stroke-linecap="round" />
                    </g>
                    <g *ngSwitchCase="'alert'">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.29 3.86 1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0z"
                      />
                      <path stroke-linecap="round" d="M12 9v4" />
                      <path stroke-linecap="round" d="M12 17h.01" />
                    </g>
                    <g *ngSwitchCase="'users'">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </g>
                  </ng-container>
                </svg>
                <span class="flex-1">{{ item.label }}</span>
              </a>
            </li>
          </ul>

          <div *ngIf="isSuperAdmin" class="mt-5 border-t border-white/10 pt-4">
            <p class="px-1 text-[11px] uppercase tracking-wide text-white/40">Super Admin</p>
            <a
              [routerLink]="superAdminItems[0].route"
              class="group mt-3 flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-text-dim transition hover:bg-white/10 hover:text-text"
              (click)="close.emit()"
            >
              <svg
                aria-hidden="true"
                class="h-5 w-5 flex-none text-text-dim transition group-hover:text-text"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span class="flex-1">Quản lý dự án</span>
            </a>
          </div>
        </nav>
      </aside>
    </div>
  `,
})
export class MobileDrawerComponent {
  @Input() open = false;
  @Input() isSuperAdmin = false;
  @Output() close = new EventEmitter<void>();

  navItems: NavigationItem[] = NAVIGATION_ITEMS;
  superAdminItems: NavigationItem[] = SUPER_ADMIN_ITEMS;
}
