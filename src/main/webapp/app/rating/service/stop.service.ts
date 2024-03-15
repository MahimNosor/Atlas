import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { Observable } from 'rxjs';
import { IStop, NewStop } from '../../entities/stop/stop.model';

@Injectable({
  providedIn: 'root',
})
export class StopService {
  protected resourceURL = this.applicationConfigService.getEndpointFor('api/stops'); // Adjust this URL to your backend API

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  createStop(stopData: NewStop): Observable<any> {
    return this.http.post<IStop>(this.resourceURL, stopData, { observe: 'response' });
  }
}
