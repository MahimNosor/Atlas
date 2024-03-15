import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';
import { AppUserService } from '../../entities/app-user/service/app-user.service';
import { IAppUser, NewAppUser } from '../../entities/app-user/app-user.model';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { finalize } from 'rxjs/operators';
import { Login } from '../../login/login.model';
import { LoginService } from '../../login/login.service';
import { AuthServerProvider } from '../../core/auth/auth-jwt.service';

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
    protected authServerProvider: AuthServerProvider
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
    const appUser: NewAppUser = { id: null, numRoutes: 0, numReviews: 0 };
    const { login, password } = this.registerForm.getRawValue();
    const credentials: Login = new Login(login, password, true);
    this.loginService.login(credentials);
    this.authServerProvider
      .linkAppUser(appUser)
      .pipe()
      .subscribe({
        next: () => console.log('Success!'),
      });
  }
}
