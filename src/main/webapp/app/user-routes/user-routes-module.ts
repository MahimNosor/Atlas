import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { USER_ROUTES_ROUTE } from './user-routes-route';
import { UserRoutesComponent } from './user-routes.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([USER_ROUTES_ROUTE])],
  declarations: [UserRoutesComponent],
})
export class UserRoutesModule {}
