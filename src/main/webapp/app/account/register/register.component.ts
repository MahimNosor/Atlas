import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';
import { AppUserService } from '../../entities/app-user/service/app-user.service';
import { IAppUser, NewAppUser } from '../../entities/app-user/app-user.model';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { Login } from '../../login/login.model';
import { LoginService } from '../../login/login.service';
import { AuthServerProvider } from '../../core/auth/auth-jwt.service';
import { Router } from '@angular/router';
import { UserService } from '../../entities/user/user.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  constructor(
    private registerService: RegisterService,
    private appUserService: AppUserService,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected loginService: LoginService,
    protected authServerProvider: AuthServerProvider,
    protected router: Router,
    protected userService: UserService
  ) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      const { login, email } = this.registerForm.getRawValue();
      this.registerService
        .save({ login, email, password, langKey: 'en' })
        .subscribe({ next: () => this.registerSuccess(), error: response => this.processError(response) });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }

  registerSuccess(): void {
    this.success = true;
    var { login, password } = this.registerForm.getRawValue();
    login = login.toLowerCase();
    const credentials: Login = new Login(login, password, true);
    this.loginService.login(credentials).subscribe({
      next: () => {
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        }
        this.userService.getUserByLogin(login).subscribe(user => {
          if (user) {
            const userId: number = user.id;
            console.log('User ID: ', userId);
            const appUser: NewAppUser = { id: null, numRoutes: 0, numReviews: 0, user: { id: userId, login: login } };
            this.registerService
              .linkAppUser(appUser)
              .pipe()
              .subscribe({
                next: () => console.log('Success!'),
              });
          }
          console.log('This works');
        });
      },
      error: () => console.log(':('),
    });
  }
}
