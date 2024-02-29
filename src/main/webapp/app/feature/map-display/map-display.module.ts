import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MAP_DISPLAY_ROUTE } from './map-display-route';
import { MapDisplayComponent } from './map-display.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([MAP_DISPLAY_ROUTE])],
  declarations: [MapDisplayComponent],
})
export class MapDisplayModule {}
