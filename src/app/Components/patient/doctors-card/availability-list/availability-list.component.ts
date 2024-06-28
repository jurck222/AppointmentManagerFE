import { Component, DestroyRef, inject, input, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, tap } from 'rxjs';
import { Appointment } from '../../../../Models/AppointmentModels';
import { Availability } from '../../../../Models/AvailabilityModels';
import { AppointmentService } from '../../../../Services/appointment.service';
import { AvailabilityService } from '../../../../Services/availability.service';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="d-flex justify-content-start align-items-center p-2">
        <button
          class="unstyled-button mb-1"
          (click)="showAvailability.set(false)">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h5 class="ms-1">Availability</h5>
      </div>
      <ul class="list-group list-group-flush">
        @if (!availabilities()?.length) {
          <li class="list-group-item text-center text-secondary">No available times.</li>
        } @else {
          @for (availability of availabilities(); track availability.id) {
            <li class="list-group-item d-flex justify-content-between">
              <div>
                {{ availability.startTime.getDate() }}.{{ availability.startTime.getMonth() + 1 }}.{{
                  availability.startTime.getFullYear()
                }}
              </div>
              <div>
                <span>{{ availability.startTime.getHours() }} - {{ availability.endTime.getHours() }}</span>
                <button
                  class="unstyled-button p-1 ms-1 text-success"
                  (click)="createAppointment(availability)">
                  <i class="fa-solid fa-book-medical"></i>
                </button>
              </div>
            </li>
          }
        }
      </ul>
    </div>
  `,
  styles: `
    .card {
      width: 25rem;
    }
    @media (max-width: 700px) {
      .card {
        width: 18rem;
      }
    }
    ul {
      max-height: 500px;
      overflow-y: auto;
    }
  `,
})
export class AvailabilityListComponent {
  readonly #availabilityService = inject(AvailabilityService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #modalService = inject(NgbModal);
  readonly #appointmentService = inject(AppointmentService);

  showAvailability = model(false);
  doctorId = input.required<number>();
  service = input.required<string>();
  userId = input.required<number>();

  availabilities = derivedAsync(() => {
    this.#appointmentService.notifyForRefetch.listen();
    return this.doctorId() ? this.#getAvailability$(this.doctorId()) : [];
  });

  createAppointment(availability: Availability) {
    const newAppointment: Appointment = {
      doctorId: this.doctorId(),
      patientId: this.userId(),
      service: this.service(),
      startTime: availability.startTime,
      endTime: availability.endTime,
      availabilityId: availability.id,
    };

    console.log(availability.startTime.toISOString());
    console.log(newAppointment);

    const modalRef = this.#modalService.open(ConfirmModalComponent);

    modalRef.componentInstance.title.set('Book appointment?');
    modalRef.componentInstance.content.set(` Are you sure you want to book an appointment for the date
        <strong>${availability.startTime.getDate()}.${availability.startTime.getMonth() + 1}.${availability.startTime.getFullYear()}</strong>
        at
        <strong>${availability.startTime.getHours()}:00</strong>`);

    modalRef.result.then(
      (agreed: boolean) => {
        if (agreed) {
          this.#appointmentService
            .createAppointment(newAppointment)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => this.#appointmentService.notifyForRefetch.notify());
        }
      },
      () => {
        //ignore on dissmis
      }
    );
  }

  #getAvailability$(id: number) {
    return this.#availabilityService.getAvailability(id).pipe(
      tap(console.log),
      map(availability =>
        availability.map((availability: Availability) => ({
          ...availability,
          startTime: new Date(availability.startTime),
          endTime: new Date(availability.endTime),
        }))
      )
    );
  }
}
