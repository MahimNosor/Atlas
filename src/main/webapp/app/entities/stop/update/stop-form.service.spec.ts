import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stop.test-samples';

import { StopFormService } from './stop-form.service';

describe('Stop Form Service', () => {
  let service: StopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StopFormService);
  });

  describe('Service methods', () => {
    describe('createStopFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStopFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
            sequenceNumber: expect.any(Object),
            city: expect.any(Object),
          })
        );
      });

      it('passing IStop should create a new form with FormGroup', () => {
        const formGroup = service.createStopFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
            sequenceNumber: expect.any(Object),
            city: expect.any(Object),
          })
        );
      });
    });

    describe('getStop', () => {
      it('should return NewStop for default Stop initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStopFormGroup(sampleWithNewData);

        const stop = service.getStop(formGroup) as any;

        expect(stop).toMatchObject(sampleWithNewData);
      });

      it('should return NewStop for empty Stop initial value', () => {
        const formGroup = service.createStopFormGroup();

        const stop = service.getStop(formGroup) as any;

        expect(stop).toMatchObject({});
      });

      it('should return IStop', () => {
        const formGroup = service.createStopFormGroup(sampleWithRequiredData);

        const stop = service.getStop(formGroup) as any;

        expect(stop).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStop should not enable id FormControl', () => {
        const formGroup = service.createStopFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStop should disable id FormControl', () => {
        const formGroup = service.createStopFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
