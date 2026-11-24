import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

/** Redirects signed-out visitors to /login, returning them here afterwards. */
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  return inject(AuthService)
    .ensureLoaded()
    .pipe(map((u) => u ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })));
};
