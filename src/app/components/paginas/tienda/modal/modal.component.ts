import { Component, Input } from '@angular/core';
import { UtilesService } from '../../../../service/utiles/utiles.service';
import { ListaObjeto, ObjetoIndividual } from '../../../../models/objetosTienda';
import * as _ from 'lodash';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cuflr-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() urlTienda!: string;
  @Input() producto!: ListaObjeto;
  productoSeleccionado!: ObjetoIndividual;
  mostrarFlechas: boolean = false;
  contadorProducto: number = 0;
  contadorImagen: number = 0;
  imagenSeleccionada!: string;

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit(){
    if (_.get(this.producto, 'ObjetosIndividual[0].img').length > 1){
      this.mostrarFlechas = true;
    }
    this.productoSeleccionado =  _.get(this.producto.ObjetosIndividual,'[0]');    
    this.imagenSeleccionada = _.get(this.productoSeleccionado, 'img[0]')
  }

  cambioFotoDcha(){
    if (this.contadorImagen < _.get(this.productoSeleccionado,'img').length-1){
      this.contadorImagen++;
    } else {
      this.contadorImagen = 0;
    }
    this.imagenSeleccionada = this.productoSeleccionado.img[this.contadorImagen]
  }

  cambioFotoIzda(){
    if (this.contadorImagen > 0){
      this.contadorImagen--;
    } else {
      this.contadorImagen = _.get(this.productoSeleccionado, 'img').length -1;
    }
    this.imagenSeleccionada = this.productoSeleccionado.img[this.contadorImagen]

  }

  cambioArticulo(index: number) {
    this.productoSeleccionado = this.producto.ObjetosIndividual[index]
  }

  cerrarModal(){
    this.utilesService.$modalTienda.emit(false);
  }

}
