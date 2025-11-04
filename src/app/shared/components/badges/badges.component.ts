import { Component } from '@angular/core';

@Component({
  selector: 'app-badges',
  standalone: true,
  template: `
    <!-- TODO: nhiều biến thể badge -->
    <div class="flex flex-wrap gap-2 text-xs">
      <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800">
        Default
      </span>
      <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-700/60">
        Success
      </span>
      <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-700/60">
        Warning
      </span>
    </div>
  `,
})
export class BadgesComponent {}
