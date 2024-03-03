import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRoute, NewRoute } from '../route.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRoute for edit and NewRouteFormGroupInput for create.
 */
type RouteFormGroupInput = IRoute | PartialWithRequiredKeyOf<NewRoute>;

type RouteFormDefaults = Pick<NewRoute, 'id' | 'tags'>;

type RouteFormGroupContent = {
  id: FormControl<IRoute['id'] | NewRoute['id']>;
  distance: FormControl<IRoute['distance']>;
  stops: FormControl<IRoute['stops']>;
  cost: FormControl<IRoute['cost']>;
  duration: FormControl<IRoute['duration']>;
  tagName: FormControl<IRoute['tagName']>;
  city: FormControl<IRoute['city']>;
  tags: FormControl<IRoute['tags']>;
};

export type RouteFormGroup = FormGroup<RouteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RouteFormService {
  createRouteFormGroup(route: RouteFormGroupInput = { id: null }): RouteFormGroup {
    const routeRawValue = {
      ...this.getFormDefaults(),
      ...route,
    };
    return new FormGroup<RouteFormGroupContent>({
      id: new FormControl(
        { value: routeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      distance: new FormControl(routeRawValue.distance, {
        validators: [Validators.required],
      }),
      stops: new FormControl(routeRawValue.stops, {
        validators: [Validators.required],
      }),
      cost: new FormControl(routeRawValue.cost),
      duration: new FormControl(routeRawValue.duration, {
        validators: [Validators.required],
      }),
      tagName: new FormControl(routeRawValue.tagName),
      city: new FormControl(routeRawValue.city),
      tags: new FormControl(routeRawValue.tags ?? []),
    });
  }

  getRoute(form: RouteFormGroup): IRoute | NewRoute {
    return form.getRawValue() as IRoute | NewRoute;
  }

  resetForm(form: RouteFormGroup, route: RouteFormGroupInput): void {
    const routeRawValue = { ...this.getFormDefaults(), ...route };
    form.reset(
      {
        ...routeRawValue,
        id: { value: routeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RouteFormDefaults {
    return {
      id: null,
      tags: [],
    };
  }
}
