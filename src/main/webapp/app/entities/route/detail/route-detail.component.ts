import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoute } from '../route.model';

import { DarkModeService } from '../../../dark-mode/dark-mode.service';

@Component({
  selector: 'jhi-route-detail',
  templateUrl: './route-detail.component.html',
})
export class RouteDetailComponent implements OnInit {
  route: IRoute | null = null;
  isDarkMode: boolean = false;

  constructor(protected activatedRoute: ActivatedRoute, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ route }) => {
      this.route = route;
    });

    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
