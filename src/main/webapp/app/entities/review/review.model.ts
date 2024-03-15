import dayjs from 'dayjs/esm';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { IRoute } from 'app/entities/route/route.model';

export interface IReview {
  id: number;
  username?: string | null;
  title?: string | null;
  content?: string | null;
  rating?: number | null;
  reviewDate?: dayjs.Dayjs | null;
  appUser?: Pick<IAppUser, 'id'> | null;
  route?: Pick<IRoute, 'id'> | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
