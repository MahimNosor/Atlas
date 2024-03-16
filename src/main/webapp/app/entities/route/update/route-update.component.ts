import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RouteFormService, RouteFormGroup } from './route-form.service';
import { IRoute } from '../route.model';
import { RouteService } from '../service/route.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';
import { ICity } from 'app/entities/city/city.model';
import { CityService } from 'app/entities/city/service/city.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';

@Component({
  selector: 'jhi-route-update',
  templateUrl: './route-update.component.html',
})
export class RouteUpdateComponent implements OnInit {
  isSaving = false;
  route: IRoute | null = null;

  tagsSharedCollection: ITag[] = [];
  citiesSharedCollection: ICity[] = [];
  appUsersSharedCollection: IAppUser[] = [];

  editForm: RouteFormGroup = this.routeFormService.createRouteFormGroup();

  constructor(
    protected routeService: RouteService,
    protected routeFormService: RouteFormService,
    protected tagService: TagService,
    protected cityService: CityService,
    protected appUserService: AppUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  compareCity = (o1: ICity | null, o2: ICity | null): boolean => this.cityService.compareCity(o1, o2);

  compareAppUser = (o1: IAppUser | null, o2: IAppUser | null): boolean => this.appUserService.compareAppUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ route }) => {
      this.route = route;
      if (route) {
        this.updateForm(route);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const route = this.routeFormService.getRoute(this.editForm);
    if (route.id !== null) {
      this.subscribeToSaveResponse(this.routeService.update(route));
    } else {
      this.subscribeToSaveResponse(this.routeService.create(route));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoute>>): void {
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

  protected updateForm(route: IRoute): void {
    this.route = route;
    this.routeFormService.resetForm(this.editForm, route);

    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, ...(route.tags ?? []));
    this.citiesSharedCollection = this.cityService.addCityToCollectionIfMissing<ICity>(this.citiesSharedCollection, route.city);
    this.appUsersSharedCollection = this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(
      this.appUsersSharedCollection,
      route.appUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.route?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));

    this.cityService
      .query()
      .pipe(map((res: HttpResponse<ICity[]>) => res.body ?? []))
      .pipe(map((cities: ICity[]) => this.cityService.addCityToCollectionIfMissing<ICity>(cities, this.route?.city)))
      .subscribe((cities: ICity[]) => (this.citiesSharedCollection = cities));

    this.appUserService
      .query()
      .pipe(map((res: HttpResponse<IAppUser[]>) => res.body ?? []))
      .pipe(map((appUsers: IAppUser[]) => this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(appUsers, this.route?.appUser)))
      .subscribe((appUsers: IAppUser[]) => (this.appUsersSharedCollection = appUsers));
  }
}
