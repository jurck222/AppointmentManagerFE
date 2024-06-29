import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorInfo } from '../Models/DoctorModels';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getId() {
    return this.http.get<number>('http://localhost:8087/api/v1/user/userId');
  }

  getServices() {
    return this.http.get<string[]>('http://localhost:8087/api/v1/user/services');
  }

  getDoctors(service: string) {
    return this.http.get<DoctorInfo[]>(`http://localhost:8087/api/v1/user/doctors/?medicalService=${service}`);
  }
}
