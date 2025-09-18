import { Component } from '@angular/core';
import { UtilesService } from '../../service/utiles/utiles.service';
import { Patrocinadores } from '../../models/patrocinadores';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cuflr-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  patrocinadores!: Patrocinadores;

  constructor(
    private utilesService: UtilesService
  ){}

  ngOnInit(){
    this.utilesService.obtenerJson("patrocinadores.json").subscribe((data:any)=> {
      this.patrocinadores = data;
    }
    )
  }
}
