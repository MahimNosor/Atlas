import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { Observable } from 'rxjs';
import { IRoute, NewRoute } from '../../entities/route/route.model';
@Injectable({
  providedIn: 'root',
})
export class MapDisplayService {
  protected resourceURL = this.applicationConfigService.getEndpointFor('api/routes');
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
}
