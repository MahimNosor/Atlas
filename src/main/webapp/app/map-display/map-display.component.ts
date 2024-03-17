import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MapDisplayService } from './service/map-display.service';
import { RouteService } from 'app/entities/route/service/route.service';
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
  routeFound!: boolean;

  routeList!: IRoute[];
  stops!: IStop[] | null;

  routingControl!: any;

  routeForm = this.formBuilder.group({
    routeId: '',
  });

  private map: any;

  constructor(private mapDisplayService: MapDisplayService, private formBuilder: FormBuilder, private routeService: RouteService) {}

  ngOnInit(): void {
    this.getAllRoutes();
    this.initMap();
  }

  clearAllWaypoints(): void {
    this.routingControl.getPlan().setWaypoints([]);
    this.routeFound = false;
  }

  getAllRoutes(): void {
    this.routeService.query().subscribe({
      next: routesResult => {
        this.routeList = routesResult.body ?? [];
      },
      error() {
        alert('No routes are available');
      },
    });
  }

  getStopsFromRouteId(routeId: number): IStop[] | null {
    this.mapDisplayService.getStops(routeId).subscribe({
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
