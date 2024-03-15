import { ICity } from 'app/entities/city/city.model';
import { ITag } from 'app/entities/tag/tag.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';

export interface IRoute {
  id: number;
  distance?: number | null;
  stops?: number | null;
  cost?: number | null;
  duration?: number | null;
  tagName?: string | null;
  city?: Pick<ICity, 'id'> | null;
  tags?: Pick<ITag, 'id'>[] | null;
  appUsers?: Pick<IAppUser, 'id'>[] | null;
}

export type NewRoute = Omit<IRoute, 'id'> & { id: null };
