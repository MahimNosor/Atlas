import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';

import { CarouselComponent } from '../carousel/carousel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFormComponent } from '../search-form/search-form.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), FormsModule, ReactiveFormsModule],
  declarations: [HomeComponent, CarouselComponent, SearchFormComponent],
})
export class HomeModule {}
