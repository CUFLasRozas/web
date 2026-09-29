import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DATOS_CLUB } from '../../../generales.constants';
import { UtilesService } from '../../../../service/utiles/utiles.service';

@Component({
  selector: 'cuflr-modal-inscripcion',
  standalone: true,
  imports: [],
  templateUrl: './modal-inscripcion.component.html',
  styleUrl: './modal-inscripcion.component.css'
})
export class ModalInscripcionComponent {
  datos_club = DATOS_CLUB;
    private utilesService = inject(UtilesService);
    public esSenderismo = this.utilesService.esSenderismo;
  @Input() mostrar: boolean = false;
  @Input() estado: 'generando' | 'completado' = 'generando';

  @Output() descargarFicha = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  onDescargarFicha() {
    this.descargarFicha.emit();
    this.cerrarModal.emit();
  }

}
