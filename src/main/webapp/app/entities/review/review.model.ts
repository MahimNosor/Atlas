import dayjs from 'dayjs/esm';
import { IAppUser } from 'app/entities/app-user/app-user.model';

export interface IReview {
  id: number;
  username?: string | null;
  title?: string | null;
  content?: string | null;
  rating?: number | null;
  reviewDate?: dayjs.Dayjs | null;
  appUser?: Pick<IAppUser, 'id'> | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
