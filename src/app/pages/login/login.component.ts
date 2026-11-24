import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../data/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex justify-center p-6">
      <form (ngSubmit)="submit()" class="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h1 class="text-xl font-semibold text-slate-900">Sign in</h1>
        <label class="block text-sm">
          <span class="text-slate-600">Email</span>
          <input name="email" type="email" required [(ngModel)]="email" autocomplete="username"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900" />
        </label>
        <label class="block text-sm">
          <span class="text-slate-600">Password</span>
          <input name="password" type="password" required [(ngModel)]="password" autocomplete="current-password"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900" />
        </label>
        @if (error) {
          <p class="text-sm text-red-600">{{ error }}</p>
        }
        <button type="submit" [disabled]="busy"
          class="w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {{ busy ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  error = '';
  busy = false;

  submit() {
    this.busy = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/users'),
      error: (e) => {
        this.error = e.error?.error || 'Sign in failed';
        this.busy = false;
      },
    });
  }
}
