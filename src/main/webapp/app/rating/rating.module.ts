import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RATING_ROUTE } from './rating-route';
import { RatingComponent } from './rating.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([RATING_ROUTE])],
  declarations: [RatingComponent],
})
export class RatingModule {}
