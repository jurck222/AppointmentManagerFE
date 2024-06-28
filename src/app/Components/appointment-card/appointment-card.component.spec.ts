import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Appointment } from '../../Models/AppointmentModels';
import { AppointmentService } from '../../Services/appointment.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AppointmentCardComponent } from './appointment-card.component';

describe('AppointmentCardComponent', () => {
  let component: AppointmentCardComponent;
  let fixture: ComponentFixture<AppointmentCardComponent>;
  let confirmModal: ConfirmModalComponent;

  let appointmentService: AppointmentService;
  let modalService: NgbModal;

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
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    });
    fixture = TestBed.createComponent(AppointmentCardComponent);
    component = fixture.componentInstance;
    confirmModal = TestBed.createComponent(ConfirmModalComponent).componentInstance;

    appointmentService = fixture.debugElement.injector.get(AppointmentService);
    modalService = fixture.debugElement.injector.get(NgbModal);

    fixture.componentRef.setInput('title', 'Appointments');
    fixture.componentRef.setInput('userId', 1);
  });

  it('should fetch appointments', waitForAsync(() => {
    spyOn(appointmentService, 'getAppointments').and.returnValue(of([testAppointment, testAppointment2]));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(appointmentService.getAppointments).toHaveBeenCalledOnceWith(1);
      expect(component.appointments()).toEqual([testAppointment, testAppointment2]);
    });
  }));

  it('should open modal and delete appointment', waitForAsync(() => {
    const mockModal: Partial<NgbModalRef> = {
      result: new Promise(resolve => resolve(true)),
      componentInstance: confirmModal,
    };
    spyOn(modalService, 'open').and.returnValue(mockModal as NgbModalRef);
    spyOn(appointmentService, 'deleteAppointment').and.returnValue(of(void 0));

    fixture.detectChanges();
    component.deleteAppointment(testAppointment);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(appointmentService.deleteAppointment).toHaveBeenCalledOnceWith(1);
      expect(modalService.open).toHaveBeenCalled();
    });
  }));
});
