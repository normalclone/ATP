import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  template: `
    <header
      class="h-12 flex items-center justify-between px-3 border-b border-slate-800"
    >
      <button
        type="button"
        class="p-1.5 rounded-md bg-slate-900 border border-slate-700"
        (click)="menuClick.emit()"
      >
        <!-- icon menu -->
        <span class="block w-4 h-0.5 bg-slate-200 mb-0.5"></span>
        <span class="block w-4 h-0.5 bg-slate-200 mb-0.5"></span>
        <span class="block w-4 h-0.5 bg-slate-200"></span>
      </button>

      <div class="text-sm font-semibold">ATP</div>

      <button
        type="button"
        class="p-1.5 rounded-md bg-slate-900 border border-slate-700"
        (click)="notificationsClick.emit()"
      >
        <!-- icon bell fake -->
        <span class="block w-4 h-4 border border-slate-200 rounded-full"></span>
      </button>
    </header>
  `,
})
export class MobileHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();
}
