import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'cuflr-scroll-to-top',
  standalone: true,
  imports: [],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent implements OnInit  {

   showButton = false;
  private alturaMinima = 200; // Altura en píxeles para mostrar el botón

  constructor() { }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showButton = window.scrollY > this.alturaMinima;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  ngOnInit(): void {
    // Asegúrate de que el botón aparezca o desaparezca al cargar la página
    this.showButton = window.scrollY > this.alturaMinima;
  }
}