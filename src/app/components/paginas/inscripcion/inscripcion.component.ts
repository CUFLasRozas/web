import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { PreciosTemporada } from '../../../models/precios_temporada';
import { PDFDocument, StandardFonts, rgb, PDFName, PDFBool } from 'pdf-lib';




@Component({
  selector: 'cuflr-inscripcion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css',
})
export class InscripcionComponent {
  mayoriaEdad!: string;
  inscripcion!: FormGroup;
  submitted: boolean = false;
  hoy: string = "2024-12-12";
  regimenInternoChecked: boolean = false;
  precios_temporada?: PreciosTemporada;
  esMenor: boolean = false;

  private _canvasJugador?: ElementRef<HTMLCanvasElement>;
  private _canvasP1?: ElementRef<HTMLCanvasElement>;
  private _canvasP2?: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasJugador') set canvasJugador(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._canvasJugador = content;
      this.initCanvas('canvasJugador');
    }
  }
  @ViewChild('canvasP1') set canvasP1(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._canvasP1 = content;
      this.initCanvas('canvasP1');
    }
  }
  @ViewChild('canvasP2') set canvasP2(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._canvasP2 = content;
      this.initCanvas('canvasP2');
    }
  }

  private ctx: { [key: string]: CanvasRenderingContext2D | null } = {};
  private drawing = false;

  constructor(
    private utilesService: UtilesService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.utilesService.obtenerJson("preciosTemporada.json").subscribe((data: any) =>
      this.precios_temporada = data
    )
    this.calcularHoy();
    this.inscripcion = this.fb.group({
      nombrePpal: ['', Validators.required],
      apellidosPpal: ['', Validators.required],
      nacimiento: ['', Validators.required],
      emailppal: ['', [Validators.required, Validators.email]],
      dni: ['', []],
      telefonoPpal: ['', [Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]],
      alergias: [''],
      padron: ['', Validators.required],
      contactos: this.fb.array([this.crearContacto()]),
      categoria: ['', Validators.required],
      pago: ['', Validators.required],
      autFotos: ['', Validators.required],
      firmaJugador: ['', []],
      firmaP1: ['', []],
      nombreP1: ['', []],
      dniP1: ['', []],
      firmaP2: ['', []],
      nombreP2: ['', []],
      dniP2: ['', []]
    }, { validators: [this.uniquenessValidator] });
    this.inscripcion.get('nacimiento')?.valueChanges.subscribe(() => this.updateAgeDependentValidators());

    this.inscripcion.get('categoria')?.valueChanges.subscribe(() => {
      this.inscripcion.get('pago')?.setValue('');
    });
  }

  private dniValidator = (control: AbstractControl): ValidationErrors | null => {
    const value: string = (control.value || '').toUpperCase().trim();
    if (!value) return null; // handled by required validator when needed
    const dniRegex = /^(\d{8}[A-Z])$/;
    const nieRegex = /^[XYZ]\d{7}[A-Z]$/;
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let numberPart: number;
    let letter: string;
    if (dniRegex.test(value)) {
      numberPart = parseInt(value.slice(0, 8), 10);
      letter = value.charAt(8);
    } else if (nieRegex.test(value)) {
      const prefix = value.charAt(0);
      const prefixNumber = prefix === 'X' ? 0 : prefix === 'Y' ? 1 : 2;
      numberPart = prefixNumber * 10000000 + parseInt(value.slice(1, 8), 10);
      letter = value.charAt(8);
    } else {
      return { invalidDni: true };
    }
    const expectedLetter = letters.charAt(numberPart % 23);
    return letter === expectedLetter ? null : { invalidDni: true };
  };

  private getAge(): number | null {
    const birth = this.inscripcion?.get('nacimiento')?.value;
    if (!birth) return null;
    const birthDate = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private updateAgeDependentValidators(): void {
    const age = this.getAge();

    const dniControl = this.inscripcion.get('dni');
    const dniP1 = this.inscripcion.get('dniP1');
    const dniP2 = this.inscripcion.get('dniP2');

    if (dniControl) {
      if (age !== null && age < 14) {
        dniControl.setValidators([this.dniValidator]);
      } else {
        dniControl.setValidators([Validators.required, Validators.minLength(9), this.dniValidator]);
      }
      // No llamamos a updateValueAndValidity aquí para evitar bucles infinitos con el validador de grupo
    }

    const emailControl = this.inscripcion.get('emailppal');
    const telefonoControl = this.inscripcion.get('telefonoPpal');

    const firmaJugador = this.inscripcion.get('firmaJugador');
    const firmaP1 = this.inscripcion.get('firmaP1');
    const nombreP1 = this.inscripcion.get('nombreP1');
    const firmaP2 = this.inscripcion.get('firmaP2');
    const nombreP2 = this.inscripcion.get('nombreP2');

    if (age !== null && age < 18) {
      this.esMenor = true;
      emailControl?.setValidators([Validators.email]);
      telefonoControl?.setValidators([Validators.pattern(/^[6-9]\d{8}$/)]);

      firmaJugador?.setValidators([]);
      firmaJugador?.setValue(''); // Limpiar firma de adulto si pasa a ser menor
      firmaP1?.setValidators([Validators.required]);
      nombreP1?.setValidators([Validators.required]);
      dniP1?.setValidators([Validators.required, this.dniValidator]);
      firmaP2?.setValidators([]); // Opcional
      nombreP2?.setValidators([]); // Opcional
      dniP2?.setValidators([this.dniValidator]); // Opcional, pero valida formato si se rellena
    } else {
      this.esMenor = false;
      emailControl?.setValidators([Validators.required, Validators.email]);
      telefonoControl?.setValidators([Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]);

      firmaJugador?.setValidators([Validators.required]);
      firmaP1?.setValidators([]);
      firmaP1?.setValue(''); // Limpiar firmas de progenitores si pasa a ser adulto
      nombreP1?.setValidators([]);
      nombreP1?.setValue('');
      dniP1?.setValidators([]);
      dniP1?.setValue('');
      firmaP2?.setValidators([]);
      firmaP2?.setValue('');
      nombreP2?.setValidators([]);
      nombreP2?.setValue('');
      dniP2?.setValidators([]);
      dniP2?.setValue('');
    }

    [emailControl, telefonoControl, firmaJugador, firmaP1, nombreP1, dniP1, firmaP2, nombreP2, dniP2].forEach(c => c?.updateValueAndValidity({ emitEvent: false }));
  }

  private uniquenessValidator = (group: AbstractControl): ValidationErrors | null => {
    const dniPpal = group.get('dni')?.value?.toUpperCase().trim();
    const dniP1 = group.get('dniP1')?.value?.toUpperCase().trim();
    const dniP2 = group.get('dniP2')?.value?.toUpperCase().trim();
    const nombreP1 = group.get('nombreP1')?.value?.toLowerCase().trim();
    const nombreP2 = group.get('nombreP2')?.value?.toLowerCase().trim();

    const errors: any = {};

    if (dniPpal && dniP1 && dniPpal === dniP1) errors.dniDuplicadoP1 = true;
    if (dniPpal && dniP2 && dniPpal === dniP2) errors.dniDuplicadoP2 = true;
    if (dniP1 && dniP2 && dniP1 === dniP2) errors.dniDuplicadoProgenitores = true;
    if (nombreP1 && nombreP2 && nombreP1 === nombreP2 && nombreP1 !== '') errors.nombresDuplicados = true;

    return Object.keys(errors).length > 0 ? errors : null;
  };

  get contactos(): FormArray {
    return this.inscripcion.get('contactos') as FormArray;
  }

  crearContacto(): FormGroup {
    return this.fb.group({
      nombreContacto: ['', Validators.required],
      emailContacto: ['', [Validators.required, Validators.email]],
      telefonoContacto: ['', [Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]],
    });
  }

  changeRegimenInterno() {
    this.regimenInternoChecked = !this.regimenInternoChecked;
  }
  onSubmit() {
    this.submitted = true;
    if (this.inscripcion.valid) {
      console.log(this.inscripcion.value);
      this.generarPDF();
    } else {
      console.log('formulario invalido')
    }
  }

  async generarPDF() {
    const formValue = this.inscripcion.value;
    const templatePath = 'assets/documentos/ficha_inscripcion_CUF_LAS_ROZAS.pdf';

    try {
      const response = await fetch(templatePath);
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 10;
      const color = rgb(0, 0, 0);

      const form = pdfDoc.getForm();

      // Helper function to safely set field text and optionally make it read-only
      const setField = (fieldName: string, value: any, readOnly: boolean = false) => {
        try {
          const field = form.getTextField(fieldName);
          if (value !== undefined && value !== null) {
            field.setText(value.toString());
          }
          if (readOnly) {
            field.enableReadOnly();
          }
        } catch (e) {
          console.warn(`Field ${fieldName} not found or is not a text field`);
        }
      };

      // Temporada
      if (this.precios_temporada && this.precios_temporada.temporada) {
        setField('temporada', this.precios_temporada.temporada);
      }

      // Datos del jugador
      setField('nombreppal', formValue.nombrePpal);
      setField('apelidosppal', formValue.apellidosPpal);
      setField('telefonoppal', formValue.telefonoPpal);
      setField('emailppal', formValue.emailppal);

      // Formatear fecha de nacimiento a DD/MM/YYYY
      let fechaNacimientoFormateada = formValue.nacimiento;
      if (formValue.nacimiento) {
        const parts = formValue.nacimiento.split('-');
        if (parts.length === 3) {
          fechaNacimientoFormateada = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }
      setField('fecha_nacimientoppal', fechaNacimientoFormateada);

      setField('dnippal', formValue.dni);
      setField('dinppalfirma', formValue.dni); // Segundo campo de DNI en firmas
      setField('padronppal', (formValue.padron === 'true' || formValue.padron === true) ? 'SI' : 'NO');
      setField('alergias', formValue.alergias);

      // Contactos
      if (formValue.contactos && formValue.contactos.length > 0) {
        const c1 = formValue.contactos[0];
        setField('nombreapellidos contacto1', c1.nombreContacto);
        setField('email contacto1', c1.emailContacto);
        setField('telefono contacto1', c1.telefonoContacto);

        if (formValue.contactos.length > 1) {
          const c2 = formValue.contactos[1];
          setField('nombreapellidos contacto2', c2.nombreContacto);
          setField('email contacto2', c2.emailContacto);
          setField('telefonocontacto2', c2.telefonoContacto);
        }
      }

      // Datos del equipo
      const categoriaLabel = this.precios_temporada?.tarifas.find(t => t.id === formValue.categoria)?.categoria || formValue.categoria;
      setField('categoria', categoriaLabel);
      setField('tipopago', formValue.pago);

      const precio = this.detallePago?.precio;
      if (precio !== undefined) {
        setField('precio', `${precio}€ ${formValue.pago}`, true);
      }

      if (this.seguroYtasasCategoria !== null) {
        setField('seguroytasas', `${this.seguroYtasasCategoria}€`, true);
      }

      if (this.precios_temporada && this.precios_temporada.instalaciones) {
        setField('ayuntamiento', `${this.precios_temporada.instalaciones}€`, true);
      }

      setField('consentimiento', formValue.autFotos === 'true' ? 'SI' : 'NO');

      // Datos de Progenitores (en zona de firmas)
      setField('nombreapellidos tutor1', formValue.nombreP1);
      setField('dnitutor1', formValue.dniP1);
      setField('nombreyapellidos tutor2', formValue.nombreP2);
      setField('dnitutor2', formValue.dniP2);

      // Incrustar firmas usando los campos de firma del PDF para las coordenadas
      const embedSignatureInField = async (base64Data: string, fieldName: string) => {
        if (!base64Data) return;
        try {
          const field = form.getField(fieldName);
          const widgets = field.acroField.getWidgets();
          if (widgets.length > 0) {
            const widget = widgets[0];
            const rect = widget.getRectangle();
            const signatureImageBytes = await fetch(base64Data).then(res => res.arrayBuffer());
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

            // Dibujamos la imagen sobre el rectángulo del campo de firma
            firstPage.drawImage(signatureImage, {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            });
          }
        } catch (e) {
          console.warn(`No se pudo incrustar la firma en el campo ${fieldName}:`, e);
        }
      };

      // Asignamos las firmas según la edad actual
      if (!this.esMenor) {
        await embedSignatureInField(formValue.firmaJugador, 'firmappal');
      } else {
        await embedSignatureInField(formValue.firmaP1, 'firmatutor1');
        await embedSignatureInField(formValue.firmaP2, 'firmatutor2');
      }

      // Rellenar y Bloquear el PDF
      try {
        const fields = form.getFields();
        fields.forEach(field => {
          try {
            // Generamos apariencia para todos los campos antes de aplanar
            if ('setText' in field) {
              (field as any).updateAppearances(font);
            }
          } catch (e) { }
        });

        // Bloqueamos el PDF definitivamente
        form.flatten();
      } catch (e) {
        console.warn('Error al aplanar, aplicando solo lectura:', e);
        try {
          form.getFields().forEach(f => {
            if ('enableReadOnly' in f) (f as any).enableReadOnly();
          });
        } catch (err) { }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Inscripcion_${formValue.nombrePpal}_${formValue.apellidosPpal}.pdf`;
      link.click();

    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
  }

  calcularHoy(): void {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = today.getFullYear();
    this.hoy = year + '-' + month + '-' + day;
  }

  anadirContacto() {
    this.contactos.push(this.crearContacto());
  }

  borrarContacto(index: number) {
    if (this.contactos.length > 1) {
      this.contactos.removeAt(index);
    }
  }

  get opcionesPagoLista(): { value: string, label: string }[] {
    const categoriaId = this.inscripcion.get('categoria')?.value;
    if (!categoriaId || !this.precios_temporada) return [];
    const tarifa = this.precios_temporada.tarifas.find(t => t.id === categoriaId);
    if (!tarifa) return [];
    return Object.keys(tarifa.opciones).map(key => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1)
    }));
  }

  get detallePago(): { precio: number, ahorro: number } | null {
    const categoriaId = this.inscripcion.get('categoria')?.value;
    const pagoKey = this.inscripcion.get('pago')?.value;
    if (!categoriaId || !pagoKey || !this.precios_temporada) return null;
    const tarifa = this.precios_temporada.tarifas.find(t => t.id === categoriaId);
    if (tarifa && (tarifa.opciones as any)[pagoKey]) {
      return (tarifa.opciones as any)[pagoKey];
    }
    return null;
  }

  get seguroYtasasCategoria(): number | null {
    const categoriaId = this.inscripcion.get('categoria')?.value;
    if (!categoriaId || !this.precios_temporada) return null;
    const tarifa = this.precios_temporada.tarifas.find(t => t.id === categoriaId);
    return tarifa ? tarifa.seguroYtasas : null;
  }

  // --- Lógica de Firma (Canvas) ---

  ngAfterViewInit() {
    // Las inicializaciones se manejan ahora mediante los setters de @ViewChild
  }

  private initCanvas(id: string) {
    const canvas = id === 'canvasJugador' ? this._canvasJugador?.nativeElement :
      id === 'canvasP1' ? this._canvasP1?.nativeElement :
        this._canvasP2?.nativeElement;

    if (canvas) {
      this.ctx[id] = canvas.getContext('2d');
      if (this.ctx[id]) {
        this.ctx[id]!.lineWidth = 2;
        this.ctx[id]!.lineJoin = 'round';
        this.ctx[id]!.lineCap = 'round';
        this.ctx[id]!.strokeStyle = '#000';
      }
    }
  }

  startDrawing(event: MouseEvent | TouchEvent, id: string) {
    this.drawing = true;
    const pos = this.getPos(event, id);
    this.ctx[id]?.beginPath();
    this.ctx[id]?.moveTo(pos.x, pos.y);
    event.preventDefault();
  }

  draw(event: MouseEvent | TouchEvent, id: string) {
    if (!this.drawing) return;
    const pos = this.getPos(event, id);
    this.ctx[id]?.lineTo(pos.x, pos.y);
    this.ctx[id]?.stroke();
    event.preventDefault();
  }

  stopDrawing(id: string) {
    if (this.drawing) {
      this.drawing = false;
      this.saveSignature(id);
    }
  }

  private getPos(event: any, id: string) {
    const canvas = id === 'canvasJugador' ? this._canvasJugador?.nativeElement :
      id === 'canvasP1' ? this._canvasP1?.nativeElement :
        this._canvasP2?.nativeElement;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  private saveSignature(id: string) {
    const canvas = id === 'canvasJugador' ? this._canvasJugador?.nativeElement :
      id === 'canvasP1' ? this._canvasP1?.nativeElement :
        this._canvasP2?.nativeElement;
    const controlName = id === 'canvasJugador' ? 'firmaJugador' :
      id === 'canvasP1' ? 'firmaP1' : 'firmaP2';

    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      this.inscripcion.get(controlName)?.setValue(dataUrl);
    }
  }

  clearSignature(id: string) {
    const canvas = id === 'canvasJugador' ? this._canvasJugador?.nativeElement :
      id === 'canvasP1' ? this._canvasP1?.nativeElement :
        this._canvasP2?.nativeElement;
    const controlName = id === 'canvasJugador' ? 'firmaJugador' :
      id === 'canvasP1' ? 'firmaP1' : 'firmaP2';

    if (canvas && this.ctx[id]) {
      this.ctx[id]!.clearRect(0, 0, canvas.width, canvas.height);
      this.inscripcion.get(controlName)?.setValue('');
    }
  }
}
