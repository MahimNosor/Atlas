import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { RouteInterface } from '../search-form/services/route.interface';

import { DarkModeService } from '../dark-mode/dark-mode.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  isDarkMode: boolean = false;

  constructor(private accountService: AccountService, private router: Router, private darkModeService: DarkModeService) {}
  submitted: boolean = false;
  returnedRoutes: RouteInterface[] = [];

  handleSubmitted(submitted: boolean) {
    this.submitted = submitted;
  }

  handleReturnedRoutes(routes: RouteInterface[]) {
    this.returnedRoutes = routes;
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    // Subscribe to dark mode state changes
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
