import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Availability } from '../../../../Models/AvailabilityModels';
import { AppointmentService } from '../../../../Services/appointment.service';
import { AvailabilityService } from '../../../../Services/availability.service';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { AvailabilityListComponent } from './availability-list.component';

describe('AvailabilityListComponent', () => {
  let component: AvailabilityListComponent;
  let fixture: ComponentFixture<AvailabilityListComponent>;
  let confirmModal: ConfirmModalComponent;
  let availabilityService: AvailabilityService;
  let modalService: NgbModal;
  let appointmentService: AppointmentService;

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
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    });
    fixture = TestBed.createComponent(AvailabilityListComponent);
    component = fixture.componentInstance;
    confirmModal = TestBed.createComponent(ConfirmModalComponent).componentInstance;

    appointmentService = fixture.debugElement.injector.get(AppointmentService);
    availabilityService = fixture.debugElement.injector.get(AvailabilityService);
    modalService = fixture.debugElement.injector.get(NgbModal);
  });

  it('should fetch availability', waitForAsync(() => {
    spyOn(availabilityService, 'getAvailability').and.returnValue(of([testAvailability, testAvailability2]));

    fixture.componentRef.setInput('doctorId', 1);
    fixture.componentRef.setInput('userId', 1);
    fixture.componentRef.setInput('service', 'General checkup');
    component.showAvailability.set(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(availabilityService.getAvailability).toHaveBeenCalledOnceWith(1);
      expect(component.availabilities()).toEqual([testAvailability, testAvailability2]);
    });
  }));

  it('should not fetch availability if doctorId is null', waitForAsync(() => {
    fixture.componentRef.setInput('doctorId', null);
    fixture.componentRef.setInput('userId', 1);
    fixture.componentRef.setInput('service', 'General checkup');
    component.showAvailability.set(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.availabilities()).toEqual([]);
    });
  }));

  it('should open modal and create appointment', waitForAsync(() => {
    const mockModal: Partial<NgbModalRef> = {
      result: new Promise(resolve => resolve(true)),
      componentInstance: confirmModal,
    };
    spyOn(modalService, 'open').and.returnValue(mockModal as NgbModalRef);
    spyOn(appointmentService, 'createAppointment').and.returnValue(of('created'));

    fixture.componentRef.setInput('doctorId', 1);
    fixture.componentRef.setInput('userId', 1);
    fixture.componentRef.setInput('service', 'General checkup');
    component.showAvailability.set(true);

    fixture.detectChanges();
    component.createAppointment(testAvailability);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(appointmentService.createAppointment).toHaveBeenCalled();
      expect(modalService.open).toHaveBeenCalled();
    });
  }));
});
