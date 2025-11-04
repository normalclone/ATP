import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-40 bg-black/60 flex"
      (click)="close.emit()"
    >
      <div
        class="w-64 bg-slate-950 h-full p-3"
        (click)="$event.stopPropagation()"
      >
        <!-- TODO: copy từ sidebar -->
        <a
          routerLink="/dashboard"
          class="block px-2 py-2 rounded-md hover:bg-slate-800 text-sm"
          (click)="close.emit()"
        >
          Dashboard
        </a>
        <a
          routerLink="/testcases"
          class="block px-2 py-2 rounded-md hover:bg-slate-800 text-sm"
          (click)="close.emit()"
        >
          Testcases
        </a>
        <a
          routerLink="/report"
          class="block px-2 py-2 rounded-md hover:bg-slate-800 text-sm"
          (click)="close.emit()"
        >
          Report
        </a>
        <a
          routerLink="/schedulers"
          class="block px-2 py-2 rounded-md hover:bg-slate-800 text-sm"
          (click)="close.emit()"
        >
          Schedulers
        </a>
      </div>
    </div>
  `,
})
export class MobileDrawerComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
}
