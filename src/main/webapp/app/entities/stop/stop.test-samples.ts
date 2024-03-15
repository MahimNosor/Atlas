import { IStop, NewStop } from './stop.model';

export const sampleWithRequiredData: IStop = {
  id: 90764,
  name: 'Armenian Walks',
  latitude: 5820,
  longitude: 61785,
  sequenceNumber: 98591,
};

export const sampleWithPartialData: IStop = {
  id: 4948,
  name: 'Markets deposit',
  description: 'Human',
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
};

export const sampleWithNewData: NewStop = {
  name: 'Infrastructure drive',
  latitude: 51526,
  longitude: 92937,
  sequenceNumber: 91112,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
