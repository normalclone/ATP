import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

const AUTH_TOKEN_KEY = 'atp_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token$ = new BehaviorSubject<string | null>(this.readToken());

  constructor(private router: Router) {}

  get isAuthenticated(): boolean {
    return !!this.token$.value;
  }

  get token(): string | null {
    return this.token$.value;
  }

  login(username: string, password: string, remember = true): Observable<string> {
    if (!username || !password) {
      return throwError(() => new Error('missing_credentials'));
    }

    // Mock API delay and success. Replace with real HTTP call when available.
    return of('mock-token').pipe(
      delay(500),
      tap((token) => {
        this.persistToken(token, remember);
        this.token$.next(token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    this.token$.next(null);
    this.router.navigate(['/login']);
  }

  private persistToken(token: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  private readToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY);
  }
}
