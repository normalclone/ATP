import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-bg via-bg to-bg-deep text-text">
      <router-outlet />
    </div>
  `,
})
export class AppComponent {}
