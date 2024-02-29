import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StopComponent } from './list/stop.component';
import { StopDetailComponent } from './detail/stop-detail.component';
import { StopUpdateComponent } from './update/stop-update.component';
import { StopDeleteDialogComponent } from './delete/stop-delete-dialog.component';
import { StopRoutingModule } from './route/stop-routing.module';

@NgModule({
  imports: [SharedModule, StopRoutingModule],
  declarations: [StopComponent, StopDetailComponent, StopUpdateComponent, StopDeleteDialogComponent],
})
export class StopModule {}
