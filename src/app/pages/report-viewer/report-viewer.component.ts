import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss'],
})
export class ReportViewerComponent implements OnInit, OnDestroy {
  private defaultPath = 'assets/report/Mochawesome.html';
  reportUrl: SafeResourceUrl | null = null;
  rawUrl = this.defaultPath;
  private sub?: Subscription;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((params) => {
      const path = params.get('report') || params.get('path');
      this.rawUrl = path || this.defaultPath;
      this.setReportUrl();
    });
    if (!this.reportUrl) {
      this.setReportUrl();
    }
  }

  reloadReport(): void {
    // Force reload by appending a timestamp param.
    this.setReportUrl(true);
  }

  private setReportUrl(forceBust = false): void {
    const bust = forceBust ? `${this.rawUrl}${this.rawUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : this.rawUrl;
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(bust);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
