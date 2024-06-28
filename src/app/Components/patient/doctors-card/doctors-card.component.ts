import { Component, effect, input, signal } from '@angular/core';
import { AvailabilityListComponent } from './availability-list/availability-list.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';

@Component({
  selector: 'app-doctors-card',
  standalone: true,
  template: `
    @if (!showAvailability()) {
      <app-doctors-list
        [service]="service()"
        (selectedDoctorE)="handleDoctorSelect($event)" />
    } @else {
      <app-availability-list
        [(showAvailability)]="showAvailability"
        [doctorId]="selectedDoctorId()"
        [service]="service()"
        [userId]="userId()" />
    }
  `,
  styles: ``,
  imports: [DoctorsListComponent, AvailabilityListComponent],
})
export class DoctorsCardComponent {
  service = input.required<string>();
  showAvailability = signal(false);
  selectedDoctorId = signal(0);
  userId = input.required<number>();

  constructor() {
    effect(
      () => {
        if (this.service()) {
          this.showAvailability.set(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  handleDoctorSelect(id: number) {
    this.selectedDoctorId.set(id);
    this.showAvailability.set(true);
  }
}
