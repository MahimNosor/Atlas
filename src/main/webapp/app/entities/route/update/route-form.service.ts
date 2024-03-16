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
  title: FormControl<IRoute['title']>;
  description: FormControl<IRoute['description']>;
  rating: FormControl<IRoute['rating']>;
  distance: FormControl<IRoute['distance']>;
  cost: FormControl<IRoute['cost']>;
  numReviews: FormControl<IRoute['numReviews']>;
  tags: FormControl<IRoute['tags']>;
  city: FormControl<IRoute['city']>;
  appUser: FormControl<IRoute['appUser']>;
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
      title: new FormControl(routeRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(routeRawValue.description, {
        validators: [Validators.required],
      }),
      rating: new FormControl(routeRawValue.rating, {
        validators: [Validators.required],
      }),
      distance: new FormControl(routeRawValue.distance, {
        validators: [Validators.required],
      }),
      cost: new FormControl(routeRawValue.cost),
      numReviews: new FormControl(routeRawValue.numReviews, {
        validators: [Validators.required],
      }),
      tags: new FormControl(routeRawValue.tags ?? []),
      city: new FormControl(routeRawValue.city),
      appUser: new FormControl(routeRawValue.appUser),
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
