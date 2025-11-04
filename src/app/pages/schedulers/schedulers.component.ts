import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { InputsComponent } from '../../shared/components/inputs/inputs.component';

@Component({
  selector: 'app-schedulers',
  standalone: true,
  imports: [CommonModule, CardComponent, InputsComponent],
  template: `
    <div class="space-y-4">
      <h1 class="text-lg font-semibold">Schedulers</h1>

      <app-card></app-card>

      <app-inputs></app-inputs>
    </div>
  `,
})
export class SchedulersComponent {}
