import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { MobileDrawerComponent } from '../../shared/components/mobile-drawer/mobile-drawer.component';
import { NotificationDrawerComponent } from '../../shared/components/notification-drawer/notification-drawer.component';
import { RunScheduleModalComponent } from '../../shared/components/run-schedule-modal/run-schedule-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MobileDrawerComponent,
    NotificationDrawerComponent,
    RunScheduleModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-bg via-bg to-bg-deep text-text">
      <app-header
        (menuToggle)="toggleMobileMenu()"
        (notificationsToggle)="toggleNotifications()"
        (projectClick)="onProjectClick()"
        (search)="onSearch($event)"
        (runNow)="onRunNow()"
        [envValue]="env"
        (envChange)="env = $event"
      ></app-header>

      <div
        class="mx-auto grid w-full max-w-[1600px] grid-cols-12 gap-6 px-4 py-6 lg:py-8 lg:gap-8 xl:gap-10"
      >
        <div class="hidden md:block md:col-span-4 lg:col-span-2">
          <div class="sticky top-[56px]">
            <app-sidebar [isSuperAdmin]="isSuperAdmin"></app-sidebar>
          </div>
        </div>

        <section class="col-span-12 md:col-span-8 lg:col-span-10">
          <router-outlet />
        </section>
      </div>

      <app-mobile-drawer
        [open]="mobileMenuOpen"
        [isSuperAdmin]="isSuperAdmin"
        (close)="closeMobileMenu()"
      ></app-mobile-drawer>

      <app-notification-drawer
        [open]="notificationsOpen"
        (close)="closeNotifications()"
      ></app-notification-drawer>

      <app-run-schedule-modal
        [open]="runScheduleOpen"
        (close)="closeRunSchedule()"
        (submit)="closeRunSchedule()"
      ></app-run-schedule-modal>
    </div>
  `,
})
export class MainLayoutComponent {
  isSuperAdmin = false;
  env = 'dev';
  mobileMenuOpen = false;
  notificationsOpen = false;
  runScheduleOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
  }

  closeNotifications() {
    this.notificationsOpen = false;
  }

  onProjectClick() {
    // TODO: open project switcher modal/drawer
  }

  onSearch(query: string) {
    // TODO: connect global search handler
  }

  onRunNow() {
    this.runScheduleOpen = true;
  }

  closeRunSchedule() {
    this.runScheduleOpen = false;
  }
}
