import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability, TimeWindow } from '../Models/AvailabilityModels';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  createAvailability(id: number, timeWindow: TimeWindow) {
    return this.http.post<Availability[]>(
      `http://localhost:8087/api/v1/availability/${id}?startTime=${timeWindow.startTime}&endTime=${timeWindow.endTime}`,
      {}
    );
  }

  getAvailability(id: number) {
    return this.http.get<Availability[]>(`http://localhost:8087/api/v1/availability/${id}`);
  }

  deleteAvailability(id: number) {
    return this.http.delete<void>(`http://localhost:8087/api/v1/availability/${id}`);
  }
}
