import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimeWindow } from '../../../Models/AvailabilityModels';
import { AddAvailabilityComponent } from './add-availability.component';

describe('AddAvailabilityComponent', () => {
  let component: AddAvailabilityComponent;
  let fixture: ComponentFixture<AddAvailabilityComponent>;
  let activeModal: NgbActiveModal;

  const testDate: NgbDateStruct = {
    year: 2024,
    month: 6,
    day: 30,
  };

  const testTimeWindow: TimeWindow = {
    startTime: '2024-06-30T07:00:00',
    endTime: '2024-06-30T15:00:00',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
    });
    fixture = TestBed.createComponent(AddAvailabilityComponent);
    component = fixture.componentInstance;

    activeModal = fixture.debugElement.injector.get(NgbActiveModal);
  });

  it('should set error if date is null', () => {
    component.add();
    fixture.detectChanges();

    expect(component.errorMessage()).toEqual('Choose a date');
  });

  it('should set error if startTime is too large', () => {
    component.date = testDate;
    component.startTime = 100;

    fixture.detectChanges();
    component.add();
    fixture.detectChanges();

    expect(component.errorMessage()).toEqual('The times can only be between 0 and 24');
  });

  it('should set error if endTime is too large', () => {
    component.date = testDate;
    component.endTime = 100;

    fixture.detectChanges();
    component.add();
    fixture.detectChanges();

    expect(component.errorMessage()).toEqual('The times can only be between 0 and 24');
  });

  it('should set error if startTime is too small', () => {
    component.date = testDate;
    component.startTime = -100;

    fixture.detectChanges();
    component.add();
    fixture.detectChanges();

    expect(component.errorMessage()).toEqual('The times can only be between 0 and 24');
  });

  it('should set error if endTime is too small', () => {
    component.date = testDate;
    component.endTime = -100;

    fixture.detectChanges();
    component.add();
    fixture.detectChanges();

    expect(component.errorMessage()).toEqual('The times can only be between 0 and 24');
  });

  it('should set create timeWindow object', () => {
    spyOn(activeModal, 'close');
    component.date = testDate;
    component.startTime = 7;
    component.endTime = 15;

    fixture.detectChanges();
    component.add();
    fixture.detectChanges();

    expect(activeModal.close).toHaveBeenCalledOnceWith(testTimeWindow);
  });
});
