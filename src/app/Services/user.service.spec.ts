import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DoctorInfo } from '../Models/DoctorModels';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const testDoctor: DoctorInfo = {
    doctorId: 1,
    firstname: 'Joze',
    lastname: 'Nevrologic',
  };

  const testDoctor2: DoctorInfo = {
    doctorId: 2,
    firstname: 'Janez',
    lastname: 'Rentgenski',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user ID', () => {
    const mockId = 123;

    service.getId().subscribe(id => {
      expect(id).toEqual(mockId);
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/user/userId');
    expect(req.request.method).toBe('GET');
    req.flush(mockId);
  });

  it('should get services', () => {
    const testServices = ['General checkup', 'Dental cleaning'];

    service.getServices().subscribe(services => {
      expect(services).toEqual(testServices);
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/user/services');
    expect(req.request.method).toBe('GET');
    req.flush(testServices);
  });

  it('should get doctors for a service', () => {
    const serviceType = 'General checkup';

    service.getDoctors(serviceType).subscribe(doctors => {
      expect(doctors).toEqual([testDoctor, testDoctor2]);
    });

    const req = httpMock.expectOne(`http://localhost:8087/api/v1/user/doctors/?medicalService=${serviceType}`);
    expect(req.request.method).toBe('GET');
    req.flush([testDoctor, testDoctor2]);
  });
});
