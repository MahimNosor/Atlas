import { IRoute, NewRoute } from './route.model';

export const sampleWithRequiredData: IRoute = {
  id: 41704,
  title: 'Marketing Usability',
  description: 'generation',
  rating: 98640,
  distance: 30723,
  numReviews: 68815,
};

export const sampleWithPartialData: IRoute = {
  id: 21726,
  title: 'Dynamic deliver',
  description: 'productize Vista',
  rating: 16782,
  distance: 32578,
  cost: 32924,
  numReviews: 16465,
};

export const sampleWithFullData: IRoute = {
  id: 68990,
  title: 'magenta withdrawal Electronics',
  description: 'deposit Cuba York',
  rating: 16715,
  distance: 29634,
  cost: 39394,
  numReviews: 46367,
};

export const sampleWithNewData: NewRoute = {
  title: 'transmitter Avon',
  description: 'Configuration transmitter directional',
  rating: 41948,
  distance: 51487,
  numReviews: 39206,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
