import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginParams, LoginResponse } from '../Models/AuthModels';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient) {}

  login(data: LoginParams) {
    return this.http.post<LoginResponse>('http://localhost:8087/api/v1/auth/authenticate', data);
  }
}
