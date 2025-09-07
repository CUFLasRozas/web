import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilesService } from '../../service/utiles/utiles.service';

@Component({
  selector: 'cuflr-cabecera',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})

export class CabeceraComponent {
  cabecera: any;
  menuChequed = false;

  constructor(
    private utilesService: UtilesService
  ) { }

  ngOnInit() {
    this.utilesService.obtenerJson('cabecera.json').subscribe(data => {
      this.cabecera = data;
    }
    )

  }

  abrirMenu() {
    this.menuChequed = !this.menuChequed;
    let menu = document.getElementById('menu_cabecera');
    if (menu) {
      if (this.menuChequed){
        menu.classList.add('mostrar_menu_cabecera');
      } else {
        menu.classList.remove('mostrar_menu_cabecera');
      }
    }
  }

  cerrarMenu(){
    this.menuChequed = !this.menuChequed;
    let menu = document.getElementById('menu_cabecera');
    if (menu && window.screen.width <= 768) {
      menu.classList.remove('mostrar_menu_cabecera');
    } 
  }
}
