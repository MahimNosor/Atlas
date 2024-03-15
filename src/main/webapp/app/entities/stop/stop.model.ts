import { IRoute } from 'app/entities/route/route.model';

export interface IStop {
  id: number;
  name?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sequenceNumber?: number | null;
  city?: Pick<IRoute, 'id'> | null;
}

export type NewStop = Omit<IStop, 'id'> & { id: null };
