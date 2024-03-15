import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TagFormService } from './tag-form.service';
import { TagService } from '../service/tag.service';
import { ITag } from '../tag.model';
import { IRoute } from 'app/entities/route/route.model';
import { RouteService } from 'app/entities/route/service/route.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';

import { TagUpdateComponent } from './tag-update.component';

describe('Tag Management Update Component', () => {
  let comp: TagUpdateComponent;
  let fixture: ComponentFixture<TagUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tagFormService: TagFormService;
  let tagService: TagService;
  let routeService: RouteService;
  let appUserService: AppUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TagUpdateComponent],
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
      .overrideTemplate(TagUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TagUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tagFormService = TestBed.inject(TagFormService);
    tagService = TestBed.inject(TagService);
    routeService = TestBed.inject(RouteService);
    appUserService = TestBed.inject(AppUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Route query and add missing value', () => {
      const tag: ITag = { id: 456 };
      const routes: IRoute[] = [{ id: 8867 }];
      tag.routes = routes;

      const routeCollection: IRoute[] = [{ id: 82530 }];
      jest.spyOn(routeService, 'query').mockReturnValue(of(new HttpResponse({ body: routeCollection })));
      const additionalRoutes = [...routes];
      const expectedCollection: IRoute[] = [...additionalRoutes, ...routeCollection];
      jest.spyOn(routeService, 'addRouteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(routeService.query).toHaveBeenCalled();
      expect(routeService.addRouteToCollectionIfMissing).toHaveBeenCalledWith(
        routeCollection,
        ...additionalRoutes.map(expect.objectContaining)
      );
      expect(comp.routesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AppUser query and add missing value', () => {
      const tag: ITag = { id: 456 };
      const appUsers: IAppUser[] = [{ id: 99911 }];
      tag.appUsers = appUsers;

      const appUserCollection: IAppUser[] = [{ id: 58346 }];
      jest.spyOn(appUserService, 'query').mockReturnValue(of(new HttpResponse({ body: appUserCollection })));
      const additionalAppUsers = [...appUsers];
      const expectedCollection: IAppUser[] = [...additionalAppUsers, ...appUserCollection];
      jest.spyOn(appUserService, 'addAppUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(appUserService.query).toHaveBeenCalled();
      expect(appUserService.addAppUserToCollectionIfMissing).toHaveBeenCalledWith(
        appUserCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tag: ITag = { id: 456 };
      const route: IRoute = { id: 93830 };
      tag.routes = [route];
      const appUser: IAppUser = { id: 77125 };
      tag.appUsers = [appUser];

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(comp.routesSharedCollection).toContain(route);
      expect(comp.appUsersSharedCollection).toContain(appUser);
      expect(comp.tag).toEqual(tag);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagFormService, 'getTag').mockReturnValue(tag);
      jest.spyOn(tagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tag }));
      saveSubject.complete();

      // THEN
      expect(tagFormService.getTag).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tagService.update).toHaveBeenCalledWith(expect.objectContaining(tag));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagFormService, 'getTag').mockReturnValue({ id: null });
      jest.spyOn(tagService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tag }));
      saveSubject.complete();

      // THEN
      expect(tagFormService.getTag).toHaveBeenCalled();
      expect(tagService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tagService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRoute', () => {
      it('Should forward to routeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(routeService, 'compareRoute');
        comp.compareRoute(entity, entity2);
        expect(routeService.compareRoute).toHaveBeenCalledWith(entity, entity2);
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
