import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StopDetailComponent } from './stop-detail.component';

describe('Stop Management Detail Component', () => {
  let comp: StopDetailComponent;
  let fixture: ComponentFixture<StopDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StopDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ stop: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StopDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StopDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load stop on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.stop).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
