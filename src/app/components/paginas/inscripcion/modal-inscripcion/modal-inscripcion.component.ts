import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DATOS_CLUB } from '../../../generales.constants';

@Component({
  selector: 'cuflr-modal-inscripcion',
  standalone: true,
  imports: [],
  templateUrl: './modal-inscripcion.component.html',
  styleUrl: './modal-inscripcion.component.css'
})
export class ModalInscripcionComponent {
  datos_club = DATOS_CLUB;
  @Input() mostrar: boolean = false;
  @Input() estado: 'generando' | 'completado' = 'generando';

  @Output() descargarFicha = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  onDescargarFicha() {
    this.descargarFicha.emit();
    this.cerrarModal.emit();
  }

}
