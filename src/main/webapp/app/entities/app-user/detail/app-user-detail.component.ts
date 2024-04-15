import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../route/service/route.service';
import { IAppUser } from '../app-user.model';

@Component({
  selector: 'jhi-app-user-detail',
  templateUrl: './app-user-detail.component.html',
})
export class AppUserDetailComponent implements OnInit {
  appUser: IAppUser | null = null;
  routes: any[] = [];

  constructor(protected activatedRoute: ActivatedRoute, private routeService: RouteService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.appUser = appUser;
      if (this.appUser) {
        this.routeService.findPreviousRoutesByUserId(this.appUser.id).subscribe(fetchedRoutes => {
          this.routes = fetchedRoutes;
        });
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
