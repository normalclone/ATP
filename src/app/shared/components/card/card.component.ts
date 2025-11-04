import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <!-- TODO: generic card layout / ng-content -->
      Card placeholder
    </div>
  `,
})
export class CardComponent {}
