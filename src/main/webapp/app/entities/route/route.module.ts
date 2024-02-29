import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouteComponent } from './list/route.component';
import { RouteDetailComponent } from './detail/route-detail.component';
import { RouteUpdateComponent } from './update/route-update.component';
import { RouteDeleteDialogComponent } from './delete/route-delete-dialog.component';
import { RouteRoutingModule } from './route/route-routing.module';

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [RouteComponent, RouteDetailComponent, RouteUpdateComponent, RouteDeleteDialogComponent],
})
export class RouteModule {}
