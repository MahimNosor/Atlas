import { IAppUser, NewAppUser } from './app-user.model';

export const sampleWithRequiredData: IAppUser = {
  id: 1883,
};

export const sampleWithPartialData: IAppUser = {
  id: 30698,
  numRoutes: 44938,
  numReviews: 69266,
};

export const sampleWithFullData: IAppUser = {
  id: 49304,
  numRoutes: 49456,
  numReviews: 62918,
};

export const sampleWithNewData: NewAppUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
