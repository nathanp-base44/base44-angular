import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

export type UserRole = 'Admin' | 'Viewer';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private loaded = false;

  readonly user = signal<SessionUser | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === 'Admin');

  /** Loads the signed-in user once; later calls reuse the cached value. */
  ensureLoaded(): Observable<SessionUser | null> {
    if (this.loaded) return of(this.user());
    return this.http.get<SessionUser>('/api/auth/me').pipe(
      catchError(() => of(null)),
      tap((u) => {
        this.loaded = true;
        this.user.set(u);
      })
    );
  }

  login(email: string, password: string): Observable<SessionUser> {
    return this.http.post<SessionUser>('/api/auth/login', { email, password }).pipe(
      tap((u) => {
        this.loaded = true;
        this.user.set(u);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post('/api/auth/logout', {}).pipe(
      map(() => undefined),
      tap(() => this.user.set(null))
    );
  }
}
