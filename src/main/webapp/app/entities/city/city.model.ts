export interface ICity {
  id: number;
  name?: string | null;
  rating?: number | null;
  numRoutes?: number | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null };
