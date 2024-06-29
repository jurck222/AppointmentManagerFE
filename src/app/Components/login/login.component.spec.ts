import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../Models/AuthModels';
import { AuthenticateService } from '../../Services/authenticate.service';
import { LoginService } from '../../Services/login.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let authService: AuthenticateService;
  let router: Router;

  const testLoginResponseDoctor: LoginResponse = {
    role: 'DOCTOR',
    token: 'kalshglckahdcgkahcklashfklasfhackslhasclkf',
  };

  const testLoginResponsePatient: LoginResponse = {
    role: 'PATIENT',
    token: 'kalshglckahdcgkahcklashfklasfhackslhasclkf',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    loginService = fixture.debugElement.injector.get(LoginService);
    authService = fixture.debugElement.injector.get(AuthenticateService);
    router = fixture.debugElement.injector.get(Router);

    fixture.detectChanges();
  });

  it('should submit form on login for doctor', () => {
    spyOn(authService, 'login').and.returnValue(of(testLoginResponseDoctor));
    spyOn(loginService, 'setToken');
    spyOn(loginService, 'setRole');
    spyOn(loginService.loginSubject, 'next');
    spyOn(router, 'navigate');

    const inputUsername = fixture.debugElement.query(By.css('#inputUsername')).nativeElement;
    inputUsername.value = 'doktor@mail.com';
    inputUsername.dispatchEvent(new Event('input'));

    const inputPassowrd = fixture.debugElement.query(By.css('#inputPassword')).nativeElement;
    inputPassowrd.value = 'doktor123';
    inputPassowrd.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalled();
    expect(loginService.setRole).toHaveBeenCalled();
    expect(loginService.setToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/', 'doctor']);
    expect(loginService.loginSubject.next).toHaveBeenCalled();
    expect(component.showError()).toBeFalse();
  });

  it('should submit form on login for patient', () => {
    spyOn(authService, 'login').and.returnValue(of(testLoginResponsePatient));
    spyOn(loginService, 'setToken');
    spyOn(loginService, 'setRole');
    spyOn(loginService.loginSubject, 'next');
    spyOn(router, 'navigate');

    const inputUsername = fixture.debugElement.query(By.css('#inputUsername')).nativeElement;
    inputUsername.value = 'patient@mail.com';
    inputUsername.dispatchEvent(new Event('input'));

    const inputPassowrd = fixture.debugElement.query(By.css('#inputPassword')).nativeElement;
    inputPassowrd.value = 'patient123';
    inputPassowrd.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalled();
    expect(loginService.setRole).toHaveBeenCalled();
    expect(loginService.setToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/', 'patient']);
    expect(loginService.loginSubject.next).toHaveBeenCalled();
    expect(component.showError()).toBeFalse();
  });

  it('should show error on invalid mail', () => {
    const inputUsername = fixture.debugElement.query(By.css('#inputUsername')).nativeElement;
    inputUsername.value = 'patient';
    inputUsername.dispatchEvent(new Event('input'));

    const inputPassowrd = fixture.debugElement.query(By.css('#inputPassword')).nativeElement;
    inputPassowrd.value = 'patient123';
    inputPassowrd.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const errorSpan = fixture.debugElement.query(By.css('#errorSpan')).nativeElement;

    expect(component.showError()).toBeTrue();
    expect(errorSpan.innerHTML.trim()).toEqual('Username or password is invalid.');
  });

  it('should show error on invalid credentials', () => {
    spyOn(authService, 'login').and.returnValue(throwError(() => 'login error'));

    const inputUsername = fixture.debugElement.query(By.css('#inputUsername')).nativeElement;
    inputUsername.value = 'patient@mail.com';
    inputUsername.dispatchEvent(new Event('input'));

    const inputPassowrd = fixture.debugElement.query(By.css('#inputPassword')).nativeElement;
    inputPassowrd.value = 'patient123';
    inputPassowrd.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const errorSpan = fixture.debugElement.query(By.css('#errorSpan')).nativeElement;

    expect(authService.login).toHaveBeenCalled();
    expect(component.showError()).toBeTrue();
    expect(errorSpan.innerHTML.trim()).toEqual('Username or password is invalid.');
  });
});
