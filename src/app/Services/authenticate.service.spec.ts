import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoginParams, LoginResponse } from '../Models/AuthModels';
import { AuthenticateService } from './authenticate.service';

describe('AuthenticateService', () => {
  let service: AuthenticateService;
  let httpMock: HttpTestingController;

  const testLogin: LoginParams = {
    email: 'doktor@mail.com',
    password: 'doktor123',
  };

  const testLoginResponse: LoginResponse = {
    token: 'asda32da4s3d2as4d3sa2d',
    role: 'DOCTOR',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticateService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthenticateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user', () => {
    service.login(testLogin).subscribe(response => {
      expect(response).toEqual(testLoginResponse);
    });

    const req = httpMock.expectOne('http://localhost:8087/api/v1/auth/authenticate');
    expect(req.request.method).toBe('POST');
    req.flush(testLoginResponse);
  });
});
