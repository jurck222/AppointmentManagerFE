import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>DoctorPage works!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorComponent {}
