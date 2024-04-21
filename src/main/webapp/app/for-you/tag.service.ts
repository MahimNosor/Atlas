import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = 'http://localhost:8080/api'; // Update with your API URL
  private baseUrl = 'api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTagIdsForRoute(routeId: number): Observable<any[]> {
    const token = this.authService.getToken(); // Assuming you have a method in AuthService to retrieve the token
    // Use the token in your HTTP request headers or query parameters as needed
    // Your logic to fetch tag IDs for the specified route ID goes here
    return this.http.get<any[]>(`${this.baseUrl}/routes/${routeId}/tags`, { headers: { Authorization: `Bearer ${token}` } });
  }

  getTagNames(tagIds: number[]): Observable<string[]> {
    // Include authorization token in the request headers
    const token = this.authService.getToken(); // Assuming you have a method in AuthService to retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `${this.apiUrl}/tags`;

    // Send the request with the token included in the headers
    return this.http.post<string[]>(url, tagIds, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching tag names:', error);
        return throwError(error); // Throw the error to be handled by the caller
      })
    );
  }
}
