import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DATOS_CLUB } from '../../generales.constants';

@Component({
  selector: 'cuflr-inicio',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  datos_club = DATOS_CLUB;

}
