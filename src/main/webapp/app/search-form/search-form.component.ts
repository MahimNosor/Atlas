import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NgbTypeaheadConfig, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [NgbTypeaheadConfig], //Adds NbTypeaheadConfig to the component provider
})
export class SearchFormComponent implements OnInit {
  searchForm!: FormGroup;
  availableTags: string[] = ['Tag1', 'Tag2', 'Tag3', 'Tag4']; // Example dummy data
  selectedTags: string[] = [];
  cities: string[] = [
    'Alabama',
    'Alaska',
    'American Samoa',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District Of Columbia',
    'Federated States Of Micronesia',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Marshall Islands',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Northern Mariana Islands',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Palau',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virgin Islands',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Alabama',
  ];
  filteredCities!: Observable<string[]>;

  constructor(private formBuilder: FormBuilder, private typeaheadConfig: NgbTypeaheadConfig) {
    this.filteredCities = new Observable<string[]>();
    this.typeaheadConfig.showHint = false; // Customize default values of typeahead
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      city: [''],
      price: [''],
      distance: [''],
    });

    this.filteredCities = this.searchForm.get('city')!.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      map(value => this._filterCities(value))
    );
  }

  typeaheadSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term.length < 2 ? [] : this.cities.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10)))
    );

  onSubmit() {
    if (this.searchForm.valid) {
      const formValues = this.searchForm.value;
      this.search(formValues);
    } else {
      // Form is invalid, display error messages or take appropriate action
    }
  }

  search(formData: any) {
    // Implement search functionality here
    console.log('Search Form Data:', formData);
  }

  selectTag(tag: string) {
    this.selectedTags.push(tag);
    this.availableTags = this.availableTags.filter(t => t !== tag);
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.availableTags.push(tag);
  }
  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city.toLowerCase().includes(filterValue));
  }
}
