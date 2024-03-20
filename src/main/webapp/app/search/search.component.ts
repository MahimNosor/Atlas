import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { forkJoin, Observable, of } from 'rxjs';
import { RouteService } from '../entities/route/service/route.service';

@Component({
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  arrayBufferData$: Observable<any[]> | undefined;

  constructor(private searchService: SearchService, private routeService: RouteService) {}

  ngOnInit(): void {
    // Initializations or other logic
  }

  onSearchSubmit(): void {
    console.log('Search query value:', this.searchQuery);

    this.searchService.doSearch(this.searchQuery).subscribe({
      next: data => {
        console.log(data);

        // Fetch routes for each user concurrently using forkJoin
        const combinedResults$ = data.map(user => this.routeService.findPreviousRoutesByUserId(user.id));
        forkJoin(combinedResults$).subscribe(routesByUserId => {
          this.arrayBufferData$ = of(
            data.map((user, index) => ({
              ...user,
              routes: routesByUserId[index],
            }))
          );
        });
      },

      error: error => {
        console.error('Error in doSearch', error);
        // Handle error gracefully, e.g., display an error message to the user
      },
    });
  }
}
