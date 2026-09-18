import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilesService } from '../../../../service/utiles/utiles.service';
import { Salida } from '../../../../models/listadoSalidas';
import { FAQSenderismo } from '../../../../models/FAQSenderismo';

@Component({
  selector: 'cuflr-senderismo-ppal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './senderismo-ppal.component.html',
  styleUrl: './senderismo-ppal.component.css'
})
export class SenderismoPpalComponent {
  listadoSalidas: Salida[] = [];
  listadoFAQ: FAQSenderismo[] = [];

  constructor(
    private ultilesService: UtilesService
  ) { }

  ngOnInit() {
    this.ultilesService.obtenerJson('listadoSalidas.json').subscribe((data: any) => {
      this.listadoSalidas = data;
    })
    this.ultilesService.obtenerJson('FAQSenderismo.json').subscribe((data: any) => {
      this.listadoFAQ = data;
    })  
  }
}
