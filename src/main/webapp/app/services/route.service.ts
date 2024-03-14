import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private baseUrl = 'http://localhost:8080/api'; // Adjust this URL to your backend API

  constructor(private http: HttpClient) {}

  createRoute(routeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/routes`, routeData);
  }
}
