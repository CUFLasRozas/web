import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PreciosTemporada } from '../../../../models/precios_temporada';
import { UtilesService } from '../../../../service/utiles/utiles.service';

@Component({
  selector: 'cuflr-hazte-socio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hazte-socio.component.html',
  styleUrl: './hazte-socio.component.css'
})
export class HazteSocioComponent {
  
    preciosTemporada: PreciosTemporada | undefined = undefined;

      constructor(
        private ultilesService: UtilesService
      ) { }
    
      ngOnInit() {
        this.ultilesService.obtenerJson('preciosTemporada.json').subscribe((data: any) => {
          this.preciosTemporada = data;
        })  
      }
}
