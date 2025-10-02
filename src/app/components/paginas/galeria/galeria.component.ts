import { Component } from '@angular/core';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { ControlGaleria, Imagenes } from '../../../models/galeria';

@Component({
  selector: 'cuflr-galeria',
  standalone: true,
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {
  controlGaleria!: ControlGaleria;
  filtroActived: boolean = false;
  galeria!:Imagenes[];
  anioSelected! : string;

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit(){
    this.utilesService.obtenerJson('controlGaleria.json').subscribe((data: any)=> {
      this.controlGaleria = data;
      this.cargarGaleria( this.controlGaleria.mostrarAnyo);
    });
     
  }

  cargarGaleria(anio:string){
    this.anioSelected = anio;
    const archivo = "galeria/"+anio+".json";
    this.utilesService.obtenerJson(archivo).subscribe((data : any) =>{
      this.galeria = data;
    })
  }
  

  anioElegido(evento : Event){
    const anio = (evento.target as HTMLSelectElement).value;
    this.cargarGaleria(anio);
    console.log("has seleccionado el año:", anio)
  }
}
