import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StopFormService } from './stop-form.service';
import { StopService } from '../service/stop.service';
import { IStop } from '../stop.model';
import { IRoute } from 'app/entities/route/route.model';
import { RouteService } from 'app/entities/route/service/route.service';

import { StopUpdateComponent } from './stop-update.component';

describe('Stop Management Update Component', () => {
  let comp: StopUpdateComponent;
  let fixture: ComponentFixture<StopUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stopFormService: StopFormService;
  let stopService: StopService;
  let routeService: RouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StopUpdateComponent],
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
      .overrideTemplate(StopUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StopUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stopFormService = TestBed.inject(StopFormService);
    stopService = TestBed.inject(StopService);
    routeService = TestBed.inject(RouteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Route query and add missing value', () => {
      const stop: IStop = { id: 456 };
      const route: IRoute = { id: 2005 };
      stop.route = route;

      const routeCollection: IRoute[] = [{ id: 25422 }];
      jest.spyOn(routeService, 'query').mockReturnValue(of(new HttpResponse({ body: routeCollection })));
      const additionalRoutes = [route];
      const expectedCollection: IRoute[] = [...additionalRoutes, ...routeCollection];
      jest.spyOn(routeService, 'addRouteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stop });
      comp.ngOnInit();

      expect(routeService.query).toHaveBeenCalled();
      expect(routeService.addRouteToCollectionIfMissing).toHaveBeenCalledWith(
        routeCollection,
        ...additionalRoutes.map(expect.objectContaining)
      );
      expect(comp.routesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const stop: IStop = { id: 456 };
      const route: IRoute = { id: 78130 };
      stop.route = route;

      activatedRoute.data = of({ stop });
      comp.ngOnInit();

      expect(comp.routesSharedCollection).toContain(route);
      expect(comp.stop).toEqual(stop);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStop>>();
      const stop = { id: 123 };
      jest.spyOn(stopFormService, 'getStop').mockReturnValue(stop);
      jest.spyOn(stopService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stop }));
      saveSubject.complete();

      // THEN
      expect(stopFormService.getStop).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stopService.update).toHaveBeenCalledWith(expect.objectContaining(stop));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStop>>();
      const stop = { id: 123 };
      jest.spyOn(stopFormService, 'getStop').mockReturnValue({ id: null });
      jest.spyOn(stopService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stop: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stop }));
      saveSubject.complete();

      // THEN
      expect(stopFormService.getStop).toHaveBeenCalled();
      expect(stopService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStop>>();
      const stop = { id: 123 };
      jest.spyOn(stopService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stopService.update).toHaveBeenCalled();
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
  });
});
