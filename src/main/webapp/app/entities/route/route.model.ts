import { ITag } from 'app/entities/tag/tag.model';
import { ICity } from 'app/entities/city/city.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';

export interface IRoute {
  id: number;
  title?: string | null;
  description?: string | null;
  rating?: number | null;
  distance?: number | null;
  cost?: number | null;
  numReviews?: number | null;
  tags?: Pick<ITag, 'id' | 'name'>[] | null;
  city?: Pick<ICity, 'id'> | null;
  appUser?: Pick<IAppUser, 'id'> | null;
}

export type NewRoute = Omit<IRoute, 'id'> & { id: null };
