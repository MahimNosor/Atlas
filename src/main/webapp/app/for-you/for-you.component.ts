import { Component, OnInit } from '@angular/core';
import { RouteService } from './route.service';
import { TagService } from './tag.service';
import { forkJoin } from 'rxjs';
import { DarkModeService } from '../dark-mode/dark-mode.service';

interface Route {
  id: number;
  title: string;
  description: string;
  rating: number;
  distance: number;
  cost: number;
  numReviews: number;
  stops: any[]; // adjust types as necessary
  reviews: any[]; // adjust types as necessary
  tags: { id: number; name: string }[]; // adjust types as necessary
  // add more properties if needed
}

@Component({
  selector: 'jhi-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
})
export class ForYouComponent implements OnInit {
  routes: any[] = [];
  showLoadMoreButton: boolean = false;
  showLoadingMessage: boolean = true; // Initially set to true
  isDarkMode: boolean = false;

  constructor(private routeService: RouteService, private tagService: TagService, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    // Call the loadRoutes method when the component initializes
    this.loadRoutes();
    // Subscribe to dark mode state changes
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  loadRoutes() {
    // Simulate loading for 1 second
    setTimeout(() => {
      this.routeService.getRoutes().subscribe(routes => {
        // Shuffle the routes array
        this.routes = this.shuffleArray(routes);
        // Select only the first three routes
        this.routes = this.routes.slice(0, 3);

        for (let route of this.routes) {
          this.routeService.getRoute(route.id).subscribe((_route: Route) => {
            console.log(_route);
            let tags = '';
            for (let tag of _route.tags) {
              tags += tag.name + ', '; // Assuming tag has a 'name' property
            }
            route.tag = tags.slice(0, -2);
          });
        }

        // Call displayRoutes to process or display the routes
        this.displayRoutes();
        console.log(this.showLoadMoreButton);

        // Set showLoadMoreButton to true after loading completes
        this.showLoadMoreButton = true;
        // Set showLoadingMessage to false to hide the loading message
        this.showLoadingMessage = false;
      });
    }, 100); // Delay loading by 1 second
  }

  displayRoutes(): void {
    const observables = this.routes.map(route => this.tagService.getTagIdsForRoute(route.id));

    forkJoin(observables).subscribe(tagsArray => {
      this.routes.forEach((route, index) => {
        const tags = tagsArray[index];
        route.tags = tags.map(tag => tag.name);
      });
    });
  }

  loadMore() {
    // Refresh the page immediately
    window.location.reload();
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
