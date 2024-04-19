// shared/dark-mode.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {}

  public toggleDarkMode(): void {
    const currentMode = this.darkModeSubject.getValue();
    this.darkModeSubject.next(!currentMode);
  }
}
