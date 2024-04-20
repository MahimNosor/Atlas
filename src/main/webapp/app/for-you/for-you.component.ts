import { Component, OnInit } from '@angular/core';
import { RouteService } from './route.service';

@Component({
  selector: 'jhi-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
})
export class ForYouComponent implements OnInit {
  routes: any[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(routes => {
      // Shuffle the routes array
      this.routes = this.shuffleArray(routes);
      // Select only the first three routes
      this.routes = this.routes.slice(0, 3);
    });
  }

  // Function to shuffle an array
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
/*
export class ForYouComponent {
  // Define routes array
  routes = [
    { routeID: '03172', tags: ['Tag1', 'Tag2'], distance: 6, rating: 4.9 },
    { routeID: '21172', tags: ['Tag3', 'Tag4'], distance: 5, rating: 4.8 },
    { routeID: '03142', tags: ['Tag5', 'Tag6'], distance: 2, rating: 4.4 }
  ];
}
 */
