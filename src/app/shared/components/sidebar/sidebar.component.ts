import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="h-full flex flex-col text-sm">
      <div class="px-4 py-3 font-semibold text-xs uppercase text-slate-400">
        Navigation
      </div>

      <ul class="flex-1 space-y-1 px-2">
        <li>
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-slate-800"
            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800"
          >
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a
            routerLink="/testcases"
            routerLinkActive="bg-slate-800"
            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800"
          >
            <span>Testcases</span>
          </a>
        </li>
        <li>
          <a
            routerLink="/report"
            routerLinkActive="bg-slate-800"
            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800"
          >
            <span>Report</span>
          </a>
        </li>
        <li>
          <a
            routerLink="/schedulers"
            routerLinkActive="bg-slate-800"
            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800"
          >
            <span>Schedulers</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
})
export class SidebarComponent {}
