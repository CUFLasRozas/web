import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabeceraComponent } from "./components/cabecera/cabecera.component";
import { BarraLateralComponent } from "./components/barra-lateral/barra-lateral/barra-lateral.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CabeceraComponent, BarraLateralComponent, FooterComponent, ScrollToTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'CUF Las Rozas';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private meta: Meta) { }

  ngOnInit(): void {
  // Comprobar si existe una ruta guardada en sessionStorage
    const redirectPath = this.document.defaultView?.sessionStorage.getItem('redirect');

    if (redirectPath) {
      // Eliminar la ruta para evitar bucles
      this.document.defaultView?.sessionStorage.removeItem('redirect');
      
      // Navegar a la ruta guardada
      this.router.navigateByUrl(redirectPath, { replaceUrl: true });
    }
}
}
