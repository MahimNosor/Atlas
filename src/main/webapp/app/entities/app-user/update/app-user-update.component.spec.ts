import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AppUserFormService } from './app-user-form.service';
import { AppUserService } from '../service/app-user.service';
import { IAppUser } from '../app-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { AppUserUpdateComponent } from './app-user-update.component';

describe('AppUser Management Update Component', () => {
  let comp: AppUserUpdateComponent;
  let fixture: ComponentFixture<AppUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appUserFormService: AppUserFormService;
  let appUserService: AppUserService;
  let userService: UserService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AppUserUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AppUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appUserFormService = TestBed.inject(AppUserFormService);
    appUserService = TestBed.inject(AppUserService);
    userService = TestBed.inject(UserService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const appUser: IAppUser = { id: 456 };
      const user: IUser = { id: 80166 };
      appUser.user = user;

      const userCollection: IUser[] = [{ id: 18619 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tag query and add missing value', () => {
      const appUser: IAppUser = { id: 456 };
      const tags: ITag[] = [{ id: 90697 }];
      appUser.tags = tags;

      const tagCollection: ITag[] = [{ id: 32586 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...tags];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appUser });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags.map(expect.objectContaining));
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const appUser: IAppUser = { id: 456 };
      const user: IUser = { id: 29309 };
      appUser.user = user;
      const tag: ITag = { id: 32536 };
      appUser.tags = [tag];

      activatedRoute.data = of({ appUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.tagsSharedCollection).toContain(tag);
      expect(comp.appUser).toEqual(appUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUser>>();
      const appUser = { id: 123 };
      jest.spyOn(appUserFormService, 'getAppUser').mockReturnValue(appUser);
      jest.spyOn(appUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appUser }));
      saveSubject.complete();

      // THEN
      expect(appUserFormService.getAppUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appUserService.update).toHaveBeenCalledWith(expect.objectContaining(appUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUser>>();
      const appUser = { id: 123 };
      jest.spyOn(appUserFormService, 'getAppUser').mockReturnValue({ id: null });
      jest.spyOn(appUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appUser }));
      saveSubject.complete();

      // THEN
      expect(appUserFormService.getAppUser).toHaveBeenCalled();
      expect(appUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUser>>();
      const appUser = { id: 123 };
      jest.spyOn(appUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTag', () => {
      it('Should forward to tagService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tagService, 'compareTag');
        comp.compareTag(entity, entity2);
        expect(tagService.compareTag).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
