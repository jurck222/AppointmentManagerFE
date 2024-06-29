import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { DoctorComponent } from './doctor.component';

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;

    userService = fixture.debugElement.injector.get(UserService);
  });

  it('should get id', () => {
    spyOn(userService, 'getId').and.returnValue(of(202));

    fixture.detectChanges();

    expect(component.id()).toEqual(202);
  });
});
