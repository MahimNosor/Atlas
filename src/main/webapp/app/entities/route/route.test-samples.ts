import { IRoute, NewRoute } from './route.model';

export const sampleWithRequiredData: IRoute = {
  id: 41704,
};

export const sampleWithPartialData: IRoute = {
  id: 97228,
  distance: 46437,
  stops: 5006,
  tagName: 'Shoes',
};

export const sampleWithFullData: IRoute = {
  id: 30723,
  distance: 68815,
  stops: 77613,
  cost: 21726,
  duration: 63122,
  tagName: 'green Greenland productize',
};

export const sampleWithNewData: NewRoute = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
