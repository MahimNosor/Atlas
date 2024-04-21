export interface ICity {
  id: number;
  name?: string | null;
  country?: string | null;
  imageUrl?: string | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null; imageUrl?: string | null };
