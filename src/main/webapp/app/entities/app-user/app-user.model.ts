import { IUser } from 'app/entities/user/user.model';
import { ITag } from 'app/entities/tag/tag.model';

export interface IAppUser {
  id: number;
  numRoutes?: number | null;
  numReviews?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  tags?: Pick<ITag, 'id' | 'name'>[] | null;
}

export type NewAppUser = Omit<IAppUser, 'id'> & { id: null };
