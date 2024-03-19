import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
})
export class AppButtonComponent implements OnInit {
  @Input() label!: string;

  @Output() buttonClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onClick(): void {
    this.buttonClick.emit();
  }
}
