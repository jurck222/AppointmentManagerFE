import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Appointment } from '../Models/AppointmentModels';
import { AppointmentService } from './appointment.service';
import { LoginService } from './login.service';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

  const testAppointment: Appointment = {
    id: 1,
    doctorId: 1,
    patientId: 1,
    availabilityId: 1,
    service: 'General checkup',
    startTime: new Date(),
    endTime: new Date(),
  };

  const testAppointment2: Appointment = {
    id: 2,
    doctorId: 1,
    patientId: 1,
    availabilityId: 2,
    service: 'General checkup',
    startTime: new Date(),
    endTime: new Date(),
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoginService', ['getRole']);

    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        { provide: LoginService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an appointment', () => {
    service.createAppointment(testAppointment).subscribe(response => {
      expect(response).toEqual('success');
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/appointment/');
    expect(req.request.method).toBe('POST');
    req.flush('success');
  });

  it('should get appointments for patient', () => {
    loginServiceSpy.getRole.and.returnValue('PATIENT');

    service.getAppointments(1).subscribe(appointments => {
      expect(appointments).toEqual([testAppointment, testAppointment2]);
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/appointment/user/1');
    expect(req.request.method).toBe('GET');
    req.flush([testAppointment, testAppointment2]);
  });

  it('should get appointments for doctor', () => {
    loginServiceSpy.getRole.and.returnValue('DOCTOR');

    service.getAppointments(1).subscribe(appointments => {
      expect(appointments).toEqual([testAppointment, testAppointment2]);
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/appointment/doctor/1');
    expect(req.request.method).toBe('GET');
    req.flush([testAppointment, testAppointment2]);
  });

  it('should return [] for unauthorized role', () => {
    loginServiceSpy.getRole.and.returnValue('ADMIN');

    service.getAppointments(1).subscribe(appointments => {
      expect(appointments).toEqual([]);
    });
  });

  it('should delete an appointment', () => {
    service.deleteAppointment(1).subscribe(response => {
      expect(response).toEqual(Object({}));
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/appointment/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
