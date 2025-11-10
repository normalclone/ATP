import { Component, Input } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  NAVIGATION_ITEMS,
  NavigationItem,
  SUPER_ADMIN_ITEMS,
} from '../../constants/navigation';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
  ],
  template: `
    <aside class="space-y-3">
      <div class="rounded-[var(--radius-lg)] border border-border-soft bg-bg-elev p-5 text-text shadow-soft/20">
        <div class="flex items-start gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <lucide-icon name="flask-conical" class="h-6 w-6"></lucide-icon>
          </div>
          <div class="flex-1">
            <p class="text-lg font-semibold leading-tight">Auto Report Manager</p>
            <p class="text-sm text-text-dim">Discord-style • Dark</p>
          </div>
        </div>
      </div>

      <nav class="rounded-[var(--radius-lg)] border border-border-soft bg-bg-elev p-4 text-text shadow-soft/10">
        <ul class="flex flex-col gap-1.5">
          <li *ngFor="let item of navItems">
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-white/10 text-text font-semibold shadow-inner"
              [routerLinkActiveOptions]="{ exact: item.exact ?? true }"
              class="group flex items-center gap-3 rounded-xl px-5 py-2.5 text-md text-text-dim transition hover:bg-white/10 hover:text-text"
            >
              <lucide-icon
                [name]="item.icon"
                class="h-5 w-5 flex-none text-text-dim transition group-hover:text-text"
              ></lucide-icon>
              <span class="flex-1">{{ item.label }}</span>
            </a>
          </li>
        </ul>

        <ng-container *ngIf="isSuperAdmin">
          <div class="mt-4 border-t border-white/10 pt-4">
            <p class="px-3 text-[11px] uppercase tracking-wide text-white/40">Super Admin</p>
            <a
              [routerLink]="superAdminItems[0].route"
              routerLinkActive="bg-white/10 text-text font-semibold shadow-inner"
              class="group mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-md text-text-dim transition hover:bg-white/10 hover:text-text"
            >
              <lucide-icon name="users" class="h-5 w-5 flex-none text-text-dim transition group-hover:text-text"></lucide-icon>
              <span class="flex-1">Quản lý dự án</span>
            </a>
          </div>
        </ng-container>
      </nav>

      <div class="rounded-[var(--radius-lg)] border border-border-soft bg-bg-elev p-5 text-text shadow-soft/10">
        <p class="text-xs font-semibold uppercase tracking-wide text-white/60">Mẹo</p>
        <p class="mt-2 text-sm text-text-dim leading-relaxed">
          Nhấn <span class="font-medium text-text">Super Admin</span> để xem chế độ tổng hợp đa dự án.
        </p>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() isSuperAdmin = false;

  navItems: NavigationItem[] = NAVIGATION_ITEMS;
  superAdminItems: NavigationItem[] = SUPER_ADMIN_ITEMS;
}
