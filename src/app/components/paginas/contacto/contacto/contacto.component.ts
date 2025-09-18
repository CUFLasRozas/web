import { Component } from '@angular/core';
import { DATOS_CLUB } from '../../../generales.constants';


@Component({
  selector: 'cuflr-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  datos_club = DATOS_CLUB;
}
