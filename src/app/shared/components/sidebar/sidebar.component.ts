import { CommonModule, NgIf, NgFor } from '@angular/common';
import {
  ApplicationRef,
  Component,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  NAVIGATION_ITEMS,
  NavigationItem,
  SUPER_ADMIN_ITEMS,
} from '../../constants/navigation';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, RouterLink, RouterLinkActive, LucideAngularModule],
  styles: [
    `
      .account-card {
        cursor: pointer;
        transition: color 150ms ease, transform 150ms ease, box-shadow 150ms ease, border-left 150ms ease;
        border-left: 1px solid transparent;
      }
      .account-card .title,
      .account-card .subtitle {
        transition: color 150ms ease;
      }
      .account-card.is-hovered .title,
      .account-card.is-hovered .subtitle,
      .account-card.is-active .title,
      .account-card.is-active .subtitle {
        color: #fff;
      }
      .account-card.is-hovered,
      .account-card.is-active {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.55);
      }
      .account-card.is-active {
        border-left: 2px solid var(--primary, #5865f2);
      }
      .status-dot {
        display: inline-flex;
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: #3fbf7f;
        box-shadow: 0 0 0 2px rgba(63, 191, 127, 0.2);
        animation: status-pulse 1.2s ease-in-out infinite;
      }
      @keyframes status-pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.35);
          opacity: 0.6;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .popover-panel {
        position: fixed;
        width: 280px;
        padding: 14px;
        border-radius: 16px;
        background: var(--bg-elev, #2b2d31);
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.65);
        border: 1px solid var(--border-border-subtle, #3a3d44);
        z-index: 1200;
        opacity: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .user-block {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #5865f2, #3fbf7f);
        display: grid;
        place-items: center;
        font-weight: 700;
        color: #fff;
      }
      .info-block {
        border: 1px solid var(--border-border-subtle, #3a3d44);
        border-radius: 12px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
      }
      .action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 10px;
        padding: 10px;
        width: 100%;
        border: 1px solid var(--border-border-subtle, #3a3d44);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text, #e3e5e8);
        cursor: pointer;
        transition: background 140ms ease, transform 140ms ease, border 140ms ease;
      }
      .action-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-1px);
      }
      .action-btn.danger {
        border-color: rgba(216, 60, 62, 0.5);
        background: rgba(216, 60, 62, 0.14);
        color: #ffd7de;
      }
      .edit-btn {
        width: auto;
        height: 32px;
        padding: 4px 6px;
        border-radius: 8px;
        border: 1px solid var(--border-border-subtle, #3a3d44);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text, #e3e5e8);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 140ms ease, border 140ms ease;
      }
      .edit-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--primary, #5865f2);
      }
      .input-edit {
        height: 32px;
        border-radius: 8px;
        border: 1px solid var(--border-border-subtle, #3a3d44);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text, #e3e5e8);
        padding: 0 10px;
      }
    `,
  ],
  template: `
    <aside class="space-y-3">
      <div
        #accountCard
        class="rounded-[var(--radius-lg)] border border-border-soft bg-bg-elev p-5 text-text shadow-soft/20 account-card"
        [class.is-hovered]="cardHover || popoverOpen"
        [class.is-active]="popoverOpen"
        (mouseenter)="cardHover = true"
        (mouseleave)="onCardLeave()"
        (click)="togglePopover()"
        role="button"
        tabindex="0"
        (keydown.enter)="togglePopover()"
        (keydown.space)="togglePopover()"
      >
        <div class="flex items-start gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <lucide-icon name="flask-conical" class="h-6 w-6"></lucide-icon>
          </div>
          <div class="flex-1">
            <p class="text-lg font-semibold leading-tight title">AutoTest Portal</p>
            <p class="text-sm text-text-dim subtitle flex items-center gap-2">
              <span class="status-dot"></span>
              <span>Hi, {{ userName }}</span>
            </p>
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
              <span class="flex-1">{{ superAdminItems[0].label }}</span>
            </a>
          </div>
        </ng-container>
      </nav>

      <div class="rounded-[var(--radius-lg)] border border-border-soft bg-bg-elev p-5 text-text shadow-soft/10">
        <p class="text-xs font-semibold uppercase tracking-wide text-white/60">Mẹo</p>
        <p class="mt-2 text-sm text-text-dim leading-relaxed">
          Nhận <span class="font-medium text-text">Super Admin</span> để xem chế độ tổng hợp dự án.
        </p>
      </div>
    </aside>

    <ng-template #popoverTemplate>
      <div class="popover-panel" [ngStyle]="{ top: popoverCoords.top, left: popoverCoords.left }">
        <section class="user-block">
          <div class="avatar">{{ userInitials }}</div>
          <div>
            <div class="flex items-center gap-2">
              <ng-container *ngIf="!editingName; else editTpl">
                <p class="text-base font-semibold text-text m-0">{{ userName }}</p>
                <button class="action-btn edit-btn" type="button" (click)="startEdit()" aria-label="Sửa tên">
                  <lucide-icon name="pencil" class="h-4 w-4"></lucide-icon>
                </button>
              </ng-container>
              <ng-template #editTpl>
                <input
                  class="input-edit"
                  [(ngModel)]="editName"
                  type="text"
                  maxlength="40"
                  aria-label="Nhập tên"
                  (keydown.enter)="saveName()"
                />
                <button class="action-btn edit-btn" type="button" (click)="saveName()">
                  <lucide-icon name="check" class="h-4 w-4"></lucide-icon>
                </button>
                <button class="action-btn edit-btn" type="button" (click)="cancelEdit()">
                  <lucide-icon name="x" class="h-4 w-4"></lucide-icon>
                </button>
              </ng-template>
            </div>
            <p class="text-sm text-text-dim m-0">{{ userRole }}</p>
            <div class="text-xs text-green-200 mt-1 inline-flex items-center gap-2">
              <span class="status-dot"></span><span>Online</span>
            </div>
          </div>
        </section>

        <section class="info-block">
          <p class="m-0 text-sm text-text">Email: {{ userEmail }}</p>
          <p class="m-0 text-sm text-text">Quyền: {{ userRoles }}</p>
        </section>

        <section class="info-block">
          <button class="action-btn" type="button" (click)="goTo('/change-password')">
            <lucide-icon name="lock" class="h-4 w-4"></lucide-icon>
            <span>Đổi mật khẩu</span>
          </button>
          <button class="action-btn danger mt-2" type="button" (click)="logout()">
            <lucide-icon name="log-out" class="h-4 w-4"></lucide-icon>
            <span>Đăng xuất</span>
          </button>
        </section>
      </div>
    </ng-template>
  `,
})
export class SidebarComponent {
  @Input() isSuperAdmin = false;
  @Input() userName = 'QA User';

