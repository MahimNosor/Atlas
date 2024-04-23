import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SearchFormComponent } from './search-form.component';
import { CityService } from './services/city.service';
import { RouteService } from './services/route.service';
import { TagService } from './services/tag.service';
import { CityInterface } from './services/city.interface';
import { Tag } from './services/tag.interface';

// Mock NgControl
class NgControlMock {
  valueChanges = of('mocked value');
  valid = true;
  invalid = false;
  reset() {}
}

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let cityService: Partial<CityService>; // Use Partial to mock methods
  let routeService: Partial<RouteService>; // Use Partial to mock methods
  let tagService: Partial<TagService>; // Use Partial to mock methods

  beforeEach(async () => {
    cityService = {
      fetchAllCities: jest.fn().mockReturnValue(of([])), // Mocking fetchAllCities method
    };

    routeService = {} as Partial<RouteService>; // Mocking routeService as needed

    tagService = {
      fetchTags: jest.fn().mockReturnValue(of([])), // Mocking fetchTags method
    };

    await TestBed.configureTestingModule({
      declarations: [SearchFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CityService, useValue: cityService },
        { provide: RouteService, useValue: routeService },
        { provide: TagService, useValue: tagService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cities on init', () => {
    const cities: CityInterface[] = [
      { id: 1, name: 'City 1', country: '', routes: [] },
      { id: 2, name: 'City 2', country: '', routes: [] },
    ];
    (cityService.fetchAllCities as jest.Mock).mockReturnValue(of(cities));
    component.ngOnInit();
    expect(component.cities).toEqual(cities);
  });

  it('should fetch tags on init', () => {
    const tags: Tag[] = [
      { id: 1, name: 'Tag 1', routes: [], appUsers: [] },
      { id: 2, name: 'Tag 2', routes: [], appUsers: [] },
    ];
    (tagService.fetchTags as jest.Mock).mockReturnValue(of(tags));
    component.ngOnInit();
    expect(component.allTags).toEqual(tags);
  });

  it('should remove tag from selected tags', () => {
    const tagToRemove: Tag = { id: 1, name: 'Tag 1', routes: [], appUsers: [] };
    component.selectedTags = [
      { id: 1, name: 'Tag 1', routes: [], appUsers: [] },
      { id: 2, name: 'Tag 2', routes: [], appUsers: [] },
    ];
    component.removeTag(tagToRemove);
    expect(component.selectedTags).toEqual([{ id: 2, name: 'Tag 2', routes: [], appUsers: [] }]);
  });

  it('should toggle tag selection', () => {
    const tagToToggle: Tag = { id: 1, name: 'Tag 1', routes: [], appUsers: [] };
    component.selectedTags = [{ id: 2, name: 'Tag 2', routes: [], appUsers: [] }];
    component.toggleTagSelection(tagToToggle);
    expect(component.selectedTags).toEqual([
      { id: 2, name: 'Tag 2', routes: [], appUsers: [] },
      { id: 1, name: 'Tag 1', routes: [], appUsers: [] },
    ]);
    component.toggleTagSelection(tagToToggle);
    expect(component.selectedTags).toEqual([{ id: 2, name: 'Tag 2', routes: [], appUsers: [] }]);
  });
});
