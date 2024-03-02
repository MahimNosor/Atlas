import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SEARCH_ROUTE } from './search-route';
import { SearchComponent } from './search.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([SEARCH_ROUTE])],
  declarations: [SearchComponent],
})
export class SearchModule {}
