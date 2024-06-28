import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { AppointmentCardComponent } from '../appointment-card/appointment-card.component';
import { AvailabilityCardComponent } from './availability-card/availability-card.component';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  template: `
    <div class="d-flex flex-column flex-lg-row w-75 ms-auto me-auto justify-content-around  pt-5">
      <app-availability-card
        [id]="id()"
        class="mb-4 mb-lg-0 me-lg-4" />
      <app-appointment-card
        [title]="cardTitle"
        [userId]="id()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, AvailabilityCardComponent, AppointmentCardComponent],
})
export class DoctorComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #destroyRef = inject(DestroyRef);
  id = signal(0);
  cardTitle = 'Taken times';

  ngOnInit(): void {
    this.#userService
      .getId()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(data => this.id.set(data));
  }
}
