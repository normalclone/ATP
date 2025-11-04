import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header
      class="h-14 flex items-center justify-between px-4 border-b border-slate-800"
    >
      <!-- TODO: Logo, breadcrumb, actions -->
      <div class="font-semibold tracking-tight">ATP Dashboard</div>
      <div class="flex items-center gap-2">
        <!-- TODO: actions -->
        <button
          type="button"
          class="px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700"
        >
          Action
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
