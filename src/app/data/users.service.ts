import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from './auth.service';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserInput {
  name: string;
  email: string;
  role: UserRole;
  /** Required when creating; leave empty on edit to keep the current password. */
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  list(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>('/api/users');
  }

  create(input: UserInput): Observable<AppUser> {
    return this.http.post<AppUser>('/api/users', input);
  }

  update(id: number, input: UserInput): Observable<AppUser> {
    return this.http.put<AppUser>(`/api/users/${id}`, input);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
