import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const USER_ROLES = ['Admin', 'Editor', 'Viewer'] as const;
export const USER_STATUSES = ['Active', 'Invited', 'Suspended'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export type NewUser = Pick<User, 'name' | 'email' | 'role'>;

/** CRUD client for the admin user management API (`/api/users`). */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  list(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  create(user: NewUser): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }

  update(id: number, changes: Partial<Omit<User, 'id' | 'createdAt'>>): Observable<User> {
    return this.http.patch<User>(`/api/users/${id}`, changes);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
