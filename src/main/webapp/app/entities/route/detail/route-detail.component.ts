import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoute } from '../route.model';

@Component({
  selector: 'jhi-route-detail',
  templateUrl: './route-detail.component.html',
})
export class RouteDetailComponent implements OnInit {
  route: IRoute | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ route }) => {
      this.route = route;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
