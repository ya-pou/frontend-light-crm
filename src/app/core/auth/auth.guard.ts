import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { RedirectCommand, Router } from '@angular/router';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLogged()) {
    return new RedirectCommand(router.parseUrl('/login'));
  }

  return true;
};
