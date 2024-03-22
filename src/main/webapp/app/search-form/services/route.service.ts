import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouteInterface } from './route.interface';
import { CityInterface } from './city.interface';
import { Tag } from './tag.interface';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private baseUrl = 'http://localhost:8080/api/routes';

  constructor(private httpClient: HttpClient) {}

  fetchRoutes(city: string, price: number, distance: number): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/api/routes`);
  }
  fetchRoutesByCity(city: CityInterface, price: number, distance: number, tags: Tag[]): Observable<RouteInterface[]> {
    const url = `${this.baseUrl}/search`; // Assuming there's a search endpoint to filter routes

    // Construct the query parameters
    let params = new HttpParams().set('cityId', city.id.toString()).set('price', price.toString()).set('distance', distance.toString());

    tags.forEach(tag => (params = params.append('tagId', tag.id.toString())));

    // Make the HTTP GET request with the constructed URL and query parameters
    return this.httpClient.get<RouteInterface[]>(url, { params });
  }
}
