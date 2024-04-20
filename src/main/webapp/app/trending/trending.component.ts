import { Component, OnInit } from '@angular/core';
import { RouteService } from '../entities/route/service/route.service'; // Update the path as necessary
import { IRoute } from '../entities/route/route.model';

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
  routes: IRoute[] = []; // Declare the routes property
  selectedRoute: IRoute | null = null;
  constructor(private routeService: RouteService) {} // Inject RouteService

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

    this.routeService.findAll().subscribe({
      next: response => {
        // Assuming response.body is the array of routes
        if (response.body) {
          this.routes = response.body;
          // Now sort the routes by rating in descending order
          this.routes.sort((a, b) => {
            // If some ratings could be null or undefined, provide a default value of 0
            const ratingA = a.rating ?? 0;
            const ratingB = b.rating ?? 0;
            return ratingB - ratingA;
          });

          console.log('Sorted Routes:', this.routes); // Log the sorted array of routes
        }
      },
      error: error => {
        console.error('Error fetching routes:', error); // Log any errors
      },
    });
  }
  onRouteClicked(route: IRoute): void {
    this.selectedRoute = route;
  }
}
