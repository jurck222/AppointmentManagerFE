import { Component } from '@angular/core';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-2">
        <h5 class="mb-0">Zasedeni termini</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between">
          <div>{{ test.getDate() }}.{{ test.getMonth() }}.{{ test.getFullYear() }}</div>
          <div>{{ test.getHours() }} - {{ test.getHours() }}</div>
        </li>
        <li class="list-group-item">A second item</li>
        <li class="list-group-item">A third item</li>
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
  test = new Date('2024-06-29T05:00:00');
}
