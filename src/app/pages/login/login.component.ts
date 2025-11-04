import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100"
    >
      <div class="w-full max-w-sm border border-slate-800 rounded-lg p-6">
        <h1 class="text-lg font-semibold mb-4">Login</h1>

        <!-- TODO: form login, validation, v.v. -->
        <form class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Username</label>
            <input
              class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Password</label>
            <input
              type="password"
              class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            class="w-full mt-2 rounded-md bg-sky-600 hover:bg-sky-500 py-2 text-sm font-medium"
          >
            Sign in
          </button>
        </form>

        <div class="mt-4 text-xs text-slate-500 text-center">
          <a routerLink="/dashboard" class="underline">
            Skip to dashboard (dev only)
          </a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {}
