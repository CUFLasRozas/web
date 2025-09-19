import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabeceraComponent } from "./components/cabecera/cabecera.component";
import { BarraLateralComponent } from "./components/barra-lateral/barra-lateral/barra-lateral.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { Meta } from '@angular/platform-browser';

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
    private meta: Meta) { }

  ngOnInit(): void {
  this.meta.addTags([
    { name: 'description', content: 'Aqui podrás ver toda la información del CUF Las Rozas, asi como estar al tanto de los ultimos partidos y eventos' },
    {name:'author', content:'Nuño Marín'},
    {name:'keywords', content:'CUF Las Rozas, Unihockey, Floorball'}
  ]);
}
}
