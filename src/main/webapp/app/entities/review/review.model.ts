import dayjs from 'dayjs/esm';

export interface IReview {
  id: number;
  username?: string | null;
  title?: string | null;
  content?: string | null;
  rating?: number | null;
  reviewDate?: dayjs.Dayjs | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
