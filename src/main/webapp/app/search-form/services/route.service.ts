import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from './route.interface';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private baseUrl = 'http://localhost:9000/api/routes';

  constructor(private httpClient: HttpClient) {}

  fetchRoutes(city: string, price: number, distance: number): Observable<any> {
    return this.httpClient.get(`http://localhost:9000/api/routes?city=${city}&cost=${price}&distance=${distance}`);
  }
  fetchRoutesByCity(city: string): Observable<Route[]> {
    const url = `${this.baseUrl}?city=${city}`;
    return this.httpClient.get<Route[]>(url);
  }
}
