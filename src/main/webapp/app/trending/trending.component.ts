import { Component, OnInit } from '@angular/core';

interface City {
  id: number;
  name: string;
  imageUrl: string;
}

interface Spot {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'jhi-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit {
  cities: City[] = []; // Initialized as an empty array
  spots: Spot[] = [];
  constructor() {}

  ngOnInit(): void {
    this.cities = [
      {
        id: 1,
        name: 'New York',
        imageUrl: '../../content/images/new-york.jpg',
      },
      {
        id: 2,
        name: 'Paris',
        imageUrl: '../../content/images/paris.jpg',
      },
      {
        id: 3,
        name: 'Paris',
        imageUrl: '../../content/images/paris.jpg',
      },
      {
        id: 4,
        name: 'Paris',
        imageUrl: '../../content/images/paris.jpg',
      },
      {
        id: 5,
        name: 'Paris',
        imageUrl: '../../content/images/paris.jpg',
      },
      {
        id: 6,
        name: 'Paris',
        imageUrl: '../../content/images/paris.jpg',
      },
      // Add more cities as needed
    ];

    this.spots = [
      {
        id: 1,
        name: 'Statue of Liberty',
        imageUrl: '../../content/images/liberty-statue.jpg',
      },
      {
        id: 2,
        name: 'Camp Nou',
        imageUrl: '../../content/images/camp-nou-3.jpg',
      },
      {
        id: 3,
        name: 'Camp Nou',
        imageUrl: '../../content/images/camp-nou-3.jpg',
      },
      {
        id: 4,
        name: 'Camp Nou',
        imageUrl: '../../content/images/camp-nou-3.jpg',
      },
      {
        id: 5,
        name: 'Camp Nou',
        imageUrl: '../../content/images/camp-nou-3.jpg',
      },
      {
        id: 6,
        name: 'Camp Nou',
        imageUrl: '../../content/images/camp-nou-3.jpg',
      },
    ];
  }
}
