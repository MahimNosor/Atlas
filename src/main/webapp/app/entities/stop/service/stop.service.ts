import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStop, NewStop } from '../stop.model';

export type PartialUpdateStop = Partial<IStop> & Pick<IStop, 'id'>;

export type EntityResponseType = HttpResponse<IStop>;
export type EntityArrayResponseType = HttpResponse<IStop[]>;

@Injectable({ providedIn: 'root' })
export class StopService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stops');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stop: NewStop): Observable<EntityResponseType> {
    return this.http.post<IStop>(this.resourceUrl, stop, { observe: 'response' });
  }

  update(stop: IStop): Observable<EntityResponseType> {
    return this.http.put<IStop>(`${this.resourceUrl}/${this.getStopIdentifier(stop)}`, stop, { observe: 'response' });
  }

  partialUpdate(stop: PartialUpdateStop): Observable<EntityResponseType> {
    return this.http.patch<IStop>(`${this.resourceUrl}/${this.getStopIdentifier(stop)}`, stop, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStop>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStop[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStopIdentifier(stop: Pick<IStop, 'id'>): number {
    return stop.id;
  }

  compareStop(o1: Pick<IStop, 'id'> | null, o2: Pick<IStop, 'id'> | null): boolean {
    return o1 && o2 ? this.getStopIdentifier(o1) === this.getStopIdentifier(o2) : o1 === o2;
  }

  addStopToCollectionIfMissing<Type extends Pick<IStop, 'id'>>(
    stopCollection: Type[],
    ...stopsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stops: Type[] = stopsToCheck.filter(isPresent);
    if (stops.length > 0) {
      const stopCollectionIdentifiers = stopCollection.map(stopItem => this.getStopIdentifier(stopItem)!);
      const stopsToAdd = stops.filter(stopItem => {
        const stopIdentifier = this.getStopIdentifier(stopItem);
        if (stopCollectionIdentifiers.includes(stopIdentifier)) {
          return false;
        }
        stopCollectionIdentifiers.push(stopIdentifier);
        return true;
      });
      return [...stopsToAdd, ...stopCollection];
    }
    return stopCollection;
  }
}
