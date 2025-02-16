import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarruselComponent {
  activeIndex = 0;
  images = [
    'https://img.interempresas.net/fotos/3843948.jpeg', 
    'https://www.lafabril.com.ec/wp-content/uploads/2023/12/LAVATODO-WEB-BANNERS-MULTIUSOS-1.jpg',
    'https://live.staticflickr.com/2901/33562145560_a1e2a8b5e0_h.jpg',
    'https://www.muypymes.com/wp-content/uploads/2020/11/Pepsico.jpg',
    'https://assets.unileversolutions.com/v1/2199636.jpg',
  ];
  dots = [0, 1, 2, 3, 4]; // Corresponding to the number of images
  
  constructor() { }

  ngOnInit(): void {
    this.autoChangeImage();
  }

  // To change to the next image
  next() {
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
    this.reloadSlider();
  }

  // To change to the previous image
  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    this.reloadSlider();
  }

  // To set the active image directly by clicking on the dot
  setActive(index: number) {
    this.activeIndex = index;
    this.reloadSlider();
  }

  // To reload the slider and reset interval
  reloadSlider() {
    clearInterval(this.refreshInterval);
    this.autoChangeImage();
  }

  // Auto-change image every 3 seconds
  refreshInterval: any;

  autoChangeImage() {
    this.refreshInterval = setInterval(() => {
      this.next();
    }, 3000);
  }
}