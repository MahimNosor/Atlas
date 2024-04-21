import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from '../config/authority.constants';

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
        data: { pageTitle: 'Tags', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'city',
        data: { pageTitle: 'Cities', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./city/city.module').then(m => m.CityModule),
      },
      {
        path: 'stop',
        data: { pageTitle: 'Stops', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./stop/stop.module').then(m => m.StopModule),
      },
      {
        path: 'review',
        data: { pageTitle: 'Reviews', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
