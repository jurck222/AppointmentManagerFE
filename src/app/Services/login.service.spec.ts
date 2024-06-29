import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LoginService] });
    service = TestBed.inject(LoginService);
  });

  it('should set role', () => {
    service.setRole('Doctor');
    expect(service.getRole()).toEqual('Doctor');
  });

  it('should set token', () => {
    service.setToken('token');
    expect(service.getToken()).toEqual('token');
  });

  it('should remove token', () => {
    service.setToken('token');
    service.setRole('Doctor');

    expect(service.getRole()).toEqual('Doctor');
    expect(service.getToken()).toEqual('token');

    service.removeToken();
    service.removeRole();
  });
});
