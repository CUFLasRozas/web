import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { PreciosTemporada } from '../../../models/precios_temporada';




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
  precios_temporada!: PreciosTemporada;

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
      console.log(this.inscripcion.value)
    } else {
      console.log('formulario invalido')
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
