export interface ICity {
  id: number;
  name?: string | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null };
