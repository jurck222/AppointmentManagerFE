import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Availability, TimeWindow } from '../Models/AvailabilityModels';
import { AvailabilityService } from './availability.service';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let httpMock: HttpTestingController;

  const testTimeWindow: TimeWindow = {
    startTime: '2024-06-30T07:00:00',
    endTime: '2024-06-30T15:00:00',
  };

  const testAvailability: Availability = {
    id: 1,
    doctorId: 1,
    startTime: new Date(),
    endTime: new Date(),
    isBooked: false,
  };

  const testAvailability2: Availability = {
    id: 2,
    doctorId: 2,
    startTime: new Date(),
    endTime: new Date(),
    isBooked: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvailabilityService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AvailabilityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create availability', () => {
    const id = 1;

    service.createAvailability(id, testTimeWindow).subscribe(response => {
      expect(response).toEqual([testAvailability, testAvailability2]);
    });

    const req = httpMock.expectOne(
      `http://localhost:8087/api/v1/availability/${id}?startTime=${testTimeWindow.startTime}&endTime=${testTimeWindow.endTime}`
    );
    expect(req.request.method).toBe('POST');
    req.flush([testAvailability, testAvailability2]);
  });

  it('should get availability', () => {
    const id = 1;

    service.getAvailability(id).subscribe(response => {
      expect(response).toEqual([testAvailability, testAvailability2]);
    });

    const req = httpMock.expectOne(`http://localhost:8087/api/v1/availability/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush([testAvailability, testAvailability2]);
  });

  it('should delete availability', () => {
    const id = 1;

    service.deleteAvailability(id).subscribe(response => {
      expect(response).toEqual(Object({}));
    });

    const req = httpMock.expectOne(`http://localhost:8087/api/v1/availability/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
