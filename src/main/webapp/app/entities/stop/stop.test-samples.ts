import { IStop, NewStop } from './stop.model';

export const sampleWithRequiredData: IStop = {
  id: 90764,
  name: 'Armenian Walks',
};

export const sampleWithPartialData: IStop = {
  id: 62436,
  name: 'deploy Handmade Human',
  latitude: 2622,
  longitude: 98077,
  sequenceNumber: 93660,
};

export const sampleWithFullData: IStop = {
  id: 16341,
  name: 'Computers',
  description: 'e-business PCI',
  latitude: 96095,
  longitude: 5594,
  sequenceNumber: 58237,
  rating: 47436,
};

export const sampleWithNewData: NewStop = {
  name: 'Iraq Jersey Interactions',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
