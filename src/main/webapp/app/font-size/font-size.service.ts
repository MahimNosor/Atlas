import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private fontSizeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('md');
  public fontSize$: Observable<string> = this.fontSizeSubject.asObservable();

  constructor() {}

  setFontSize(size: string): void {
    this.fontSizeSubject.next(size);
  }
}
