import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StopFormService, StopFormGroup } from './stop-form.service';
import { IStop } from '../stop.model';
import { StopService } from '../service/stop.service';
import { IRoute } from 'app/entities/route/route.model';
import { RouteService } from 'app/entities/route/service/route.service';

@Component({
  selector: 'jhi-stop-update',
  templateUrl: './stop-update.component.html',
})
export class StopUpdateComponent implements OnInit {
  isSaving = false;
  stop: IStop | null = null;

  routesSharedCollection: IRoute[] = [];

  editForm: StopFormGroup = this.stopFormService.createStopFormGroup();

  constructor(
    protected stopService: StopService,
    protected stopFormService: StopFormService,
    protected routeService: RouteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRoute = (o1: IRoute | null, o2: IRoute | null): boolean => this.routeService.compareRoute(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stop }) => {
      this.stop = stop;
      if (stop) {
        this.updateForm(stop);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stop = this.stopFormService.getStop(this.editForm);
    if (stop.id !== null) {
      this.subscribeToSaveResponse(this.stopService.update(stop));
    } else {
      this.subscribeToSaveResponse(this.stopService.create(stop));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStop>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(stop: IStop): void {
    this.stop = stop;
    this.stopFormService.resetForm(this.editForm, stop);

    this.routesSharedCollection = this.routeService.addRouteToCollectionIfMissing<IRoute>(this.routesSharedCollection, stop.city);
  }

  protected loadRelationshipsOptions(): void {
    this.routeService
      .query()
      .pipe(map((res: HttpResponse<IRoute[]>) => res.body ?? []))
      .pipe(map((routes: IRoute[]) => this.routeService.addRouteToCollectionIfMissing<IRoute>(routes, this.stop?.city)))
      .subscribe((routes: IRoute[]) => (this.routesSharedCollection = routes));
  }
}
