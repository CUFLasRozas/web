import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { Entrenamientos } from '../../../models/entrenamientos';

@Component({
  selector: 'cuflr-entrenamientos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.css'
})
export class EntrenamientosComponent {
  infoEntrenos!: Entrenamientos;

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit() {
    this.utilesService.obtenerJson("infoEntrenos.json").subscribe((data:any) =>
      this.infoEntrenos = data
    )
  }
}
