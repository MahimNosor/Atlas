import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStop } from '../stop.model';

@Component({
  selector: 'jhi-stop-detail',
  templateUrl: './stop-detail.component.html',
})
export class StopDetailComponent implements OnInit {
  stop: IStop | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stop }) => {
      this.stop = stop;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
