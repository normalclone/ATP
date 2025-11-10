import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <section
      class="rounded-[14px] border border-white/10 bg-[#2b2d31] text-slate-100 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.85)] overflow-hidden"
    >
      <div class="p-6 lg:p-7">
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class CardComponent {}
