import { Component, OnInit } from '@angular/core';
import { RouteService } from './route.service';
import { TagService } from './tag.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'jhi-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
})
export class ForYouComponent implements OnInit {
  routes: any[] = [];
  showLoadMoreButton: boolean = false;
  showLoadingMessage: boolean = true; // Initially set to true

  constructor(private routeService: RouteService, private tagService: TagService) {}

  ngOnInit(): void {
    // Call the loadRoutes method after 1 second
    setTimeout(() => {
      this.loadRoutes();
    }, 1000);
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(routes => {
      // Shuffle the routes array
      this.routes = this.shuffleArray(routes);
      // Select only the first three routes
      this.routes = this.routes.slice(0, 3);

      // Call displayRoutes to process or display the routes
      this.displayRoutes();
      console.log(this.showLoadMoreButton);

      // Set showLoadMoreButton to true after loading completes
      this.showLoadMoreButton = true;
      // Set showLoadingMessage to false to hide the loading message
      this.showLoadingMessage = false;
    });
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
    // Simulate loading for 2 seconds before refreshing the page
    setTimeout(() => {
      window.location.reload(); // Refresh the page
    }, 2000);
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
