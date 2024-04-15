import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from '../../core/config/application-config.service';
import { IRoute } from '../../entities/route/route.model';
import { IStop } from '../../entities/stop/stop.model';
import { IReview, NewReview } from '../../entities/review/review.model';

@Injectable({
  providedIn: 'root',
})
export class MapDisplayService {
  protected routeResourceURL = this.applicationConfigService.getEndpointFor('api/routes');
  protected stopResourceURL = this.applicationConfigService.getEndpointFor('api/stops/by-routeId');
  protected reviewResourceURL = this.applicationConfigService.getEndpointFor('api/reviews');
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getAllRoutes(): Observable<IRoute[] | null> {
    return this.http.get<IRoute[]>(this.routeResourceURL);
  }

  getRoute(routeId: number): Observable<IRoute | null> {
    return this.http.get<IRoute>(`${this.routeResourceURL}/${routeId}`);
  }

  getStops(routeId: number): Observable<IStop[] | null> {
    return this.http.get<IStop[]>(`${this.stopResourceURL}/${routeId}`);
  }

  updateRouteRating(routeId: number, route: IRoute): Observable<any> {
    return this.http.patch(`${this.routeResourceURL}/${routeId}`, route);
  }

  postReview(review: NewReview): Observable<NewReview> {
    return this.http.post<NewReview>(this.reviewResourceURL, review);
  }

  checkExistingReview(appUserId: number, routeId: number): Observable<IReview> {
    return this.http.get<IReview>(`${this.reviewResourceURL}/${appUserId}/${routeId}`);
  }
}
