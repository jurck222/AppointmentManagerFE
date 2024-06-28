import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createNotifier } from 'ngxtension/create-notifier';
import { Appointment } from '../Models/AppointmentModels';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  readonly #loginService = inject(LoginService);
  notifyForRefetch = createNotifier();
  constructor(private http: HttpClient) {}

  createAppointment(appointment: Appointment) {
    return this.http.post<string>('http://localhost:8087/api/v1/appointment/', appointment);
  }

  getAppointments(id: number) {
    if (this.#loginService.getRole() === 'PATIENT') {
      return this.http.get<Appointment[]>(`http://localhost:8087/api/v1/appointment/user/${id}`);
    }
    if (this.#loginService.getRole() === 'DOCTOR') {
      return this.http.get<Appointment[]>(`http://localhost:8087/api/v1/appointment/doctor/${id}`);
    }
    return null;
  }

  deleteAppointment(id: number) {
    return this.http.delete<void>(`http://localhost:8087/api/v1/appointment/${id}`);
  }
}
