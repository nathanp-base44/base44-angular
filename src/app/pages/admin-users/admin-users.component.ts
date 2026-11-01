import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewUser, User, USER_ROLES, USER_STATUSES, UserRole, UserStatus, UsersService } from '../../data/users.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent {
  private readonly api = inject(UsersService);

  readonly roles = USER_ROLES;
  readonly statuses = USER_STATUSES;

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly query = signal('');
  readonly roleFilter = signal<UserRole | ''>('');
  readonly statusFilter = signal<UserStatus | ''>('');

  readonly showAddForm = signal(false);
  readonly saving = signal(false);
  draft: NewUser = this.emptyDraft();

  readonly pendingDelete = signal<User | null>(null);

  readonly stats = computed(() => {
    const all = this.users();
    return [
      { label: 'Total users', value: all.length },
      ...USER_STATUSES.map((s) => ({ label: s, value: all.filter((u) => u.status === s).length })),
    ];
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const role = this.roleFilter();
    const status = this.statusFilter();
    return this.users().filter(
      (u) =>
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (!role || u.role === role) &&
        (!status || u.status === status)
    );
  });

  constructor() {
    this.api.list().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.fail(err);
        this.loading.set(false);
      },
    });
  }

  openAddForm() {
    this.draft = this.emptyDraft();
    this.error.set(null);
    this.showAddForm.set(true);
  }

  addUser() {
    this.saving.set(true);
    this.error.set(null);
    this.api.create(this.draft).subscribe({
      next: (user) => {
        this.users.update((list) => [...list, user]);
        this.showAddForm.set(false);
        this.saving.set(false);
      },
      error: (err) => {
        this.fail(err);
        this.saving.set(false);
      },
    });
  }

  changeRole(user: User, role: UserRole) {
    this.patch(user, { role });
  }

  toggleSuspended(user: User) {
    this.patch(user, { status: user.status === 'Suspended' ? 'Active' : 'Suspended' });
  }

  confirmDelete() {
    const user = this.pendingDelete();
    if (!user) return;
    this.api.remove(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.pendingDelete.set(null);
      },
      error: (err) => {
        this.fail(err);
        this.pendingDelete.set(null);
      },
    });
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  roleClass(role: UserRole): string {
    return { Admin: 'bg-brand-light text-brand', Editor: 'bg-sky-50 text-sky-700', Viewer: 'bg-slate-100 text-slate-600' }[role];
  }

  statusClass(status: UserStatus): string {
    return {
      Active: 'bg-emerald-50 text-emerald-700',
      Invited: 'bg-amber-50 text-amber-700',
      Suspended: 'bg-rose-50 text-rose-700',
    }[status];
  }

  private patch(user: User, changes: Partial<Pick<User, 'role' | 'status'>>) {
    this.error.set(null);
    this.api.update(user.id, changes).subscribe({
      next: (updated) => this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
      error: (err) => this.fail(err),
    });
  }

  private fail(err: HttpErrorResponse) {
    this.error.set(err.error?.error ?? 'Something went wrong. Please try again.');
  }

  private emptyDraft(): NewUser {
    return { name: '', email: '', role: 'Viewer' };
  }
}
