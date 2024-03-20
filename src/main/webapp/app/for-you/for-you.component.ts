import { Component, OnInit } from '@angular/core';
import { TagService } from 'app/entities/tag/service/tag.service';
import { UserService } from 'app/entities/user/user.service';
import { RouteService } from './route.service';

@Component({
  selector: 'jhi-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
})
export class ForYouComponent implements OnInit {
  routes: any[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }
}

/*
export class ForYouComponent {
  // Define routes array
  routes = [
    { routeID: '03172', tags: ['Tag1', 'Tag2'], distance: 6, rating: 4.9 },
    { routeID: '21172', tags: ['Tag3', 'Tag4'], distance: 5, rating: 4.8 },
    { routeID: '03142', tags: ['Tag5', 'Tag6'], distance: 2, rating: 4.4 }
  ];
}
 */
