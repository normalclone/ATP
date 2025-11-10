import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  template: `
    <!-- TODO: implement mobile header -->
  `,
})
export class MobileHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();
}
