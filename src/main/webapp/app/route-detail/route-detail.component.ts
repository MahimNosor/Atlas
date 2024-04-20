import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss'],
})
export class RouteDetailComponent implements OnInit {
  // Using `!` to tell TypeScript that these properties will be initialized for sure.
  routeTitle!: string;
  routeDescription!: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      // Using non-null assertion since we expect these to always be provided
      this.routeTitle = params.get('title')!;
      this.routeDescription = params.get('description')!;
    });
  }
}
