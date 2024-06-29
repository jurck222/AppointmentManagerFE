import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Availability, TimeWindow } from '../../../Models/AvailabilityModels';
import { AvailabilityService } from '../../../Services/availability.service';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { AddAvailabilityComponent } from '../add-availability/add-availability.component';
import { AvailabilityCardComponent } from './availability-card.component';

describe('AvailabilityCardComponent', () => {
  let component: AvailabilityCardComponent;
  let fixture: ComponentFixture<AvailabilityCardComponent>;
  let confirmModal: ConfirmModalComponent;
  let addAvailabilityComponent: AddAvailabilityComponent;
  let modalService: NgbModal;
  let availabilityService: AvailabilityService;

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

  const testTimeWindow: TimeWindow = {
    startTime: '2024-06-30T07:00:00',
    endTime: '2024-06-30T17:00:00',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    });
    fixture = TestBed.createComponent(AvailabilityCardComponent);
    component = fixture.componentInstance;
    confirmModal = TestBed.createComponent(ConfirmModalComponent).componentInstance;
    addAvailabilityComponent = TestBed.createComponent(AddAvailabilityComponent).componentInstance;

    modalService = fixture.debugElement.injector.get(NgbModal);
    availabilityService = fixture.debugElement.injector.get(AvailabilityService);
  });

  it('should set isCollapsed based on window width', () => {
    const triggerResize = (width: number) => {
      window.innerWidth = width;
      window.dispatchEvent(new Event('resize'));
    };

    triggerResize(800);
    expect(component.isCollapsed()).toBeFalse();

    triggerResize(600);
    expect(component.isCollapsed()).toBeTrue();
  });

  it('should fetch availability', waitForAsync(() => {
    spyOn(availabilityService, 'getAvailability').and.returnValue(of([testAvailability, testAvailability2]));
    fixture.componentRef.setInput('id', 1);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(availabilityService.getAvailability).toHaveBeenCalledOnceWith(1);
      expect(component.availabilities()).toEqual([testAvailability, testAvailability2]);
    });
  }));

  it('should not fetch availability if id is null', waitForAsync(() => {
    fixture.componentRef.setInput('id', null);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.availabilities()).toEqual([]);
    });
  }));

  it('should open modal and delete appointment', waitForAsync(() => {
    const mockModal: Partial<NgbModalRef> = {
      result: new Promise(resolve => resolve(true)),
      componentInstance: confirmModal,
    };
    spyOn(modalService, 'open').and.returnValue(mockModal as NgbModalRef);
    spyOn(availabilityService, 'deleteAvailability').and.returnValue(of(void 0));

    fixture.componentRef.setInput('id', 1);

    fixture.detectChanges();
    component.deleteAvailability(1);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(availabilityService.deleteAvailability).toHaveBeenCalledOnceWith(1);
      expect(modalService.open).toHaveBeenCalled();
    });
  }));

  it('should open modal and create availabilities', waitForAsync(() => {
    const mockModal: Partial<NgbModalRef> = {
      result: new Promise(resolve => resolve(testTimeWindow)),
      componentInstance: addAvailabilityComponent,
    };
    spyOn(modalService, 'open').and.returnValue(mockModal as NgbModalRef);
    spyOn(availabilityService, 'createAvailability').and.returnValue(of([testAvailability, testAvailability2]));
    spyOn(availabilityService, 'getAvailability').and.returnValue(of([testAvailability, testAvailability2]));

    fixture.componentRef.setInput('id', 1);

    fixture.detectChanges();
    component.openAddModal();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(availabilityService.createAvailability).toHaveBeenCalled();
      expect(availabilityService.getAvailability).toHaveBeenCalled();
      expect(modalService.open).toHaveBeenCalled();
    });
  }));
});
