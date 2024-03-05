import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'mapDisplay',
          loadChildren: () => import('./map-display/map-display.module').then(m => m.MapDisplayModule),
        },
        {
          path: 'search',
          loadChildren: () => import('./search/search-module').then(m => m.SearchModule),
        },
        {
          path: 'trending',
          loadChildren: () => import('./trending/trending-module').then(m => m.TrendingModule),
        },
        {
          path: 'rating',
          loadChildren: () => import('./rating/rating.module').then(m => m.RatingModule),
        },
        {
          path: 'for-you',
          loadChildren: () => import('./for-you/for-you.module').then(m => m.ForYouModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
