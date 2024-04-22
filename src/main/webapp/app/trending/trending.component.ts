import { Component, OnInit } from '@angular/core';
import { RouteService } from '../entities/route/service/route.service'; // Update the path as necessary
import { IRoute } from '../entities/route/route.model';
import { CityService } from '../entities/city/service/city.service';
import { ICity } from 'app/entities/city/city.model';

@Component({
  selector: 'jhi-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit {
  cities: ICity[] = [];
  routes: IRoute[] = []; // Declare the routes property
  selectedRoute: IRoute | null = null;
  filteredRoutes: IRoute[] = []; // To store routes for the selected city

  constructor(private routeService: RouteService, private cityService: CityService) {} // Inject RouteService

  ngOnInit(): void {
    this.cityService.query().subscribe({
      next: response => {
        this.cities = response.body ?? [];
      },
      error: error => {
        console.error('Error fetching cities:', error);
      },
    });

    this.setCityImages();

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
        }
      },
      error: error => {
        console.error('Error fetching routes:', error); // Log any errors
      },
    });
  }

  onCitySelected(city: ICity): void {
    // Assuming each route has a city property that includes the city ID
    this.filteredRoutes = this.routes.filter(route => route.city?.id === city.id);
  }

  clearFilter(): void {
    this.filteredRoutes = [...this.routes];
  }

  onRouteClicked(route: IRoute): void {
    this.selectedRoute = route;
  }

  setCityImages(): void {
    this.cities.forEach(city => {
      if (city.id === 1001) {
        city.imageUrl = '.../../content/images/new-york.jpg';
      } else if (city.id === 1003) {
        city.imageUrl = '../../content/images/paris.jpg';
      }
      // Add other conditions for other city IDs
    });
  }
}
