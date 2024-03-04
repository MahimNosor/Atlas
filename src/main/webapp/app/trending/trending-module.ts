import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SEARCH_ROUTE } from './trending-route';
import { TrendingComponent } from './trending.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([SEARCH_ROUTE])],
  declarations: [TrendingComponent],
})
export class TrendingModule {}
