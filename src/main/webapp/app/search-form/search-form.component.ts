import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction, switchMap } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { NgbTypeaheadConfig, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CityService } from './services/city.service';
import { RouteService } from './services/route.service';
import { TagService } from './services/tag.service';
import { Tag } from './services/tag.interface';
import { CityInterface } from './services/city.interface';

import { Route } from '@angular/router';

import { RouteInterface } from './services/route.interface';

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
  selectedCity!: CityInterface;
  selectedDistance!: number;
  selectedPrice!: number;
  selectedTags: Tag[] = [];

  filteredCities!: Observable<string[]>;

  returnedRoutes!: RouteInterface[];

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
      tags: [[] as Tag[]],
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
        console.log('Tags fetched successfully! 🏷️✨', tags);
        this.allTags = tags;
      },
      error: error => {
        console.error('Error fetching tags:', error);
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
      map(term =>
        term.length < 2
          ? this.allTags
          : this.allTags
              .filter(tag => tag.name.toLowerCase().includes(term.toLowerCase()))
              .filter(tag => !this.selectedTags.some(selectedTag => selectedTag.id === tag.id))
              .slice(0, 10)
      ),
      map(tags => tags.map(tag => tag.name)) // Map tags array to an array of tag names
    );

  private _filterCities(value: string): CityInterface[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city.name.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    if (this.searchForm.valid) {
      console.log("Form submitted! 📝🚀 Let's go on an adventure!");
      const { city, price, distance, tags } = this.searchForm.value;
      // Set the selected values
      this.selectedCity = city;
      this.selectedPrice = parseFloat(price);
      this.selectedDistance = parseFloat(distance);
      this.selectedTags = tags;
      // Call the service method and subscribe to the returned observable
      this.routeService.fetchRoutesByCity(this.selectedCity, this.selectedPrice, this.selectedDistance, this.selectedTags).subscribe(
        (routes: RouteInterface[]) => {
          // Handle the fetched routes
          console.log('Routes:', routes);
          // Assign the fetched routes to a component property to display them in the template
          this.returnedRoutes = routes;
        },
        error => {
          console.error('Error fetching routes:', error);
          // Handle error appropriately (e.g., display error message)
        }
      );
    } else {
      console.log('Form submission failed! 😢 Check your form for errors!');
    }
  }

  onSelectedTagsChange(selectedTags: Tag[]): void {
    this.selectedTags = selectedTags;
  }

  removeTag(tag: Tag): void {
    const index = this.selectedTags.findIndex(selectedTag => selectedTag.id === tag.id);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
    }
  }

  onSelectTag(event: NgbTypeaheadSelectItemEvent<Tag>): void {
    // Specify the type of event.item
    const selectedTag: Tag = event.item;
    if (this.searchForm && this.searchForm.get('tags')) {
      if (!this.selectedTags.find(tag => tag.id === selectedTag.id)) {
        this.selectedTags.push(selectedTag);
        this.searchForm.get('tags')?.setValue('');
      }
    }
  }

  removeTagValue(tag: Tag): void {
    const index = this.selectedTags.findIndex(selectedTag => selectedTag.id === tag.id);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
      this.searchForm.get('tags')?.setValue('');
    }
  }
}
