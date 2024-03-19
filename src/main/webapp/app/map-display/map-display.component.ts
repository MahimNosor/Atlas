import { Component, OnInit } from '@angular/core';
import { MapDisplayService } from './service/map-display.service';
import { RatingService } from './service/rating.service';

import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import '../../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import '../../../../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js';
import { IRoute } from '../entities/route/route.model';
import { IStop } from '../entities/stop/stop.model';

@Component({
  selector: 'jhi-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss'],
})
export class MapDisplayComponent implements OnInit {
  selectedRouteId!: number;
  routeTitle!: string;
  routeDescription!: string;
  routeRating!: number;
  routeDistance!: number;
  routeCost!: number;
  isRouteSelected = false;

  userRating!: number;
  isReviewPosted = false;

  routeList!: IRoute[];
  stops!: IStop[] | null;

  routingControl!: any;

  private map: any;

  constructor(private mapDisplayService: MapDisplayService, private ratingService: RatingService) {}

  ngOnInit(): void {
    this.getAllRoutes();
    this.initMap();
  }

  clearAllWaypoints(): void {
    this.routingControl.getPlan().setWaypoints([]);
    this.isRouteSelected = false;
    this.isReviewPosted = false;
  }

  displayRoute(): void {
    this.clearAllWaypoints();
    this.mapDisplayService.getStops(this.selectedRouteId).subscribe({
      next: stopsResult => {
        stopsResult = stopsResult!.sort((a, b) => ((a.sequenceNumber ?? 0) < (b.sequenceNumber ?? 1) ? -1 : 1));
        this.setRouteWaypoints(stopsResult);
        this.setRouteInformation();
      },
      error() {
        alert('Something went wrong with displaying the route');
      },
    });
  }

  setRouteInformation(): void {
    this.mapDisplayService.getRoute(this.selectedRouteId).subscribe({
      next: routeResult => {
        this.routeTitle = routeResult!.title ?? '';
        this.routeDescription = routeResult!.description ?? '';
        this.routeRating = routeResult!.rating ?? 0;
        this.routeDistance = routeResult!.distance ?? 0;
        this.routeCost = routeResult!.cost ?? 0;
        this.isRouteSelected = true;
      },
      error() {
        alert('Something went wrong with retrieving information about the route');
      },
    });
  }

  getAllRoutes(): void {
    this.mapDisplayService.getAllRoutes().subscribe({
      next: routesResult => {
        this.routeList = routesResult ?? [];
      },
      error() {
        alert('No routes are available');
      },
    });
  }

  setRouteWaypoints(stops: IStop[]): void {
    let i = 0;
    for (const stop of stops) {
      this.routingControl.spliceWaypoints(i, 1, new L.latLng(stop.latitude, stop.longitude));
      i++;
    }
  }

  // TODO: implement appropriate logic and log in requirements
  updateRating(): void {
    const routeData: IRoute = {
      id: this.selectedRouteId,
      title: null,
      description: null,
      rating: this.userRating,
      distance: null,
      cost: null,
      numReviews: null,
      appUser: null,
      city: null,
      tags: null,
    };
    this.ratingService.updateRouteRating(this.selectedRouteId, routeData).subscribe({
      next: response => {
        this.isReviewPosted = true;
      },
      error() {
        alert('Something went wrong with posting your review');
      },
    });
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
  }

  private initMap(): void {
    this.map = L.map('map').setView([22.2816654, 114.1757015], 10);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    L.Control.geocoder().addTo(this.map);

    this.initMarker();

    this.initRouting();
  }
}
