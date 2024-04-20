// search.component.ts
import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { forkJoin, Observable, of } from 'rxjs';
import { RouteService } from '../entities/route/service/route.service';
import { DarkModeService } from '../dark-mode/dark-mode.service'; // Update with correct path

@Component({
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  arrayBufferData$: Observable<any[]> | undefined;
  isDarkMode: boolean = false; // Variable to track dark mode state

  constructor(
    private searchService: SearchService,
    private routeService: RouteService,
    private darkModeService: DarkModeService // Inject DarkModeService
  ) {}

  ngOnInit(): void {
    // Subscribe to dark mode state changes
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
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
