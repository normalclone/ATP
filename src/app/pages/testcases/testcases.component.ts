import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestDataPageComponent } from './test-data-page.component';

@Component({
  selector: 'app-testcases',
  standalone: true,
  imports: [CommonModule, TestDataPageComponent],
  template: `<app-test-data-page></app-test-data-page>`,
})
export class TestcasesComponent {}
