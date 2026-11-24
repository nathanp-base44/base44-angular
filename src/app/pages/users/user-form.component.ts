import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppUser, UserInput } from '../../data/users.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="save.emit(model)" class="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="text-sm font-semibold text-slate-900">{{ user ? 'Edit user' : 'Add user' }}</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block text-sm">
          <span class="text-slate-600">Name</span>
          <input name="name" required [(ngModel)]="model.name"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900" />
        </label>
        <label class="block text-sm">
          <span class="text-slate-600">Email</span>
          <input name="email" type="email" required [(ngModel)]="model.email"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900" />
        </label>
        <label class="block text-sm">
          <span class="text-slate-600">Role</span>
          <select name="role" [(ngModel)]="model.role"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900">
            <option value="Viewer">Viewer</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <label class="block text-sm">
          <span class="text-slate-600">Password{{ user ? ' (leave blank to keep)' : '' }}</span>
          <input name="password" type="password" [required]="!user" [(ngModel)]="model.password" autocomplete="new-password"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900" />
        </label>
      </div>
      @if (error) {
        <p class="text-sm text-red-600">{{ error }}</p>
      }
      <div class="flex gap-2">
        <button type="submit" [disabled]="busy"
          class="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {{ user ? 'Save changes' : 'Add user' }}
        </button>
        <button type="button" (click)="cancel.emit()"
          class="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
      </div>
    </form>
  `,
})
export class UserFormComponent implements OnChanges {
  @Input() user: AppUser | null = null;
  @Input() error = '';
  @Input() busy = false;
  @Output() save = new EventEmitter<UserInput>();
  @Output() cancel = new EventEmitter<void>();

  model: UserInput = { name: '', email: '', role: 'Viewer', password: '' };

  ngOnChanges() {
    this.model = this.user
      ? { name: this.user.name, email: this.user.email, role: this.user.role, password: '' }
      : { name: '', email: '', role: 'Viewer', password: '' };
  }
}
