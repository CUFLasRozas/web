import { Component } from '@angular/core';
import { UtilesService } from '../../../service/utiles/utiles.service';

@Component({
  selector: 'cuflr-fotos',
  standalone: true,
  templateUrl: './fotos.component.html',
  styleUrl: './fotos.component.css'
})
export class FotosComponent {
  images: string[] = [];

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit(){
    this.utilesService.getImages('prueba');
     
  }
  
}
