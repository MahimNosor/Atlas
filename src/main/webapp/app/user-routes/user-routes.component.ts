import { Component, OnInit, Input } from '@angular/core';
import { RouteService } from '../entities/route/service/route.service';
import { IAppUser } from '../entities/app-user/app-user.model';
import { IRoute } from '../entities/route/route.model'; // Import IRoute interface

@Component({
  selector: 'jhi-user-routes',
  templateUrl: './user-routes.component.html',
  styleUrls: ['./user-routes.component.scss'],
})
export class UserRoutesComponent implements OnInit {
  @Input() username: string = '';
  user: IAppUser | undefined; // Updated type
  routes: IRoute[] = []; // Array to store retrieved routes
  error: string = '';
  numPreviousRoutes = 0; // Added property

  constructor(private routeService: RouteService) {}

  ngOnInit(): void {} // Inject RouteService
}
