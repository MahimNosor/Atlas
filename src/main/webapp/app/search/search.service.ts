import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Login } from '../login/login.model';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  doSearch(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.applicationConfigService.getEndpointFor('api/app-users/by-login')}?login=${query}`);
  }

  //search(
}
