import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartComponent],
  template: `
    <div class="space-y-4">
      <h1 class="text-lg font-semibold">Report</h1>

      <app-chart></app-chart>

      <app-card></app-card>
    </div>
  `,
})
export class ReportComponent {}
