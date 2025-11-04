import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-notification-drawer',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-40 bg-black/60 flex justify-end"
      (click)="close.emit()"
    >
      <div
        class="w-80 max-w-full h-full bg-slate-950 border-l border-slate-800 p-3"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-semibold">Notifications</div>
          <button
            type="button"
            class="text-xs text-slate-400 hover:text-slate-100"
            (click)="close.emit()"
          >
            Close
          </button>
        </div>

        <!-- TODO: notification list -->
        <div class="text-xs text-slate-400">
          Empty state. Implement notifications later.
        </div>
      </div>
    </div>
  `,
})
export class NotificationDrawerComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
}
