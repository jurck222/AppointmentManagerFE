import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loginSubject = new Subject<void>();
  key = 'token';
  roleKey = 'role';
  getToken() {
    return localStorage.getItem(this.key);
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.key, token);
  }

  setRole(role: string) {
    localStorage.setItem(this.roleKey, role);
  }

  removeToken() {
    localStorage.removeItem(this.key);
  }

  removeRole() {
    localStorage.removeItem(this.roleKey);
  }
}
