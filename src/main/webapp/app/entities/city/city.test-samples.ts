import { ICity, NewCity } from './city.model';

export const sampleWithRequiredData: ICity = {
  id: 79135,
  name: 'up multi-byte',
};

export const sampleWithPartialData: ICity = {
  id: 1965,
  name: 'firewall',
};

export const sampleWithFullData: ICity = {
  id: 62664,
  name: 'EXE',
  country: 'Chad',
};

export const sampleWithNewData: NewCity = {
  name: 'Tasty dot-com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
