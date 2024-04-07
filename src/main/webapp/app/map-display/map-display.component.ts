import { Component, OnInit } from '@angular/core';
import { MapDisplayService } from './service/map-display.service';
import { AuthService } from '../rating/service/auth.service';

import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import '../../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import '../../../../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js';

import dayjs from 'dayjs/esm';

import { IRoute } from '../entities/route/route.model';
import { IStop } from '../entities/stop/stop.model';
import { NewReview } from '../entities/review/review.model';

@Component({
  selector: 'jhi-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss'],
})
export class MapDisplayComponent implements OnInit {
  ratings = [1, 2, 3, 4, 5];

  selectedRouteId!: number;
  reviewRouteId!: number; // route id used for rating feature
  routeTitle!: string;
  routeDescription!: string;
  routeRating!: number;
  routeDistance!: number;
  routeCost!: number;
  routeCurrentRating!: number;
  routeTotalReviews!: number;
  isRouteSelected = false;

  appUserId: number | null = null;
  username: string | null = null;
  isLoggedIn = false;

  reviewTitle = '';
  reviewDescription = '';
  reviewRating = 1;
  isTitleEmpty!: boolean;
  isRatingInvalid!: boolean;
  isDescriptionEmpty!: boolean;

  hasUserPostedReview = false;
  userReviewTitle = '';
  userReviewRating = 1;
  userReviewDescription = '';
  userReviewDate = dayjs();

  routeList!: IRoute[];
  stops!: IStop[] | null;

  routingControl!: any;

  private map: any;

  constructor(private mapDisplayService: MapDisplayService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllRoutes();
    this.initMap();
    this.getAppUserId();
  }

  clearAll(): void {
    this.routingControl.getPlan().setWaypoints([]);
    this.isRouteSelected = false;
    this.isTitleEmpty = false;
    this.isRatingInvalid = false;
    this.isDescriptionEmpty = false;
    this.hasUserPostedReview = false;
  }

  displayRoute(): void {
    this.clearAll();

    // Potential problem where user selected another route before posting their review, but they did not click "display route"
    // this will give the route a wrong id after updating the rating
    // using another variable(reviewRouteId) to save the id should prevent this problem
    this.reviewRouteId = this.selectedRouteId;

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
        this.routeCurrentRating = routeResult!.rating ?? 0;
        this.routeTotalReviews = routeResult!.numReviews ?? 0;

        if (this.appUserId !== null) {
          this.checkUserHasReview(this.appUserId, this.reviewRouteId);
        }
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

  postReview(): void {
    if (this.appUserId === null) {
      alert('Please log in to post a review');
      return;
    }

    if (!this.validateReview()) {
      return;
    }

    const review: NewReview = {
      id: null,
      username: this.username,
      title: this.reviewTitle,
      content: this.reviewDescription,
      rating: this.reviewRating,
      reviewDate: dayjs(),
      route: { id: this.reviewRouteId },
      appUser: { id: this.appUserId },
    };

    this.mapDisplayService.postReview(review).subscribe({
      next: () => {
        this.updateRating();
        this.displayRoute();
      },
      error() {
        alert('Something went wrong with posting your review');
      },
    });
  }

  checkUserHasReview(appUserId: number, routeId: number): void {
    this.mapDisplayService.checkExistingReview(appUserId, routeId).subscribe({
      next: reviewResponse => {
        this.hasUserPostedReview = true;
        this.userReviewTitle = reviewResponse.title ?? '';
        this.userReviewRating = reviewResponse.rating ?? 1;
        this.userReviewDescription = reviewResponse.content ?? '';
        this.userReviewDate = reviewResponse.reviewDate ?? dayjs();
      },
      error: errorResult => {
        if (errorResult.status === 404) {
          this.hasUserPostedReview = false;
        } else {
          alert('Something went wrong with getting your review');
          this.hasUserPostedReview = false;
        }
      },
    });
  }

  updateRating(): void {
    const newTotalReviews = this.routeTotalReviews + 1;
    const newRating = Math.round((Number(this.routeCurrentRating * this.routeTotalReviews) + Number(this.reviewRating)) / newTotalReviews);

    const routeData: IRoute = {
      id: this.reviewRouteId,
      title: null,
      description: null,
      rating: newRating,
      distance: null,
      cost: null,
      numReviews: newTotalReviews,
      appUser: null,
      city: null,
      tags: null,
    };
    this.mapDisplayService.updateRouteRating(this.selectedRouteId, routeData).subscribe({
      error() {
        alert('Something went wrong with posting your review');
      },
    });
  }

  validateReview(): boolean {
    const isEmpty = (str: string): boolean => !str.trim().length;
    this.isTitleEmpty = false;
    this.isRatingInvalid = false;
    this.isDescriptionEmpty = false;

    if (isEmpty(this.reviewTitle)) {
      this.isTitleEmpty = true;
      return false;
    }

    if (isEmpty(this.reviewDescription)) {
      this.isDescriptionEmpty = true;
      return false;
    }

    return true;
  }

  getAppUserId(): void {
    this.username = this.authService.getCurrentUserId();
    if (this.username) {
      this.authService.getAppUserIdByUsername(this.username).subscribe({
        next: response => {
          this.appUserId = response;
          this.isLoggedIn = true;
        },
        error() {
          alert('User cannot be found');
        },
      });
    }
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
