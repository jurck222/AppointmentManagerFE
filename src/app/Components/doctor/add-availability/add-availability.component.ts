import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimeWindow } from '../../../Models/AvailabilityModels';
import { formatDate, formatTime } from '../../../utils/utils';

@Component({
  selector: 'app-add-availability',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule],
  template: `
    <div class="modal-header">
      <h4
        class="modal-title"
        id="modal-basic-title">
        Add availability
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="modal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <div class="row row-cols-sm-auto justify-content-center">
        <div class="col-12">
          <div class="input-group">
            <input
              class="form-control"
              placeholder="yyyy-mm-dd"
              name="dp"
              [(ngModel)]="date"
              ngbDatepicker
              #d="ngbDatepicker" />
            <button
              class="btn btn-outline-secondary"
              (click)="d.toggle()"
              type="button">
              <i class="fa-solid fa-calendar-days"></i>
            </button>
          </div>
          <div class="d-flex align-items-center justify-content-center mb-2 mt-2">
            <label
              for="startTimeInput"
              class="me-2">
              Start time:
            </label>
            <input
              id="startTimeInput"
              class="form-control w-25"
              placeholder="0"
              type="number"
              [(ngModel)]="startTime" />
          </div>
          <div class="d-flex align-items-center justify-content-center">
            <label
              for="endTimeInput"
              class="me-2">
              End time:
            </label>
            <input
              id="endTimeInput"
              class="form-control w-25"
              placeholder="0"
              type="number"
              [(ngModel)]="endTime" />
          </div>
        </div>
        @if (errorMessage()) {
          <span class="text-danger">{{ errorMessage() }}</span>
        }
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="add()">
        Save
      </button>
    </div>
  `,
  styles: ``,
})
export class AddAvailabilityComponent {
  modal = inject(NgbActiveModal);
  date!: NgbDateStruct;
  startTime = 0;
  endTime = 0;
  errorMessage = signal('');

  add() {
    if (this.startTime <= 24 && this.startTime >= 0 && this.endTime <= 24 && this.endTime >= 0) {
      if (this.date) {
        const timeWindow: TimeWindow = {
          startTime: `${this.date.year}-${formatDate(this.date.month)}-${formatDate(this.date.day)}T${formatTime(this.startTime)}`,
          endTime: `${this.date.year}-${formatDate(this.date.month)}-${formatDate(this.date.day)}T${formatTime(this.endTime)}`,
        };
        this.modal.close(timeWindow);
      } else {
        this.errorMessage.set('Choose a date');
      }
    } else {
      this.errorMessage.set('The times can only be between 0 and 24');
    }
  }
}
