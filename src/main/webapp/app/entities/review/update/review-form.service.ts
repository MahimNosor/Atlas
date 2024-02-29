import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReview, NewReview } from '../review.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReview for edit and NewReviewFormGroupInput for create.
 */
type ReviewFormGroupInput = IReview | PartialWithRequiredKeyOf<NewReview>;

type ReviewFormDefaults = Pick<NewReview, 'id'>;

type ReviewFormGroupContent = {
  id: FormControl<IReview['id'] | NewReview['id']>;
  username: FormControl<IReview['username']>;
  title: FormControl<IReview['title']>;
  content: FormControl<IReview['content']>;
  rating: FormControl<IReview['rating']>;
  reviewDate: FormControl<IReview['reviewDate']>;
  appUser: FormControl<IReview['appUser']>;
  route: FormControl<IReview['route']>;
};

export type ReviewFormGroup = FormGroup<ReviewFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReviewFormService {
  createReviewFormGroup(review: ReviewFormGroupInput = { id: null }): ReviewFormGroup {
    const reviewRawValue = {
      ...this.getFormDefaults(),
      ...review,
    };
    return new FormGroup<ReviewFormGroupContent>({
      id: new FormControl(
        { value: reviewRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(reviewRawValue.username, {
        validators: [Validators.required],
      }),
      title: new FormControl(reviewRawValue.title, {
        validators: [Validators.required],
      }),
      content: new FormControl(reviewRawValue.content, {
        validators: [Validators.required],
      }),
      rating: new FormControl(reviewRawValue.rating, {
        validators: [Validators.required],
      }),
      reviewDate: new FormControl(reviewRawValue.reviewDate),
      appUser: new FormControl(reviewRawValue.appUser),
      route: new FormControl(reviewRawValue.route),
    });
  }

  getReview(form: ReviewFormGroup): IReview | NewReview {
    return form.getRawValue() as IReview | NewReview;
  }

  resetForm(form: ReviewFormGroup, review: ReviewFormGroupInput): void {
    const reviewRawValue = { ...this.getFormDefaults(), ...review };
    form.reset(
      {
        ...reviewRawValue,
        id: { value: reviewRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReviewFormDefaults {
    return {
      id: null,
    };
  }
}
