import { Component } from '@angular/core';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { BarraLateral } from '../../../models/barraLateral';

@Component({
  selector: 'cuflr-barra-lateral',
  standalone: true,
  imports: [],
  templateUrl: './barra-lateral.component.html',
  styleUrl: './barra-lateral.component.css'
})
export class BarraLateralComponent {
  infoBarraLateral!: BarraLateral;

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit() {
    this.utilesService.obtenerJson("barraLateral.json").subscribe((data:any) =>
      this.infoBarraLateral = data
    )
  }

}
