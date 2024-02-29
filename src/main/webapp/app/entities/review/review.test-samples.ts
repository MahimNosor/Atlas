import dayjs from 'dayjs/esm';

import { IReview, NewReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: 33078,
  username: 'Account navigate',
  title: 'transmitting',
  content: 'Legacy black Cheese',
  rating: 59362,
};

export const sampleWithPartialData: IReview = {
  id: 27084,
  username: 'info-mediaries',
  title: 'generation',
  content: 'withdrawal',
  rating: 79341,
};

export const sampleWithFullData: IReview = {
  id: 88140,
  username: 'Versatile Plains support',
  title: 'Moldova ivory generate',
  content: 'Tactics',
  rating: 874,
  reviewDate: dayjs('2024-02-29'),
};

export const sampleWithNewData: NewReview = {
  username: 'Coordinator paradigms mint',
  title: 'Keyboard Buckinghamshire mint',
  content: 'synthesize',
  rating: 843,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
