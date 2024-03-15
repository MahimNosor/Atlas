import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { Observable } from 'rxjs';
import { IRoute, NewRoute } from '../entities/route/route.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  protected resourceURL = this.applicationConfigService.getEndpointFor('api/routes'); // Adjust this URL to your backend API

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  createRoute(routeData: NewRoute): Observable<any> {
    return this.http.post<IRoute>(this.resourceURL, routeData, { observe: 'response' });
  }
}
