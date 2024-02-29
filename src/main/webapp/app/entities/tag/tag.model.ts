import { IRoute } from 'app/entities/route/route.model';

export interface ITag {
  id: number;
  name?: string | null;
  routes?: Pick<IRoute, 'id'>[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
