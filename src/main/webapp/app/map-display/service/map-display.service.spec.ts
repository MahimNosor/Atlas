import { TestBed } from '@angular/core/testing';

import { MapDisplayService } from './map-display.service';

describe('MapDisplayService', () => {
  let service: MapDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
