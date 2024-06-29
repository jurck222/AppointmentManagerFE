import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { DoctorInfo } from '../../../../Models/DoctorModels';
import { UserService } from '../../../../Services/user.service';
import { DoctorsListComponent } from './doctors-list.component';

describe('DoctorsListComponent', () => {
  let component: DoctorsListComponent;
  let fixture: ComponentFixture<DoctorsListComponent>;

  let userService: UserService;

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
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(DoctorsListComponent);
    component = fixture.componentInstance;

    userService = fixture.debugElement.injector.get(UserService);
  });

  it('should fetch doctors', waitForAsync(() => {
    spyOn(userService, 'getDoctors').and.returnValue(of([testDoctor, testDoctor2]));

    fixture.componentRef.setInput('service', 'General checkup');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(userService.getDoctors).toHaveBeenCalled();
      expect(component.doctors()).toEqual([testDoctor, testDoctor2]);
    });
  }));

  it('should not fetch doctors if service is null', waitForAsync(() => {
    fixture.componentRef.setInput('service', null);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.doctors()).toEqual([]);
    });
  }));

  it('should not fetch doctors if service is default prompt', waitForAsync(() => {
    fixture.componentRef.setInput('service', 'Select a service');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.doctors()).toEqual([]);
    });
  }));

  it('should emit selected doctor', () => {
    spyOn(component.selectedDoctorE, 'emit');

    fixture.componentRef.setInput('service', 'General checkup');

    fixture.detectChanges();
    component.selectDoctor(testDoctor.doctorId);
    fixture.detectChanges();

    expect(component.selectedDoctorE.emit).toHaveBeenCalledOnceWith(testDoctor.doctorId);
  });
});
