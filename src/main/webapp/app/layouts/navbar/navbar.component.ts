// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { DarkModeService } from 'app/dark-mode/dark-mode.service'; // Update with correct path
import { faMoon, faA } from '@fortawesome/free-solid-svg-icons';
import { FontSizeService } from '../../font-size/font-size.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  isDarkMode: boolean = false;
  moonIcon = faMoon;
  a = faA;
  fontSize: string = 'regular';

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private darkModeService: DarkModeService, // Inject DarkModeService
    private fontSizeService: FontSizeService
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    // Subscribe to dark mode state changes
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
      this.updateTheme();
    });
    this.fontSizeService.fontSize$.subscribe(size => {
      this.fontSize = size;
      this.updateFontSize();
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleDarkMode(): void {
    // Toggle dark mode through the DarkModeService
    this.darkModeService.toggleDarkMode();
  }

  updateTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  updateFontSize(): void {
    document.body.className = ''; // Reset all classes
    document.body.classList.add(this.fontSize);
  }

  setFontSize(size: string): void {
    this.fontSizeService.setFontSize(size);
  }
}
