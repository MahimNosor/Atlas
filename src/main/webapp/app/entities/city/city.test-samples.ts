import { ICity, NewCity } from './city.model';

export const sampleWithRequiredData: ICity = {
  id: 79135,
  name: 'up multi-byte',
};

export const sampleWithPartialData: ICity = {
  id: 6481,
  name: 'Buckinghamshire structure Account',
};

export const sampleWithFullData: ICity = {
  id: 8224,
  name: 'Director Product Health',
  rating: 12056,
  numRoutes: 90848,
};

export const sampleWithNewData: NewCity = {
  name: 'Course embrace',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
