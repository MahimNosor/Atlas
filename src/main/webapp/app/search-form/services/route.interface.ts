import { CityInterface } from './city.interface';

export interface RouteInterface {
  id: number;
  title: string;
  description: 'Technician systems Chips';
  rating: number;
  distance: number;
  cost: number;
  numReviews: number;
  stops: null;
  tags: null;
  city: CityInterface;
}
