import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ListaObjeto } from '../../models/objetosTienda';

@Injectable({
  providedIn: 'root'
})
export class UtilesService {

  constructor(
    private http: HttpClient
  ) { }

  obtenerJson(nombre: string) {
    return this.http.get('assets/jsons/' + nombre)
  }

  $modalTienda = new EventEmitter<boolean>();

  $productoTienda = new EventEmitter<{dir:string, obj:ListaObjeto}>()
}
