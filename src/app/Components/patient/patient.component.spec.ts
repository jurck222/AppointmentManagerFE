import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { PatientComponent } from './patient.component';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;

    userService = fixture.debugElement.injector.get(UserService);
  });

  it('should get id and services', () => {
    spyOn(userService, 'getId').and.returnValue(of(202));
    spyOn(userService, 'getServices').and.returnValue(of(['General checkup', 'Dental cleaning']));

    fixture.detectChanges();

    expect(component.userId()).toEqual(202);
    expect(component.services()).toEqual(['General checkup', 'Dental cleaning']);
  });
});
