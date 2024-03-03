import dayjs from 'dayjs/esm';

import { IReview, NewReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: 33078,
  username: 'Account navigate',
  title: 'transmitting',
  content: 'Legacy black Cheese',
  rating: 59362,
  reviewDate: dayjs('2024-02-29'),
};

export const sampleWithPartialData: IReview = {
  id: 27084,
  username: 'info-mediaries',
  title: 'generation',
  content: 'withdrawal',
  rating: 79341,
  reviewDate: dayjs('2024-02-29'),
};

export const sampleWithFullData: IReview = {
  id: 82677,
  username: 'Facilitator',
  title: 'SQL services',
  content: 'conglomeration application',
  rating: 41945,
  reviewDate: dayjs('2024-02-29'),
};

export const sampleWithNewData: NewReview = {
  username: 'impactful Bacon incubate',
  title: 'Savings',
  content: 'Supervisor',
  rating: 65428,
  reviewDate: dayjs('2024-02-29'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
