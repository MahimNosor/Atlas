import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  searchForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      keywords: [''],
      location: [''],
      tripDate: [''],
      priceFilter: ['lowToHigh', Validators.required], // Default value
      // Add more form controls as needed
    });
  }

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
    // This is where you would send the form data to the server or perform client-side filtering/searching
    console.log('Search Form Data:', formData);
  }
}
