import { Component, OnInit } from '@angular/core';
import { MapDisplayService } from './service/map-display.service';
import { IRoute } from '../entities/route/route.model';

import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import '../../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import '../../../../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js';
import { IStop } from '../entities/stop/stop.model';

@Component({
  selector: 'jhi-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss'],
})
export class MapDisplayComponent implements OnInit {
  travelTime!: string;
  travelDistance!: string;
  routeId!: number;
  routeFound!: boolean;

  route!: IRoute | null;
  stops!: IStop[] | null;

  routingControl!: any;

  private map: any;

  constructor(private mapDisplayService: MapDisplayService) {}

  ngOnInit(): void {
    this.initMap();
  }

  clearAllWaypoints(): void {
    this.routingControl.getPlan().setWaypoints([]);
    this.routeFound = false;
  }

  getRouteFromId(id: number): IRoute | null {
    this.mapDisplayService.findRoute(id).subscribe({
      next: routeResult => {
        this.route = routeResult;
        this.routeId = id;
      },
      error() {
        alert('Route does not exist');
        return null;
      },
    });
    return this.route;
  }

  getStopsFromRouteId(routeId: number): IStop[] | null {
    this.mapDisplayService.findStops(routeId).subscribe({
      next: stopsResult => {
        this.stops = stopsResult;
      },
      error() {
        alert('Cannot find stops for this route');
      },
    });
    return this.stops;
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
