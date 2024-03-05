import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { Observable } from 'rxjs';

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

    this.arrayBufferData$ = this.searchService.doSearch(this.searchQuery);
  }
}
