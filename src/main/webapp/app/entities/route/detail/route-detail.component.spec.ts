import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RouteDetailComponent } from './route-detail.component';

describe('Route Management Detail Component', () => {
  let comp: RouteDetailComponent;
  let fixture: ComponentFixture<RouteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ route: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RouteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RouteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load route on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.route).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
