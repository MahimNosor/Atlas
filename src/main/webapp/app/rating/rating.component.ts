// import { Component, OnInit } from '@angular/core';
// import { RouteService } from './service/route.service';
// import { StopService } from './service/stop.service';
// @Component({
//   selector: 'jhi-rating', // Ensure this selector matches the one in your HTML
//   templateUrl: './rating.component.html',
//   styleUrls: ['./rating.component.scss'],
// })
// export class RatingComponent implements OnInit {
//   stops: any[] = []; // Stores the stops on the route
//   routeTitle = ''; // Stores the title of the route
//   routeDescription = ''; // Stores the description of the route
//   routeRating = 0; // Stores the rating of the route

//   constructor(private routeService: RouteService, private stopService:StopService) {}

//   ngOnInit(): void {
//     // This method is called when the component is initialized
//     // Add any initialization code here
//     // For example, you might want to initialize the first stop:
//     this.addStop(); // This will ensure there's at least one stop field when the component loads
//   }

//   addStop(): void {
//     // Adds a new stop object to the stops array
//     this.stops.push({ name: '' });
//   }

//   submitRoute(): void {
//     // Implement the logic to handle the submission of the route
//     // For now, we'll just log the route details to the console
//     x: Number = 0;
//     const routeData = {
//       id: null,
//       distance: 1,
//       stops: 1,
//       cost: 1000000,
//       duration: 1,
//       tagName: null,
//       city: null,
//       tags: null,
//     };

//     const stopData = {
//       id: null,
//       name: '',
//       description: '',
//       latitude: 0,
//       longitude: 0,
//       sequence: 0,
//       rating: 0,
//       route:
//     };

//     this.routeService.createRoute(routeData).subscribe({
//       next(response) {
//         alert('Route created');
//         // Handle successful creation here (e.g., redirecting the user or showing a success message)
//       },
//       error: error => {
//         console.error('There was an error creating the route:', error);
//         // Handle errors here (e.g., showing an error message to the user)
//       },
//     });

//     this.stopService.createStop(stopData).subscribe({
//       next(response) {
//         alert('Stop created');
//         // Handle successful creation here (e.g., redirecting the user or showing a success message)
//       },
//       error: error => {
//         console.error('There was an error creating the stop:', error);
//         // Handle errors here (e.g., showing an error message to the user)
//       },
//     });

//     // Here you would typically send this data to a backend server for processing
//   }
// }

import { Component, OnInit } from '@angular/core';
import { RouteService } from './service/route.service';
import { StopService } from './service/stop.service';
import { AuthService } from './service/auth.service';

import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import '../../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import '../../../../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js';

interface MyWaypoint {
  latLng: {
    lat: number;
    lng: number;
  };
  name?: string;
}

