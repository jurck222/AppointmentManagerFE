import { Component, DestroyRef, HostListener, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { createNotifier } from 'ngxtension/create-notifier';
import { derivedAsync } from 'ngxtension/derived-async';
import { map } from 'rxjs';
import { Availability } from '../../../Models/AvailabilityModels';
import { AvailabilityService } from '../../../Services/availability.service';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { AddAvailabilityComponent } from '../add-availability/add-availability.component';

@Component({
  selector: 'app-availability-card',
  standalone: true,
  imports: [NgbCollapseModule],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-2">
        <button
          type="button"
          class="btn btn-outline-secondary"
          (click)="collapse.toggle()"
          [attr.aria-expanded]="!isCollapsed"
          aria-controls="collapseExample">
          @if (!isCollapsed()) {
            <i class="fa-solid fa-angle-up"></i>
          } @else {
            <i class="fa-solid fa-angle-down"></i>
          }
        </button>
        <h5 class="mb-0">Prosti termini</h5>
        <button
          class="unstyled-button"
          (click)="openAddModal()"
          style="font-size: 25px;">
          <i class="fa-solid fa-circle-plus"></i>
        </button>
      </div>
      <ul
        #collapse="ngbCollapse"
        [(ngbCollapse)]="isCollapsed"
        class="list-group list-group-flush">
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
                class="unstyled-button p-1 ms-1 text-danger"
                (click)="deleteAvailability(availability.id)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
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

    ul {
      max-height: 500px;
      overflow-y: auto;
    }
  `,
})
export class AvailabilityCardComponent {
  readonly #modalService = inject(NgbModal);
  readonly #destroyRef = inject(DestroyRef);
  readonly #availabilityService = inject(AvailabilityService);

  id = input.required<number>();
  isCollapsed = signal(window.innerWidth < 700);
  refetchNotifier = createNotifier();

  availabilities = derivedAsync(() => {
    this.refetchNotifier.listen();
    return this.id() ? this.#fetchAvailability(this.id()) : [];
  });

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isCollapsed.set(window.innerWidth < 700);
  }

  openAddModal() {
    const modalRef = this.#modalService.open(AddAvailabilityComponent);
    modalRef.result.then(
      timeWindow => {
        if (timeWindow) {
          this.#availabilityService
            .createAvailability(this.id(), timeWindow)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
              this.refetchNotifier.notify();
            });
        }
      },
      () => {
        //ignore on dissmis
      }
    );
  }

  deleteAvailability(id: number) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);

    modalRef.componentInstance.title.set('Confirm deletion?');
    modalRef.componentInstance.content.set('Are you sure you want to remove this availability window?');

    modalRef.result.then(
      closed => {
        if (closed) {
          this.#availabilityService
            .deleteAvailability(id)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
              next: () => {
                this.refetchNotifier.notify();
              },
            });
        }
      },
      () => {
        //ignore on dissmis
      }
    );
  }

  #fetchAvailability(id: number) {
    return this.#availabilityService.getAvailability(id).pipe(
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
