import { IRoute, NewRoute } from './route.model';

export const sampleWithRequiredData: IRoute = {
  id: 41704,
  distance: 58546,
  stops: 95395,
  duration: 13932,
};

export const sampleWithPartialData: IRoute = {
  id: 97228,
  distance: 46437,
  stops: 5006,
  duration: 26098,
  tagName: 'parse',
};

export const sampleWithFullData: IRoute = {
  id: 68815,
  distance: 77613,
  stops: 21726,
  cost: 63122,
  duration: 89501,
  tagName: 'Granite',
};

export const sampleWithNewData: NewRoute = {
  distance: 38173,
  stops: 95857,
  duration: 2347,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
