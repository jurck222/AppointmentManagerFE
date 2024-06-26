import { Routes } from '@angular/router';
import { doctorGuard, loginGuard, patientGuard } from './guards/guards';
export const routes: Routes = [
  {
    path: 'doctor',
    title: 'Doctor page',
    loadComponent: () => import('./Components/doctor/doctor.component').then(m => m.DoctorComponent),
    canActivate: [doctorGuard],
  },
  {
    path: 'login',
    title: 'Login page',
    loadComponent: () => import('./Components/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'patient',
    title: 'Patient page',
    loadComponent: () => import('./Components/patient/patient.component').then(m => m.PatientComponent),
    canActivate: [patientGuard],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
