import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  id: number;
  title: string;
  description: string;
  rating: number;
  distance: number;
  cost: number;
  numReviews: number;
  stops: any[]; // adjust types as necessary
  reviews: any[]; // adjust types as necessary
  tags: { id: number; name: string }[]; // adjust types as necessary
  // add more properties if needed
}

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private baseUrl = 'api'; // Adjust this URL based on your backend API endpoint

  constructor(private http: HttpClient) {}

  getRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/routes`);
  }

  getRoute(routeId: number): Observable<Route> {
    return this.http.get<Route>(`${this.baseUrl}/routes/${routeId}`);
  }

  getTagsForRoute(routeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/routes/${routeId}/tags`);
  }
}
