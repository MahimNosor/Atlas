import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../route/service/route.service';
import { IAppUser } from '../app-user.model';
import { DarkModeService } from '../../../dark-mode/dark-mode.service';

@Component({
  selector: 'jhi-app-user-detail',
  templateUrl: './app-user-detail.component.html',
})
export class AppUserDetailComponent implements OnInit {
  appUser: IAppUser | null = null;
  routes: any[] = [];
  isDarkMode: boolean = false;

  constructor(protected activatedRoute: ActivatedRoute, private routeService: RouteService, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.appUser = appUser;
      if (this.appUser) {
        this.routeService.findPreviousRoutesByUserId(this.appUser.id).subscribe(fetchedRoutes => {
          this.routes = fetchedRoutes;
        });
      }
    });

    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
