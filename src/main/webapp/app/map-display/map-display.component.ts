import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '../../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import '../../../../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js';
@Component({
  selector: 'jhi-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss'],
})
export class MapDisplayComponent implements AfterViewInit {
  stopName = '';
  stops: any[] = [];
  private map: any;
  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.addStop();
  }

  addStop(): void {
    this.stops.push({ stopName: '' });
  }

  removeStop(): void {
    this.stops.pop();
  }

  private initMap(): void {
    this.map = L.map('map').setView([22.2816654, 114.1757015], 10);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
    L.Control.geocoder().addTo(this.map);
  }
}
