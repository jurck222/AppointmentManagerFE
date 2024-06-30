import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { derivedAsync } from 'ngxtension/derived-async';
import { map } from 'rxjs';
import { Appointment } from '../../Models/AppointmentModels';
import { AppointmentService } from '../../Services/appointment.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-2">
        <h5 class="mb-0">{{ title() }}</h5>
      </div>
      <ul class="list-group list-group-flush">
        @if (appointments()?.length) {
          @for (appointment of appointments(); track appointment.id) {
            <li class="list-group-item d-flex justify-content-between">
              <div>
                {{ appointment.startTime.getDate() }}.{{ appointment.startTime.getMonth() + 1 }}.{{
                  appointment.startTime.getFullYear()
                }}
              </div>
              <div>
                {{ appointment.startTime.getHours() + 2 }} - {{ appointment.endTime.getHours() + 2 }}
                <button
                  class="unstyled-button p-1 ms-1 text-danger"
                  (click)="deleteAppointment(appointment)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </li>
          }
        } @else {
          <li class="list-group-item text-center text-secondary">No appointments found.</li>
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
  `,
})
export class AppointmentCardComponent {
  readonly #appointmentService = inject(AppointmentService);
  readonly #modalService = inject(NgbModal);
  readonly #destroyRef = inject(DestroyRef);

  title = input.required<string>();
  userId = input.required<number>();

  appointments = derivedAsync(() => {
    this.#appointmentService.notifyForRefetch.listen();
    return this.userId() ? this.#getAppointments(this.userId()) : [];
  });

  deleteAppointment(appointment: Appointment) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title.set('Confirm deletion?');
    modalRef.componentInstance.content.set('Are you sure you want to remove this appointment?');
    modalRef.result.then(
      closed => {
        if (closed) {
          this.#appointmentService
            .deleteAppointment(appointment.id ?? 0)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
              next: () => {
                this.#appointmentService.notifyForRefetch.notify();
              },
            });
        }
      },
      () => {
        //ignore on dissmis
      }
    );
  }

  #getAppointments(id: number) {
    return this.#appointmentService.getAppointments(id)?.pipe(
      map(appointment =>
        appointment.map((appointment: Appointment) => ({
          ...appointment,
          startTime: new Date(appointment.startTime),
          endTime: new Date(appointment.endTime),
        }))
      )
    );
  }
}
