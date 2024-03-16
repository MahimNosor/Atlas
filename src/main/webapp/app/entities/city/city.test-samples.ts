import { ICity, NewCity } from './city.model';

export const sampleWithRequiredData: ICity = {
  id: 79135,
  name: 'up multi-byte',
};

export const sampleWithPartialData: ICity = {
  id: 27237,
  name: 'Granite',
};

export const sampleWithFullData: ICity = {
  id: 32749,
  name: 'Myanmar Account Director',
};

export const sampleWithNewData: NewCity = {
  name: 'challenge Vista District',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
