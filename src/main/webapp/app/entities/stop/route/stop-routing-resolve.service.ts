import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStop } from '../stop.model';
import { StopService } from '../service/stop.service';

@Injectable({ providedIn: 'root' })
export class StopRoutingResolveService implements Resolve<IStop | null> {
  constructor(protected service: StopService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStop | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stop: HttpResponse<IStop>) => {
          if (stop.body) {
            return of(stop.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
