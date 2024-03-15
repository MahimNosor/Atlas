import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStop, NewStop } from '../stop.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStop for edit and NewStopFormGroupInput for create.
 */
type StopFormGroupInput = IStop | PartialWithRequiredKeyOf<NewStop>;

type StopFormDefaults = Pick<NewStop, 'id'>;

type StopFormGroupContent = {
  id: FormControl<IStop['id'] | NewStop['id']>;
  name: FormControl<IStop['name']>;
  description: FormControl<IStop['description']>;
  latitude: FormControl<IStop['latitude']>;
  longitude: FormControl<IStop['longitude']>;
  sequenceNumber: FormControl<IStop['sequenceNumber']>;
  city: FormControl<IStop['city']>;
};

export type StopFormGroup = FormGroup<StopFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StopFormService {
  createStopFormGroup(stop: StopFormGroupInput = { id: null }): StopFormGroup {
    const stopRawValue = {
      ...this.getFormDefaults(),
      ...stop,
    };
    return new FormGroup<StopFormGroupContent>({
      id: new FormControl(
        { value: stopRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(stopRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(stopRawValue.description),
      latitude: new FormControl(stopRawValue.latitude, {
        validators: [Validators.required],
      }),
      longitude: new FormControl(stopRawValue.longitude, {
        validators: [Validators.required],
      }),
      sequenceNumber: new FormControl(stopRawValue.sequenceNumber, {
        validators: [Validators.required],
      }),
      city: new FormControl(stopRawValue.city),
    });
  }

  getStop(form: StopFormGroup): IStop | NewStop {
    return form.getRawValue() as IStop | NewStop;
  }

  resetForm(form: StopFormGroup, stop: StopFormGroupInput): void {
    const stopRawValue = { ...this.getFormDefaults(), ...stop };
    form.reset(
      {
        ...stopRawValue,
        id: { value: stopRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StopFormDefaults {
    return {
      id: null,
    };
  }
}
