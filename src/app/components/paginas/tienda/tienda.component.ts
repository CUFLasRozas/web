import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalComponent } from "./modal/modal.component";
import { UtilesService } from '../../../service/utiles/utiles.service';
import { ListaObjeto, ObjetosTienda } from '../../../models/objetosTienda';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';


@Component({
  selector: 'cuflr-tienda',
  standalone: true,
  imports: [RouterLink, ModalComponent, CommonModule],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  openModal = false;
  direccionApertura: string = '';
  objetoTienda?: ObjetosTienda;
  productoSeleccionado!: ListaObjeto;
  urlTiendaSeleccionada!: string;
  otrosArticulosActive: boolean = false;

  constructor(
    private ultilesService: UtilesService
  ) { }

  ngOnInit() {
    this.ultilesService.$modalTienda.subscribe((data: boolean) => this.openModal = data);
    this.ultilesService.obtenerJson('tienda.json').subscribe((data: any) => {
      this.objetoTienda = data;
      this.otrosArticulosActive = _.get(this.objetoTienda, 'otrosArticulosActive', false);
    })
  }

  abrirImagen(urlTienda: string, producto: ListaObjeto) {
    this.openModal = true;
    this.productoSeleccionado = producto;
    this.urlTiendaSeleccionada = urlTienda;
  }

}
