import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  arrayBufferData$: Observable<any[]> | undefined;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // Initializations or other logic
  }

  onSearchSubmit(): void {
    console.log('Search query value:', this.searchQuery);

    this.searchService.doSearch(this.searchQuery).subscribe({
      next: data => {
        console.log(data);
        this.arrayBufferData$ = of(data);
      },

      error: () => console.log('Error in doSearch'),
    });
    console.log(this.arrayBufferData$);
  }
}
