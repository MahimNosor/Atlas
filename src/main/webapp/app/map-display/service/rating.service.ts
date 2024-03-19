import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from '../../core/config/application-config.service';
import { IRoute } from '../../entities/route/route.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  protected routeResourceURL = this.applicationConfigService.getEndpointFor('api/routes');
  protected reviewResourceURL = this.applicationConfigService.getEndpointFor('api/reviews');

  constructor(private httpClient: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  updateRouteRating(routeId: number, route: IRoute): Observable<any> {
    return this.httpClient.patch(`${this.routeResourceURL}/${routeId}`, route);
  }
}
