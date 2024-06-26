import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, tap } from 'rxjs';
import { Availability } from '../../../Models/AvailabilityModels';
import { AvailabilityService } from '../../../Services/availability.service';
import { AddAvailabilityComponent } from '../add-availability/add-availability.component';

@Component({
  selector: 'app-availability-card',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-2">
        <h5 class="mb-0">Prosti termini</h5>
        <button
          class="unstyled-button"
          (click)="openAddModal()"
          style="font-size: 25px;">
          <i class="fa-solid fa-circle-plus"></i>
        </button>
      </div>
      <ul
        class="list-group list-group-flush"
        style="max-height: 300px; overflow-y: auto;">
        @for (availability of availabilities(); track availability.id) {
          <li class="list-group-item d-flex justify-content-between">
            <div>
              {{ availability.startTime.getDay() }}.{{ availability.startTime.getMonth() }}.{{
                availability.startTime.getFullYear()
              }}
            </div>
            <div>{{ availability.startTime.getHours() }} - {{ availability.endTime.getHours() }}</div>
          </li>
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
export class AvailabilityCardComponent {
  readonly #modalService = inject(NgbModal);
  readonly #destroyRef = inject(DestroyRef);
  readonly #availabilityService = inject(AvailabilityService);
  id = input.required<number>();

  availabilities = derivedAsync(() => (this.id() ? this.#fetchAvailability(this.id()) : []));
  openAddModal() {
    const modalRef = this.#modalService.open(AddAvailabilityComponent);
    modalRef.result.then(timeWindow => {
      if (timeWindow) {
        console.log('here');
        this.#availabilityService
          .createAvailability(this.id(), timeWindow)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(response => {
            console.log('POST request successful:', response);
          });
      }
    });
  }

  #fetchAvailability(id: number) {
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
