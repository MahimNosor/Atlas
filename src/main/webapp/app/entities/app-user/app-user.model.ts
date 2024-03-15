import { IUser } from 'app/entities/user/user.model';
import { IRoute } from 'app/entities/route/route.model';

export interface IAppUser {
  id: number;
  numRoutes?: number | null;
  numReviews?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  routes?: Pick<IRoute, 'id'>[] | null;
}

export type NewAppUser = Omit<IAppUser, 'id'> & { id: null };
