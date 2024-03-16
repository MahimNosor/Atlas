export interface ICity {
  id: number;
  name?: string | null;
  country?: string | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null };
