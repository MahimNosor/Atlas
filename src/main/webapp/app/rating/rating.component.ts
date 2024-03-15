import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-rating', // Ensure this selector matches the one in your HTML
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  stops: any[] = []; // Stores the stops on the route
  routeTitle = ''; // Stores the title of the route
  routeDescription = ''; // Stores the description of the route
  routeRating = 0; // Stores the rating of the route

  constructor() {}

  ngOnInit(): void {
    // This method is called when the component is initialized
    // Add any initialization code here
    // For example, you might want to initialize the first stop:
    this.addStop(); // This will ensure there's at least one stop field when the component loads
  }

  addStop(): void {
    // Adds a new stop object to the stops array
    this.stops.push({ name: '' });
  }

  submitRoute(): void {
    // Implement the logic to handle the submission of the route
    // For now, we'll just log the route details to the console
    console.log(this.stops, this.routeTitle, this.routeDescription, this.routeRating);
    // Here you would typically send this data to a backend server for processing
  }
}
