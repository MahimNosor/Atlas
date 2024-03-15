import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../route.test-samples';

import { RouteFormService } from './route-form.service';

describe('Route Form Service', () => {
  let service: RouteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteFormService);
  });

  describe('Service methods', () => {
    describe('createRouteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRouteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            rating: expect.any(Object),
            distance: expect.any(Object),
            cost: expect.any(Object),
            numReviews: expect.any(Object),
            city: expect.any(Object),
            appUser: expect.any(Object),
            tags: expect.any(Object),
          })
        );
      });

      it('passing IRoute should create a new form with FormGroup', () => {
        const formGroup = service.createRouteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            rating: expect.any(Object),
            distance: expect.any(Object),
            cost: expect.any(Object),
            numReviews: expect.any(Object),
            city: expect.any(Object),
            appUser: expect.any(Object),
            tags: expect.any(Object),
          })
        );
      });
    });

    describe('getRoute', () => {
      it('should return NewRoute for default Route initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRouteFormGroup(sampleWithNewData);

        const route = service.getRoute(formGroup) as any;

        expect(route).toMatchObject(sampleWithNewData);
      });

      it('should return NewRoute for empty Route initial value', () => {
        const formGroup = service.createRouteFormGroup();

        const route = service.getRoute(formGroup) as any;

        expect(route).toMatchObject({});
      });

      it('should return IRoute', () => {
        const formGroup = service.createRouteFormGroup(sampleWithRequiredData);

        const route = service.getRoute(formGroup) as any;

        expect(route).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRoute should not enable id FormControl', () => {
        const formGroup = service.createRouteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRoute should disable id FormControl', () => {
        const formGroup = service.createRouteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
