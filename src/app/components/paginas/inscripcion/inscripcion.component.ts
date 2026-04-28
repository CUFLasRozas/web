import { Component } from '@angular/core';
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
    });
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
    if (dniControl) {
      if (age !== null && age < 14) {
        dniControl.clearValidators();
        dniControl.setValidators([this.dniValidator]);
      } else {
        dniControl.setValidators([Validators.required, Validators.minLength(9), this.dniValidator]);
      }
      dniControl.updateValueAndValidity();
    }

    const emailControl = this.inscripcion.get('emailppal');
    const telefonoControl = this.inscripcion.get('telefonoPpal');

    if (emailControl && telefonoControl) {
      if (age !== null && age < 18) {
        emailControl.setValidators([Validators.email]);
        telefonoControl.setValidators([Validators.pattern(/^[6-9]\d{8}$/)]);
      } else {
        emailControl.setValidators([Validators.required, Validators.email]);
        telefonoControl.setValidators([Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]);
      }
      emailControl.updateValueAndValidity();
      telefonoControl.updateValueAndValidity();
    }
  }

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
    const templatePath = 'assets/documentos/ficha_inscripcion_CUF_Las_Rozas.pdf';

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
        setField('Temporada', this.precios_temporada.temporada);
      }

      // Datos del jugador
      setField('nombre', formValue.nombrePpal);
      setField('apellidos_ppal', formValue.apellidosPpal);
      setField('telefono', formValue.telefonoPpal);
      setField('email_ppal', formValue.emailppal);
      setField('fnac_ppal', formValue.nacimiento);
      setField('dni_ppal', formValue.dni);
      setField('empadronado', (formValue.padron === 'true' || formValue.padron === true) ? 'SI' : 'NO');
      setField('alergias', formValue.alergias);

      // Contactos
      if (formValue.contactos && formValue.contactos.length > 0) {
        const c1 = formValue.contactos[0];
        setField('nombre_contacto1', c1.nombreContacto);
        setField('email_contacto1', c1.emailContacto);
        setField('telefono_contacto1', c1.telefonoContacto);

        if (formValue.contactos.length > 1) {
          const c2 = formValue.contactos[1];
          setField('nombre_contacto2', c2.nombreContacto);
          setField('email_contacto_2', c2.emailContacto);
          setField('telefono_contacto2', c2.telefonoContacto);
        }
      }

      // Datos del equipo
      const categoriaLabel = this.precios_temporada?.tarifas.find(t => t.id === formValue.categoria)?.categoria || formValue.categoria;
      setField('categoria', categoriaLabel);
      setField('tipo_pago', formValue.pago);

      const precio = this.detallePago?.precio;
      if (precio !== undefined) {
        setField('precio', `${precio}€ ${formValue.pago}. Ahorras ${this.detallePago?.ahorro}€`, true);
      }

      // Otros campos
      if (this.seguroYtasasCategoria !== null) {
        setField('tasayseguro', `${this.seguroYtasasCategoria}€`, true);
      }

      if (this.precios_temporada && this.precios_temporada.instalaciones) {
        setField('ayuntamiento', `${this.precios_temporada.instalaciones}€`, true);
      }

      setField('imagenes', formValue.autFotos === 'true' ? 'SI' : 'NO');

      // Rellenar DNIs en la parte de firmas para facilitar el trabajo
      setField('dni_jugador', formValue.dni);
      if (formValue.contactos && formValue.contactos.length > 0) {
        // Asumimos que el primer contacto es el tutor 1
        // Si el formulario tuviera campo DNI para contactos, lo usaríamos aquí
      }

      // Marcamos el PDF para que el visor genere las apariencias de los campos.
      // Esto mantiene los campos de firma intactos y visibles.
      form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True);

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

}
