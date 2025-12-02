import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">ATP</div>
          <div>
            <h1>AutoTest Portal</h1>
            <p>Đăng nhập để tiếp tục</p>
          </div>
        </div>

        <div class="login-body">
          <form (ngSubmit)="onSubmit()" novalidate>
            <label class="field">
              <span>Email / Username</span>
              <input
                data-testid="username"
                [(ngModel)]="username"
                name="username"
                type="text"
                placeholder="Nhập email hoặc username"
                [class.invalid]="submitted && !username"
              />
              <small *ngIf="submitted && !username">Vui lòng nhập tài khoản hợp lệ</small>
            </label>

            <label class="field">
              <span>Mật khẩu</span>
              <input
                data-testid="password"
                [(ngModel)]="password"
                name="password"
                [type]="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu"
                [class.invalid]="submitted && !password"
              />
              <small *ngIf="submitted && !password">Vui lòng nhập mật khẩu</small>
            </label>

            <div *ngIf="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <label class="show-password">
              <input type="checkbox" [(ngModel)]="showPassword" name="showPassword" />
              <span>Hiện mật khẩu</span>
            </label>

            <button
              data-testid="login-button"
              type="submit"
              class="btn-primary"
              [disabled]="loading"
            >
              <span *ngIf="!loading">Đăng nhập</span>
              <span *ngIf="loading">Đang đăng nhập...</span>
            </button>
          </form>
        </div>

        <div class="login-footer">
          <p>AutoTest Portal • Version 1.0.0 • © 2025</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    if (!this.username || !this.password) return;

    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.';
      },
    });
  }
}
