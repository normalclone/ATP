import { Component } from '@angular/core';

@Component({
  selector: 'app-inputs',
  standalone: true,
  template: `
    <!-- TODO: nhiều loại input: text, select, date, v.v. -->
    <div class="space-y-3 text-sm">
      <div>
        <label class="block mb-1 text-xs text-slate-400">Input sample</label>
        <input
          class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          placeholder="Placeholder"
        />
      </div>
    </div>
  `,
})
export class InputsComponent {}
