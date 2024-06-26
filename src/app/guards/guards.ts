/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../Services/login.service';

export const doctorGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.getRole() === 'DOCTOR') {
    return true;
  } else {
    router.navigate(['/', 'login']);
    return false;
  }
};

export const patientGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.getRole() === 'PATIENT') {
    return true;
  } else {
    router.navigate(['/', 'login']);
    return false;
  }
};

export const loginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (!loginService.getToken()) {
    return true;
  } else {
    const token = loginService.getRole();
    switch (token) {
      case 'DOCTOR':
        router.navigate(['/', 'doctor']);
        break;
      case 'PATIENT':
        router.navigate(['/', 'patient']);
        break;
      default:
        return true;
    }
    return false;
  }
};
