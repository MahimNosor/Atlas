import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CityInterface } from './city.interface';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private baseUrl = '/api/cities'; // Adjust the URL to your backend API

  constructor(private http: HttpClient) {}

  fetchAllCities(): Observable<CityInterface[]> {
    return this.http.get<CityInterface[]>(this.baseUrl);
  }
}
