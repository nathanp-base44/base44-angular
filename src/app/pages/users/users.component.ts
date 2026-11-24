import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../data/auth.service';
import { AppUser, UserInput, UsersService } from '../../data/users.service';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DatePipe, UserFormComponent],
  template: `
    <div class="space-y-4 p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-slate-900">Users</h1>
        @if (auth.isAdmin() && !formOpen()) {
          <button type="button" (click)="openForm(null)"
            class="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">+ Add user</button>
        }
      </div>

      @if (!auth.isAdmin()) {
        <p class="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">Only Admins can add, edit or delete users.</p>
      }

      @if (formOpen()) {
        <app-user-form [user]="editing()" [error]="formError()" [busy]="busy()" (save)="save($event)" (cancel)="closeForm()" />
      }

      @if (listError()) {
        <p class="text-sm text-red-600">{{ listError() }}</p>
      }

      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3">Added</th>
              @if (auth.isAdmin()) { <th class="px-4 py-3 text-right">Actions</th> }
            </tr>
          </thead>
          <tbody>
            @for (u of users(); track u.id) {
              <tr class="border-b border-slate-100 last:border-0">
                <td class="px-4 py-3 font-medium text-slate-900">{{ u.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ u.email }}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-2 py-0.5 text-xs font-medium"
                    [class]="u.role === 'Admin' ? 'bg-brand-light text-brand' : 'bg-slate-100 text-slate-600'">{{ u.role }}</span>
                </td>
                <td class="px-4 py-3 text-slate-600">{{ u.created_at | date: 'mediumDate' }}</td>
                @if (auth.isAdmin()) {
                  <td class="space-x-2 px-4 py-3 text-right">
                    <button type="button" (click)="openForm(u)" class="text-sm text-brand hover:underline">Edit</button>
                    @if (u.id !== auth.user()?.id) {
                      <button type="button" (click)="remove(u)" class="text-sm text-red-600 hover:underline">Delete</button>
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-6 text-center text-slate-400">No users yet.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly api = inject(UsersService);

  readonly users = signal<AppUser[]>([]);
  readonly listError = signal('');
  readonly formOpen = signal(false);
  readonly editing = signal<AppUser | null>(null);
  readonly formError = signal('');
  readonly busy = signal(false);

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.list().subscribe({
      next: (u) => this.users.set(u),
      error: (e) => this.listError.set(e.error?.error || 'Could not load users'),
    });
  }

  openForm(user: AppUser | null) {
    this.editing.set(user);
    this.formError.set('');
    this.formOpen.set(true);
  }

  closeForm() {
    this.formOpen.set(false);
    this.editing.set(null);
  }

  save(input: UserInput) {
    const current = this.editing();
    this.busy.set(true);
    this.formError.set('');
    const req = current ? this.api.update(current.id, input) : this.api.create(input);
    req.subscribe({
      next: () => {
        this.busy.set(false);
        this.closeForm();
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.formError.set(e.error?.error || 'Could not save user');
      },
    });
  }

  remove(user: AppUser) {
    if (!confirm(`Delete ${user.name}? This can't be undone.`)) return;
    this.api.remove(user.id).subscribe({
      next: () => this.load(),
      error: (e) => this.listError.set(e.error?.error || 'Could not delete user'),
    });
  }
}