  navItems: NavigationItem[] = NAVIGATION_ITEMS;
  superAdminItems: NavigationItem[] = SUPER_ADMIN_ITEMS;

  userEmail = 'qa.user@example.com';
  userRoles = 'Admin';
  userRole = 'QA Lead';
  editingName = false;
  editName = this.userName;

  cardHover = false;
  popoverOpen = false;
  popoverCoords = { top: '0px', left: '0px' };

  @ViewChild('accountCard') accountCard!: ElementRef<HTMLElement>;
  @ViewChild('popoverTemplate') popoverTemplate!: TemplateRef<any>;

  private popoverView?: EmbeddedViewRef<any>;
  private popoverHost: HTMLElement | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private appRef: ApplicationRef,
    private renderer: Renderer2
  ) {}

  get userInitials(): string {
    return this.userName
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  togglePopover() {
    this.popoverOpen = !this.popoverOpen;
    if (this.popoverOpen) {
      this.updatePopoverPosition();
      this.attachPopover();
    } else {
      this.cardHover = false;
      this.detachPopover();
    }
  }

  onCardLeave() {
    if (!this.popoverOpen) this.cardHover = false;
  }

  startEdit() {
    this.editingName = true;
    this.editName = this.userName;
  }

  cancelEdit() {
    this.editingName = false;
    this.editName = this.userName;
  }

  saveName() {
    const name = this.editName.trim();
    if (!name) return;
    this.userName = name;
    this.editingName = false;
  }

  goTo(path: string) {
    this.router.navigate([path]);
    this.closePopover();
  }

  logout() {
    this.auth.logout();
    this.closePopover();
  }

  private closePopover() {
    this.popoverOpen = false;
    this.cardHover = false;
    this.detachPopover();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.popoverOpen) return;
    const target = event.target as HTMLElement;
    const inCard = this.accountCard?.nativeElement.contains(target);
    const inPopover = this.popoverHost?.contains(target);
    if (!inCard && !inPopover) {
      this.closePopover();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  updatePopoverPosition() {
    if (!this.popoverOpen || !this.accountCard) return;
    const rect = this.accountCard.nativeElement.getBoundingClientRect();
    this.popoverCoords = {
      top: `${rect.top}px`,
      left: `${rect.right + 8}px`,
    };
    if (this.popoverHost) {
      this.renderer.setStyle(this.popoverHost, 'top', this.popoverCoords.top);
      this.renderer.setStyle(this.popoverHost, 'left', this.popoverCoords.left);
    }
  }

  private attachPopover() {
    this.detachPopover();
    this.popoverView = this.popoverTemplate.createEmbeddedView({});
    this.appRef.attachView(this.popoverView);
    this.popoverHost = this.renderer.createElement('div');
    if (!this.popoverHost) return;
    this.renderer.setStyle(this.popoverHost, 'position', 'fixed');
    this.renderer.setStyle(this.popoverHost, 'top', this.popoverCoords.top);
    this.renderer.setStyle(this.popoverHost, 'left', this.popoverCoords.left);
    this.renderer.setStyle(this.popoverHost, 'zIndex', '1200');
    this.popoverView.rootNodes.forEach((node) => this.popoverHost!.appendChild(node));
    document.body.appendChild(this.popoverHost);
  }

  private detachPopover() {
    if (this.popoverView) {
      this.appRef.detachView(this.popoverView);
      this.popoverView.destroy();
      this.popoverView = undefined;
    }
    if (this.popoverHost?.parentNode) {
      this.popoverHost.parentNode.removeChild(this.popoverHost);
    }
    this.popoverHost = null;
  }
}
