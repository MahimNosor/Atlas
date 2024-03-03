import { ICity, NewCity } from './city.model';

export const sampleWithRequiredData: ICity = {
  id: 79135,
  name: 'up multi-byte',
  rating: 27237,
  numRoutes: 1965,
};

export const sampleWithPartialData: ICity = {
  id: 6481,
  name: 'Buckinghamshire structure Account',
  rating: 8224,
  numRoutes: 95174,
};

export const sampleWithFullData: ICity = {
  id: 98105,
  name: 'Cambridgeshire Chair',
  rating: 96263,
  numRoutes: 12056,
};

export const sampleWithNewData: NewCity = {
  name: 'vortals Junction (Malvinas)',
  rating: 5277,
  numRoutes: 80964,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
