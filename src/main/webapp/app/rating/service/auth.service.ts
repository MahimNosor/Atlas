import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IAppUser } from 'app/entities/app-user/app-user.model'; // Adjust the path as needed

interface TokenPayload {
  sub: string; // Assuming 'sub' contains the username. Adjust as needed based on your token's structure.
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false; // Track user's login status
  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getCurrentUserId(): string | null {
    let token = localStorage.getItem('jhi-authenticationToken') || sessionStorage.getItem('jhi-authenticationToken');
    if (!token) {
      return null;
    }
    token = token.replace(/^"(.*)"$/, '$1');
    try {
      const decodedToken: TokenPayload = jwtDecode.jwtDecode<TokenPayload>(token);
      return decodedToken.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getAppUserIdByUsername(username: string): Observable<number | null> {
    return this.http.get<IAppUser>(`/api/app-users/by-username/${username}`).pipe(
      map(appUser => (appUser.id ? appUser.id : null)), // Adjusted to handle possible null
      catchError(error => {
        console.error('Error fetching AppUser by username', error);
        return of(null); // Correctly return Observable of null on error
      })
    );
  }
}
