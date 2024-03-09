import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-user-routes',
  templateUrl: './user-routes.component.html',
  styleUrls: ['./user-routes.component.scss'],
})
export class UserRoutesComponent implements OnInit {
  images: { src: string; caption: string }[] = [
    { src: 'content/images/london.png', caption: 'London<br />30/01/2024' },
    { src: 'content/images/paris.jpg', caption: 'Paris<br />29/01/2024' },
    { src: 'content/images/dhaka.png', caption: 'Dhaka<br />28/01/2024' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
