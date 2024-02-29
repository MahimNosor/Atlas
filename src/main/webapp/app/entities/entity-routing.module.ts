import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'app-user',
        data: { pageTitle: 'AppUsers' },
        loadChildren: () => import('./app-user/app-user.module').then(m => m.AppUserModule),
      },
      {
        path: 'route',
        data: { pageTitle: 'Routes' },
        loadChildren: () => import('./route/route.module').then(m => m.RouteModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'Tags' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'city',
        data: { pageTitle: 'Cities' },
        loadChildren: () => import('./city/city.module').then(m => m.CityModule),
      },
      {
        path: 'stop',
        data: { pageTitle: 'Stops' },
        loadChildren: () => import('./stop/stop.module').then(m => m.StopModule),
      },
      {
        path: 'review',
        data: { pageTitle: 'Reviews' },
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
