import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from '../../core/config/application-config.service';
import { IRoute } from '../../entities/route/route.model';
import { IStop } from '../../entities/stop/stop.model';

export type EntityResponseType = HttpResponse<IRoute>;

@Injectable({
  providedIn: 'root',
})
export class MapDisplayService {
  protected routeResourceURL = this.applicationConfigService.getEndpointFor('api/routes');
  protected stopResourceURL = this.applicationConfigService.getEndpointFor('api/stops/by-routeId');
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getAllRoute(): Observable<IRoute[] | null> {
    return this.http.get<IRoute[]>(this.routeResourceURL);
  }

  getStops(routeId: number): Observable<IStop[] | null> {
    return this.http.get<IStop[]>(`${this.stopResourceURL}/${routeId}`);
  }
}
