import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsCardComponent } from './doctors-card.component';

describe('DoctorsCardComponent', () => {
  let component: DoctorsCardComponent;
  let fixture: ComponentFixture<DoctorsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    fixture = TestBed.createComponent(DoctorsCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('service', 'General checkup');
    fixture.componentRef.setInput('userId', 1);

    fixture.detectChanges();
  });

  it('should set doctorId to correct value and showAvailability to true ', () => {
    component.handleDoctorSelect(202);
    fixture.detectChanges();

    expect(component.selectedDoctorId()).toEqual(202);
    expect(component.showAvailability()).toBeTrue();
  });
});
