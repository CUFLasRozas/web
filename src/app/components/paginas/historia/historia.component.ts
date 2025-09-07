import { Component } from '@angular/core';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { InfoClub } from '../../../models/elClub';

@Component({
  selector: 'cuflr-historia',
  standalone: true,
  imports: [],
  templateUrl: './historia.component.html',
  styleUrl: './historia.component.css'
})
export class HistoriaComponent {
  infoClub!: InfoClub;

  constructor(
    private utilesService: UtilesService
  ) { }
  ngOnInit() {
    this.utilesService.obtenerJson("infoElClub.json").subscribe((data: any) =>
      this.infoClub = data
    )
  }
}
