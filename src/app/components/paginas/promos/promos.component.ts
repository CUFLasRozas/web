import { Component } from '@angular/core';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { Promo } from '../../../models/promos';

@Component({
  selector: 'cuflr-promos',
  standalone: true,
  imports: [],
  templateUrl: './promos.component.html',
  styleUrl: './promos.component.css'
})
export class PromosComponent {
  promos!: Promo[];

  constructor(    
        private utilesService: UtilesService
  ){}

   ngOnInit() {
    this.utilesService.obtenerJson("promos.json").subscribe((data: any) =>
      this.promos = data.promos
    )
  }

}
