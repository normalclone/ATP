import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { ButtonsComponent } from '../../shared/components/buttons/buttons.component';
import { BadgesComponent } from '../../shared/components/badges/badges.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartComponent, ButtonsComponent, BadgesComponent],
  template: `
    <div class="space-y-4">
      <h1 class="text-lg font-semibold">Dashboard</h1>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <app-card></app-card>
        <app-card></app-card>
        <app-card></app-card>
      </div>

      <app-chart></app-chart>

      <div class="space-y-3">
        <app-buttons></app-buttons>
        <app-badges></app-badges>
      </div>
    </div>
  `,
})
export class DashboardComponent {}
