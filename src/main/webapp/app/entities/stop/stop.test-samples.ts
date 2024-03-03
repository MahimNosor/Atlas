import { IStop, NewStop } from './stop.model';

export const sampleWithRequiredData: IStop = {
  id: 90764,
  name: 'Armenian Walks',
  latitude: 5820,
  longitude: 61785,
  sequenceNumber: 98591,
};

export const sampleWithPartialData: IStop = {
  id: 62436,
  name: 'deploy Handmade Human',
  description: 'Representative',
  latitude: 4201,
  longitude: 1952,
  sequenceNumber: 26826,
};

export const sampleWithFullData: IStop = {
  id: 85803,
  name: 'e-business PCI',
  description: 'Granite mindshare Account',
  latitude: 91112,
  longitude: 16151,
  sequenceNumber: 89337,
  rating: 36228,
};

export const sampleWithNewData: NewStop = {
  name: 'invoice Health',
  latitude: 540,
  longitude: 14969,
  sequenceNumber: 93808,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
