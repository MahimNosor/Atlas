import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FOR_YOU_ROUTE } from './for-you-route';
import { ForYouComponent } from './for-you.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([FOR_YOU_ROUTE])],
  declarations: [ForYouComponent],
})
export class ForYouModule {}
