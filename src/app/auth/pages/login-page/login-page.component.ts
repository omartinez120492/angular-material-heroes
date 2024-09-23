import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  //TODO: Es cuando el usuario da click en el boton de login,
  onLogin(): void {
    console.log('onLogin');
    this.authService.login('john.due@gmail.com', '123456')
      .subscribe(user => {
        console.log({ user });
        this.router.navigate(['/'])
      })
  }

}
