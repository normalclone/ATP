import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { MobileHeaderComponent } from '../../shared/components/mobile-header/mobile-header.component';
import { MobileDrawerComponent } from '../../shared/components/mobile-drawer/mobile-drawer.component';
import { NotificationDrawerComponent } from '../../shared/components/notification-drawer/notification-drawer.component';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MobileHeaderComponent,
    MobileDrawerComponent,
    NotificationDrawerComponent,
    NotificationsComponent,
  ],
  template: `
    <!-- Desktop layout -->
    <div class="min-h-screen bg-[var(--layout-bg)] text-slate-100 hidden md:flex">
      <aside class="w-64 bg-[var(--layout-sidebar-bg)] border-r border-slate-800">
        <app-sidebar></app-sidebar>
      </aside>

      <div class="flex-1 flex flex-col">
        <app-header></app-header>

        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <router-outlet />
        </main>
      </div>

      <section class="hidden xl:block w-80 border-l border-slate-800">
        <app-notifications></app-notifications>
      </section>
    </div>

    <!-- Mobile layout -->
    <div class="min-h-screen bg-[var(--layout-bg)] text-slate-100 md:hidden">
      <app-mobile-header
        (menuClick)="toggleMobileMenu()"
        (notificationsClick)="toggleNotificationDrawer()"
      ></app-mobile-header>

      <main class="p-3">
        <router-outlet />
      </main>

      <app-mobile-drawer
        [open]="mobileMenuOpen"
        (close)="mobileMenuOpen = false"
      ></app-mobile-drawer>

      <app-notification-drawer
        [open]="notificationDrawerOpen"
        (close)="notificationDrawerOpen = false"
      ></app-notification-drawer>
    </div>
  `,
})
export class MainLayoutComponent {
  mobileMenuOpen = false;
  notificationDrawerOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleNotificationDrawer() {
    this.notificationDrawerOpen = !this.notificationDrawerOpen;
  }
}
