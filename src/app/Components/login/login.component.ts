import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxControlError } from 'ngxtension/control-error';
import { catchError, EMPTY } from 'rxjs';
import { LoginParams } from '../../Models/AuthModels';
import { AuthenticateService } from '../../Services/authenticate.service';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxControlError],
  template: `
    <div class="login-wrapper mt-5 ms-auto me-auto">
      <div class="card">
        <div class="card-body">
          <div
            class="form-signin"
            [formGroup]="loginForm">
            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>

            <label
              for="inputUsername"
              class="sr-only">
              Login
            </label>
            <input
              type="text"
              id="inputUsername"
              class="form-control"
              name="login"
              placeholder="Login"
              formControlName="email"
              required />

            <label
              for="inputPassword"
              class="sr-only">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              class="form-control mb-3"
              name="password"
              placeholder="Password"
              autocomplete="on"
              formControlName="password"
              required />
            @if (showError()) {
              <div
                id="errorMessage"
                class="mb-2">
                <span
                  id="errorSpan"
                  class="text-danger">
                  Username or password is invalid.
                </span>
              </div>
            }
            <button
              class="btn btn-lg btn-primary btn-block"
              (click)="submit()">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .login-wrapper {
      width: 20rem;
    }

    input {
      margin-bottom: 2rem;
    }

    button {
      margin-bottom: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #loginService = inject(LoginService);
  readonly #authService = inject(AuthenticateService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);

  loginForm!: FormGroup;
  showError = signal(false);

  ngOnInit(): void {
    this.#initForm();
  }

  submit() {
    if (this.loginForm.valid) {
      const data: LoginParams = {
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value,
      };

      this.#authService
        .login(data)
        .pipe(
          catchError(() => {
            this.showError.set(true);
            return EMPTY;
          }),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe(data => {
          this.#loginService.setToken(data.token);
          this.#loginService.setRole(data.role);
          this.#onLoginSuccess(data.role);
        });
    } else {
      this.showError.set(true);
    }
  }

  #initForm() {
    this.loginForm = this.#fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  #onLoginSuccess(role: string) {
    if (role === 'DOCTOR') {
      this.#router.navigate(['/', 'doctor']);
      this.#loginService.loginSubject.next();
    }
    if (role === 'PATIENT') {
      this.#router.navigate(['/', 'patient']);
      this.#loginService.loginSubject.next();
    }
  }
}
