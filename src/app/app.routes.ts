import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'testcases',
        loadComponent: () =>
          import('./pages/testcases/testcases.component').then(
            (m) => m.TestcasesComponent
          ),
      },
      {
        path: 'report',
        loadComponent: () =>
          import('./pages/report/report.component').then(
            (m) => m.ReportComponent
          ),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/alerts/alerts.component').then(
            (m) => m.AlertsComponent
          ),
      },
      {
        path: 'schedulers',
        loadComponent: () =>
          import('./pages/schedulers/schedulers.component').then(
            (m) => m.SchedulersComponent
          ),
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./features/components-gallery/components-gallery.component').then(
            (m) => m.ComponentsGalleryComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
