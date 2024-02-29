import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouteComponent } from '../list/route.component';
import { RouteDetailComponent } from '../detail/route-detail.component';
import { RouteUpdateComponent } from '../update/route-update.component';
import { RouteRoutingResolveService } from './route-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const routeRoute: Routes = [
  {
    path: '',
    component: RouteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RouteDetailComponent,
    resolve: {
      route: RouteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RouteUpdateComponent,
    resolve: {
      route: RouteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RouteUpdateComponent,
    resolve: {
      route: RouteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routeRoute)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
