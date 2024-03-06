import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  images = [
    { src: '../content/images/ITALY.jpg', alt: 'Image 1' },
    { src: '../content/images/VIETNAM.jpg', alt: 'Image 2' },
    { src: '../content/images/LOUVRE.jpg', alt: 'Image 3' },
    { src: '../content/images/SWITZERLAND.jpg', alt: 'Image 4' },
    { src: '../content/images/INDIA.jpg', alt: 'Image 5' },

    // Add more images as needed
  ];
  currentIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.showSlide(this.currentIndex);
  }

  showSlide(index: number): void {
    this.currentIndex = index;
  }

  nextSlide(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.showSlide(this.currentIndex);
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
    this.showSlide(this.currentIndex);
  }
}
