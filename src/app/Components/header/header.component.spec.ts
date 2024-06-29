import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let loginService: LoginService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    loginService = fixture.debugElement.injector.get(LoginService);
    router = fixture.debugElement.injector.get(Router);
  });

  it('set isLoggedIn to true', () => {
    spyOn(loginService, 'getToken').and.returnValue('token');
    spyOn(loginService, 'getRole').and.returnValue('DOCTOR');
    fixture.detectChanges();

    expect(component.isLoggedIn()).toBeTrue();
    expect(loginService.getToken).toHaveBeenCalled();
    expect(loginService.getRole).toHaveBeenCalled();
  });

  it('should logout user', () => {
    spyOn(loginService, 'removeToken');
    spyOn(loginService, 'removeRole');
    spyOn(router, 'navigate');

    component.logout();
    fixture.detectChanges();

    expect(loginService.removeRole).toHaveBeenCalled();
    expect(loginService.removeToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(component.isLoggedIn()).toBeFalse();
  });
});
