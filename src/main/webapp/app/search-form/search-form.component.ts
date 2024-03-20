import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction, switchMap } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CityService } from './services/city.service';
import { RouteService } from './services/route.service';
import { TagService } from './services/tag.service';
import { Tag } from './services/tag.interface';
import { CityInterface } from './services/city.interface';
import { Route } from '@angular/router';

@Component({
  selector: 'jhi-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [NgbTypeaheadConfig],
})
export class SearchFormComponent implements OnInit {
  searchForm!: FormGroup;
  allTags: Tag[] = [];
  cities: CityInterface[] = [];

  filteredCities!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private typeaheadConfig: NgbTypeaheadConfig,
    private httpClient: HttpClient,
    private cityService: CityService,
    private routeService: RouteService,
    private tagService: TagService
  ) {
    this.typeaheadConfig.showHint = false;
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      city: [''],
      price: ['', [Validators.pattern(/^\d*\.?\d*$/)]], // Accepts only numeric characters and decimals
      distance: ['', [Validators.pattern(/^\d*\.?\d*$/)]], // Accepts only numeric characters and decimals
      selectedTags: [[]],
    });

    this.fetchCities();
    this.fetchTags();
  }

  fetchCities(): void {
    // Call the CityService method to fetch cities
    this.cityService.fetchAllCities().subscribe({
      next: (cities: CityInterface[]) => {
        this.cities = cities;
        this.filteredCities = this.searchForm.get('city')!.valueChanges.pipe(
          startWith(''),
          debounceTime(200),
          distinctUntilChanged(),
          map(value => this._filterCities(value).map(city => city.name))
        );
      },
      error() {
        console.error('Error fetching cities');
      },
    });
  }

  fetchTags(): void {
    // Call the TagService method to fetch tags
    this.tagService.fetchTags().subscribe({
      next: (tags: Tag[]) => {
        this.allTags = tags;
      },
      error() {
        console.error('Error fetching tags');
      },
    });
  }

  typeaheadSearch: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        this.filteredCities.pipe(map(cities => cities.filter(city => city.toLowerCase().startsWith(term.toLowerCase())).splice(0, 10)))
      )
    );

  typeaheadTags = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term.length < 2 ? [] : this.allTags.filter(tag => tag.name.toLowerCase().includes(term.toLowerCase()))))
    );

  onSubmit() {
    if (this.searchForm.valid) {
      const { city, price, distance } = this.searchForm.value;
      this.fetchRoutes(city);
    }
  }

  fetchRoutes(city: string): void {
    this.routeService.fetchRoutesByCity(city).subscribe({
      next: (routes: Route[]) => {
        console.log('Fetched routes:', routes);
        // Handle fetched routes as needed
      },
      error() {
        console.error('Error fetching routes');
      },
    });
  }

  private _filterCities(value: string): CityInterface[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city.name.toLowerCase().includes(filterValue));
  }
}
