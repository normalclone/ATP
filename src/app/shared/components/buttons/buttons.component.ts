import { Component } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  template: `
    <!-- TODO: nhiều biến thể button -->
    <div class="flex flex-wrap gap-2 text-sm">
      <button
        class="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-xs font-medium"
      >
        Primary
      </button>
      <button
        class="px-3 py-1.5 rounded-md border border-slate-600 text-xs font-medium"
      >
        Outline
      </button>
    </div>
  `,
})
export class ButtonsComponent {}
