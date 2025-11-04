import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  template: `
    <div class="h-full flex flex-col p-4">
      <h2 class="text-sm font-semibold mb-3">Notifications</h2>
      <!-- TODO: list notification -->
      <div class="text-xs text-slate-400">
        No notifications yet. Implement later.
      </div>
    </div>
  `,
})
export class NotificationsComponent {}
