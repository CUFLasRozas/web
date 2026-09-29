import { Component, HostListener } from '@angular/core';
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
  galeria!: Imagenes[];
  anioSelected! : string;

  imagenAmpliada: Imagenes | null = null;
  mostrarModalImagen: boolean = false;

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit(){
    this.utilesService.obtenerJson('controlGaleria.json').subscribe((data: any)=> {
      this.controlGaleria = data;
      this.cargarGaleria( this.controlGaleria.mostrarAnyo);
    });
  }

  anioElegido(evento : Event){
    const anio = (evento.target as HTMLSelectElement).value;
    this.cargarGaleria(anio);
    console.log("has seleccionado el año:", anio)
  }

  cargarGaleria(anio:string){
    this.anioSelected = anio;
    const archivo = "galeria/"+anio+".json";
    this.utilesService.obtenerJson(archivo).subscribe((data : any) =>{
      this.galeria = data;
    })
  }

  abrirImagenModal(imagen: Imagenes) {
    this.imagenAmpliada = imagen;
    this.mostrarModalImagen = true;
  }

  cerrarImagenModal() {
    this.mostrarModalImagen = false;
    this.imagenAmpliada = null;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.mostrarModalImagen) {
      this.cerrarImagenModal();
    }
  }
}
