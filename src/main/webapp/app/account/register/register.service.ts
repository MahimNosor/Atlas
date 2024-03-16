import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';
import { IAppUser, NewAppUser } from '../../entities/app-user/app-user.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }

  linkAppUser(appUser: NewAppUser): Observable<{}> {
    return this.http.post<IAppUser>(this.applicationConfigService.getEndpointFor('api/app-users'), appUser, { observe: 'response' });
  }
}