@Component({
  selector: 'jhi-map-display',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  travelTime!: string;
  travelDistance!: string;
  routingControl!: any;
  routeFound!: boolean;

  private map: any;
  private appUserId: number | null = null;
  routeTitle: string = '';
  routeDescription: string = '';
  selectedCity: string = '';
  tag1: boolean = false;
  tag2: boolean = false;
  tag3: boolean = false;
  routeCost: string = '';

  constructor(private routeService: RouteService, private stopService: StopService, private authService: AuthService) {}

  ngOnInit(): void {
    this.initMap();
    this.testGetAppUserId(); // Add this line to test the method
  }

  clearAllWaypoints(): void {
    this.routingControl.getPlan().setWaypoints([]);
    this.routeFound = false;
    this.routeTitle = '';
    this.routeDescription = '';
    this.routeCost = '';
    this.selectedCity = '';
    this.tag1 = false;
    this.tag2 = false;
    this.tag3 = false;
  }

  private initMarker(): void {
    const iconUrl = '../../content/images/marker-icon.png';
    const shadowUrl = '../../content/images/marker-shadow.png';
    const iconDefault = icon({
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    Marker.prototype.options.icon = iconDefault;
  }

  private initRouting(): void {
    this.routingControl = L.Routing.control({
      geocoder: L.Control.Geocoder.nominatim(),
      routeWhileDragging: true,
    }).addTo(this.map);

    this.routeFound = false;

    this.routingControl.on('routesfound', (e: any) => {
      this.travelTime = (e.routes[0].summary.totalTime / 3600).toFixed(2);
      this.travelDistance = (e.routes[0].summary.totalDistance / 1000).toFixed(2);
      this.routeFound = true;
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([52.4508, -1.9305], 3);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    L.Control.geocoder().addTo(this.map);

    this.initMarker();

    this.initRouting();
  }

  testGetAppUserId(): void {
    const username = this.authService.getCurrentUserId(); // This gets the username
    console.log(username);
    if (username) {
      this.authService.getAppUserIdByUsername(username).subscribe(
        appUserId => {
          console.log(`AppUser ID for username '${username}':`, appUserId);
          this.appUserId = appUserId;
        },
        error => {
          console.error('Failed to fetch AppUser ID:', error);
        }
      );
    } else {
      console.log('No user is currently logged in.');
    }
  }

  submitRoute(): void {
    // Assuming this part stays the same - creating the route

    if (!this.appUserId) {
      alert('User must be logged in to create a route.');
      console.log(this.appUserId);
      return;
    }

    let numberDistance: number = +this.travelDistance;
    let numberCost: number = +this.routeCost;
    const waypoints = this.routingControl.getWaypoints() as MyWaypoint[];

    // Check if distance has a value
    if (!this.travelDistance || numberDistance <= 0) {
      alert('Route cannot be found. Make sure you have at least 2 stops, and that the route is valid.');
      return;
    }

    // Check if there is a title
    if (!this.routeTitle.trim()) {
      alert('Please provide a title for the route.');
      return;
    }

    // Check if there is a description
    if (!this.routeDescription.trim()) {
      alert('Please provide a description for the route.');
      return;
    }

    // Check if cost is formatted correctly (at most two decimal places)
    if (isNaN(numberCost) || numberCost.toFixed(2) !== this.routeCost) {
      alert('Cost must be a number with exactly two decimal places.');
      return;
    }

    const routeData = {
      id: null,
      title: this.routeTitle,
      description: this.routeDescription,
      rating: 0,
      distance: numberDistance,
      cost: numberCost,
      numReviews: 0,
      appUser: { id: this.appUserId },
    };

    // You can handle the route creation logic as before
    this.routeService.createRoute(routeData).subscribe({
      next: httpResponse => {
        console.log('Route created', httpResponse.body);
        const routeId = httpResponse.body?.id; // Assuming response contains the ID of the newly created route
        console.log(routeId);

        // Now, handle the creation of stops based on waypoints
        waypoints.forEach((waypoint, index) => {
          if (waypoint.latLng) {
            // Ensure the waypoint has latitude and longitude
            const stopData = {
              id: null,
              name: waypoint.name || `Stop ${index + 1}`,
              description: `Description for ${waypoint.name || `Stop ${index + 1}`}`,
              latitude: waypoint.latLng.lat,
              longitude: waypoint.latLng.lng,
              sequenceNumber: index,
              route: { id: routeId }, // Associate the stop with the route
            };

            // Create the stop
            this.stopService.createStop(stopData).subscribe({
              next: response => {
                console.log(`Stop ${index + 1} created`, response);
                // Handle successful stop creation here
                if (index === waypoints.length - 1) {
                  // This is the last stop being processed
                  alert(`Route and stops have been successfully created. Route ID: ${routeId}`);
                }
                this.clearAllWaypoints();
              },
              error: error => {
                console.error(`There was an error creating the stop ${index + 1}:`, error);
                // Handle stop creation errors here
              },
            });
          }
        });
      },
      error: error => {
        console.error('There was an error creating the route:', error);
        // Handle route creation errors here
      },
    });
  }
}
