import { Component, inject, input, output } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { UserService } from '../../../../Services/user.service';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-2">
        <h5 class="mb-0">Doctors</h5>
      </div>
      <ul class="list-group list-group-flush">
        @if (!doctors()?.length) {
          <li class="list-group-item text-center text-secondary">No doctors found.</li>
        } @else {
          @for (doctor of doctors(); track doctor.doctorId) {
            <li class="list-group-item text-center text-secondary">
              <button
                class="unstyled-button"
                (click)="selectDoctor(doctor.doctorId)">
                {{ doctor.firstname }} {{ doctor.lastname }}
              </button>
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
export class DoctorsListComponent {
  readonly #userService = inject(UserService);

  service = input.required<string>();
  selectedDoctorE = output<number>();

  doctors = derivedAsync(() => (this.service() ? this.#fetchDoctors(this.service()) : []));

  selectDoctor(id: number) {
    this.selectedDoctorE.emit(id);
  }
  #fetchDoctors(service: string) {
    if (service === 'Select a service') {
      return [];
    }
    return this.#userService.getDoctors(service);
  }
}
