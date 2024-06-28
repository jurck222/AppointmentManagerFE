import { Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../Services/user.service';
import { AppointmentCardComponent } from '../appointment-card/appointment-card.component';
import { DoctorsCardComponent } from './doctors-card/doctors-card.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  template: `
    <div class="d-flex flex-column flex-lg-row w-75 ms-auto me-auto justify-content-around  pt-5">
      <div class="selection mb-2">
        <ng-select
          [items]="services()"
          [(ngModel)]="selectedService"
          class="mb-2"></ng-select>
        <app-doctors-card
          [service]="selectedService()"
          [userId]="userId()" />
      </div>
      <app-appointment-card
        [title]="cardTitle"
        [userId]="userId()" />
    </div>
  `,
  styles: `
    .selection {
      width: 25rem;
    }
    @media (max-width: 700px) {
      .selection {
        width: 18rem;
      }
    }
  `,
  imports: [AppointmentCardComponent, NgSelectModule, FormsModule, DoctorsCardComponent],
})
export class PatientComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #destroyRef = inject(DestroyRef);

  services = signal<string[]>([]);
  selectedService = model('Select a service');
  cardTitle = 'My bookings';
  userId = signal(0);

  ngOnInit(): void {
    this.#userService
      .getServices()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(data => this.services.set(data));

    this.#userService
      .getId()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(data => this.userId.set(data));
  }
}
