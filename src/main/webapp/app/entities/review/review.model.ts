import dayjs from 'dayjs/esm';
import { IRoute } from 'app/entities/route/route.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';

export interface IReview {
  id: number;
  username?: string | null;
  title?: string | null;
  content?: string | null;
  rating?: number | null;
  reviewDate?: dayjs.Dayjs | null;
  route?: Pick<IRoute, 'id'> | null;
  appUser?: Pick<IAppUser, 'id'> | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
