import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getRole() {
    return this.http.get<string>('http://localhost:8087/api/v1/user/role');
  }
}
