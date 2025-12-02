import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type ReportType = 'allure' | 'mochawesome' | null;

@Component({
  selector: 'app-run-report-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './run-report-embed.component.html',
  styleUrls: ['./run-report-embed.component.scss'],
})
export class RunReportEmbedComponent implements OnChanges {
  @Input() reportType: ReportType = null;
  @Input() reportUrl: string | null = null;

  safeUrl: SafeResourceUrl | null = null;
  isLoaded = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    if (this.reportUrl) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportUrl);
      this.isLoaded = false;
    } else {
      this.safeUrl = null;
      this.isLoaded = false;
    }
  }

  onIframeLoad(): void {
    this.isLoaded = true;
  }
}
