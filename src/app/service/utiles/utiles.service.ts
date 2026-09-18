import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable, Signal } from '@angular/core';
import { ListaObjeto } from '../../models/objetosTienda';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilesService 
{private router = inject(Router);

  constructor(
    private http: HttpClient
  ) { }

  obtenerJson(nombre: string) {
    return this.http.get('assets/jsons/' + nombre)
  }

  public readonly esSenderismo: Signal<boolean> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects.includes('senderismo')),
      startWith(this.router.url.includes('senderismo'))
    ),
    { initialValue: this.router.url.includes('senderismo') }
  );

  $modalTienda = new EventEmitter<boolean>();

  $productoTienda = new EventEmitter<{dir:string, obj:ListaObjeto}>()
}
