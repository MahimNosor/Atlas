import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RouteFormService } from './route-form.service';
import { RouteService } from '../service/route.service';
import { IRoute } from '../route.model';
import { ICity } from 'app/entities/city/city.model';
import { CityService } from 'app/entities/city/service/city.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';

import { RouteUpdateComponent } from './route-update.component';

describe('Route Management Update Component', () => {
  let comp: RouteUpdateComponent;
  let fixture: ComponentFixture<RouteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let routeFormService: RouteFormService;
  let routeService: RouteService;
  let cityService: CityService;
  let appUserService: AppUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RouteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RouteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RouteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeFormService = TestBed.inject(RouteFormService);
    routeService = TestBed.inject(RouteService);
    cityService = TestBed.inject(CityService);
    appUserService = TestBed.inject(AppUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call City query and add missing value', () => {
      const route: IRoute = { id: 456 };
      const city: ICity = { id: 52946 };
      route.city = city;

      const cityCollection: ICity[] = [{ id: 15360 }];
      jest.spyOn(cityService, 'query').mockReturnValue(of(new HttpResponse({ body: cityCollection })));
      const additionalCities = [city];
      const expectedCollection: ICity[] = [...additionalCities, ...cityCollection];
      jest.spyOn(cityService, 'addCityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ route });
      comp.ngOnInit();

      expect(cityService.query).toHaveBeenCalled();
      expect(cityService.addCityToCollectionIfMissing).toHaveBeenCalledWith(
        cityCollection,
        ...additionalCities.map(expect.objectContaining)
      );
      expect(comp.citiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AppUser query and add missing value', () => {
      const route: IRoute = { id: 456 };
      const appUser: IAppUser = { id: 25039 };
      route.appUser = appUser;

      const appUserCollection: IAppUser[] = [{ id: 86965 }];
      jest.spyOn(appUserService, 'query').mockReturnValue(of(new HttpResponse({ body: appUserCollection })));
      const additionalAppUsers = [appUser];
      const expectedCollection: IAppUser[] = [...additionalAppUsers, ...appUserCollection];
      jest.spyOn(appUserService, 'addAppUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ route });
      comp.ngOnInit();

      expect(appUserService.query).toHaveBeenCalled();
      expect(appUserService.addAppUserToCollectionIfMissing).toHaveBeenCalledWith(
        appUserCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const route: IRoute = { id: 456 };
      const city: ICity = { id: 99140 };
      route.city = city;
      const appUser: IAppUser = { id: 43122 };
      route.appUser = appUser;

      activatedRoute.data = of({ route });
      comp.ngOnInit();

      expect(comp.citiesSharedCollection).toContain(city);
      expect(comp.appUsersSharedCollection).toContain(appUser);
      expect(comp.route).toEqual(route);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoute>>();
      const route = { id: 123 };
      jest.spyOn(routeFormService, 'getRoute').mockReturnValue(route);
      jest.spyOn(routeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ route });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: route }));
      saveSubject.complete();

      // THEN
      expect(routeFormService.getRoute).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(routeService.update).toHaveBeenCalledWith(expect.objectContaining(route));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoute>>();
      const route = { id: 123 };
      jest.spyOn(routeFormService, 'getRoute').mockReturnValue({ id: null });
      jest.spyOn(routeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ route: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: route }));
      saveSubject.complete();

      // THEN
      expect(routeFormService.getRoute).toHaveBeenCalled();
      expect(routeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoute>>();
      const route = { id: 123 };
      jest.spyOn(routeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ route });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(routeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCity', () => {
      it('Should forward to cityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cityService, 'compareCity');
        comp.compareCity(entity, entity2);
        expect(cityService.compareCity).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAppUser', () => {
      it('Should forward to appUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appUserService, 'compareAppUser');
        comp.compareAppUser(entity, entity2);
        expect(appUserService.compareAppUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
