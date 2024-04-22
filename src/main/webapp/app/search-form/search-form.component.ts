import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NgbTypeaheadConfig, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { CityService } from './services/city.service';
import { RouteService } from './services/route.service';
import { TagService } from './services/tag.service';
import { Tag } from './services/tag.interface';
import { CityInterface } from './services/city.interface';
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
  submitted = false;

  filteredCities!: Observable<string[]>;

  returnedRoutes!: RouteInterface[];
  tagSearch: string = '';
  @Output() submittedEvent = new EventEmitter<boolean>();
  @Output() returnedRoutesEvent = new EventEmitter<RouteInterface[]>();

  constructor(
    private formBuilder: FormBuilder,
    private typeaheadConfig: NgbTypeaheadConfig,
    private cityService: CityService,
    private routeService: RouteService,
    private tagService: TagService
  ) {
    this.typeaheadConfig.showHint = true;
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      city: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]], // Accepts only numeric characters and decimals
      distance: ['', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]], // Accepts only numeric characters and decimals
      tags: [[] as Tag[]],
    });

    this.fetchCities();
    this.fetchTags();
  }

  handleDropdownKeyDown(event: KeyboardEvent): void {
    const dropdownMenu = event.currentTarget as HTMLElement;
    const activeElement = document.activeElement as HTMLElement;
    const firstItem = dropdownMenu.querySelector('.dropdown-item:first-child') as HTMLButtonElement;
    const lastItem = dropdownMenu.querySelector('.dropdown-item:last-child') as HTMLButtonElement;

    switch (event.key) {
      case 'Tab':
        const searchButton = document.getElementById('search');
        if (searchButton) {
          event.preventDefault(); // Prevent the default Tab behavior
          searchButton.focus(); // Move focus to the search button
          console.log('Search button focused:', document.activeElement === searchButton);
        }
        break;
      case 'ArrowUp':
        if (activeElement === firstItem) {
          lastItem.focus();
        } else {
          (activeElement.previousElementSibling as HTMLButtonElement)?.focus();
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (activeElement === lastItem) {
          firstItem.focus();
        } else {
          (activeElement.nextElementSibling as HTMLButtonElement)?.focus();
        }
        event.preventDefault();
        break;
      case 'Home':
        firstItem.focus();
        event.preventDefault();
        break;
      case 'End':
        lastItem.focus();
        event.preventDefault();
        break;

      default:
        // Handle other key presses if needed
        break;
    }
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
      const { city, price, distance } = this.searchForm.value;

      // Find the City object corresponding to the selected city name
      this.selectedCity = this.cities.find(c => c.name === city)!;

      // Set the selected values
      this.selectedPrice = parseFloat(price);
      this.selectedDistance = parseFloat(distance);
      this.submitted = true;

      this.submittedEvent.emit(this.submitted);
      // Call the service method and subscribe to the returned observable
      this.fetchRoutes();
    } else {
      console.log('Form submission failed! 😢 Check your form for errors!');
    }
  }

  fetchRoutes(): void {
    setTimeout(() => {
      console.log('Selected tags:', this.selectedTags);
      if (this.selectedTags.length === 0) {
        // No tags selected, fetch routes without filtering by tags
        this.routeService.fetchRoutesByCity(this.selectedCity, this.selectedPrice, this.selectedDistance, []).subscribe({
          next: (routes: RouteInterface[]) => {
            // Handle the fetched routes
            console.log('Routes:', routes);
            // Assign the fetched routes to a component property to display them in the template
            this.returnedRoutes = routes;
            this.returnedRoutesEvent.emit(this.returnedRoutes);
          },
          error: (error: any) => {
            console.error('Error fetching routes:', error);
            // Handle error appropriately (e.g., display error message)
          },
        });
      } else {
        // Tags selected, fetch routes with filtering by tags
        this.routeService.fetchRoutesByCity(this.selectedCity, this.selectedPrice, this.selectedDistance, this.selectedTags).subscribe({
          next: (routes: RouteInterface[]) => {
            // Handle the fetched routes
            console.log('Routes:', routes);
            // Assign the fetched routes to a component property to display them in the template
            this.returnedRoutes = routes;
            this.returnedRoutesEvent.emit(this.returnedRoutes);
          },
          error: (error: any) => {
            console.error('Error fetching routes:', error);
            // Handle error appropriately (e.g., display error message)
          },
        });
      }
    }, 100); // Adjust the delay time as needed
  }

  removeTag(tag: Tag): void {
    // Find the index of the tag to be removed
    this.selectedTags = this.selectedTags.filter(selectedTag => selectedTag.id !== tag.id);
    this.updateTagsFormControlValue();
  }

  onSelectTag(event: NgbTypeaheadSelectItemEvent<Tag>): void {
    const selectedTag: Tag = event.item;
    if (this.searchForm && this.searchForm.get('tags')) {
      this.toggleTagSelection(selectedTag);
    }
    this.tagSearch = '';
  }

  isSelectedTag(tag: Tag): boolean {
    // Check if the tag exists in the list of selected tags
    return this.selectedTags.some(selectedTag => selectedTag.id === tag.id);
  }

  toggleTagSelection(tag: Tag): void {
    // Check if the tag is already selected
    const isSelected = this.isSelectedTag(tag);

    // If the tag is already selected, remove it from the list of selected tags
    if (isSelected) {
      this.selectedTags = this.selectedTags.filter(selectedTag => selectedTag.id !== tag.id);
    } else {
      // If the tag is not selected, add it to the list of selected tags
      this.selectedTags.push(tag);
    }

    // ** Update the tags form control with the updated selected tags as strings **
    this.updateTagsFormControlValue();

    // Log the updated selectedTags array for debugging
    console.log('Updated selectedTags:', this.selectedTags);
  }

  private updateTagsFormControlValue(): void {
    // Update the value of the tags form control with the updated selectedTags array
    this.searchForm.get('tags')?.setValue(this.selectedTags.map(tag => tag.name));

    // Log the updated value of the tags form control for debugging
    console.log('Updated tags form control value:', this.searchForm.get('tags')?.value);
  }
}
