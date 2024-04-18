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
  private baseUrl = '/api/routes';

  constructor(private httpClient: HttpClient) {}

  /*
  fetchRoutes(city: string, price: number, distance: number): Observable<any> {
    return this.httpClient.get(`/api/routes`);
  }

   */
  fetchRoutesByCity(city: CityInterface, price: number, distance: number, tags: Tag[]): Observable<RouteInterface[]> {
    const url = `${this.baseUrl}/search`; // Assuming there's a search endpoint to filter routes

    // Ensure city is not undefined
    if (!city || !city.id) {
      throw new Error('City object or city id is undefined.');
    }

    // Extract cityId from the city object
    const cityId = city.id;

    // Construct the query parameters
    let params = new HttpParams().set('cityId', cityId.toString()).set('price', price.toString()).set('distance', distance.toString());

    // Extract tagIds from the tags array
    const tagIds = tags.map(tag => tag.id);

    if (tagIds.length > 0) {
      tagIds.forEach(tagId => (params = params.append('tagId', tagId.toString())));
    }

    // Make the HTTP GET request with the constructed URL and query parameters
    return this.httpClient.get<RouteInterface[]>(url, { params });
  }
}
