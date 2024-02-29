import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StopComponent } from '../list/stop.component';
import { StopDetailComponent } from '../detail/stop-detail.component';
import { StopUpdateComponent } from '../update/stop-update.component';
import { StopRoutingResolveService } from './stop-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const stopRoute: Routes = [
  {
    path: '',
    component: StopComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StopDetailComponent,
    resolve: {
      stop: StopRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StopUpdateComponent,
    resolve: {
      stop: StopRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StopUpdateComponent,
    resolve: {
      stop: StopRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stopRoute)],
  exports: [RouterModule],
})
export class StopRoutingModule {}
