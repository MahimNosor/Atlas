import { IRoute } from 'app/entities/route/route.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';

export interface ITag {
  id: number;
  name?: string | null;
  routes?: Pick<IRoute, 'id'>[] | null;
  appUsers?: Pick<IAppUser, 'id'>[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
