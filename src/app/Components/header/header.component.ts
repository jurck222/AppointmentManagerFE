import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbNavModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  readonly #loginService = inject(LoginService);
  readonly #router = inject(Router);
  isLoggedIn = signal(false);

  ngOnInit() {
    if (this.#loginService.getToken() && this.#loginService.getRole()) {
      this.isLoggedIn.set(true);
    }
    this.#loginService.loginSubject.subscribe(() => this.isLoggedIn.set(true));
  }

  logout() {
    this.#loginService.removeToken();
    this.#loginService.removeRole();
    this.isLoggedIn.set(false);
    this.#router.navigate(['/', 'login']);
  }
}
