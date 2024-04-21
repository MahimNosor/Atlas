import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface TokenPayload {
  sub: string; // Assuming 'sub' contains the username. Adjust as needed based on your token's structure.
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false; // Track user's login status
  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('jhi-authenticationToken') || sessionStorage.getItem('jhi-authenticationToken');
  }

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
}
