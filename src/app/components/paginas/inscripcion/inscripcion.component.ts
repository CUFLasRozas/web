import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';




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
  contacto:number = 0;
  array_contactos: number[] = [0];
  hoy: string = "2024-12-12";
  regimenInternoChecked: boolean = false;

  constructor(private fb: FormBuilder){}

  ngOnInit() {
    this.calcularHoy();
    this.inscripcion = this.fb.group({
      nombrePpal: ['', Validators.required],
      apellidosPpal: ['', Validators.required],
      nacimiento: ['', Validators.required],
      emailppal: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(9)]],
      telefonoPpal: ['', [Validators.required, Validators.minLength(9)]],
      alergias: [''],
      padron: ['', Validators.required],
      nombreContacto0: ['', Validators.required],
      emailContacto0: ['', [Validators.required]],
      telefonoContacto0: ['', [Validators.required, Validators.minLength(9)]],
      autFotos: ['', Validators.required],
    })
  }

  changeRegimenInterno(){
    this.regimenInternoChecked = !this.regimenInternoChecked;
  }
  onSubmit(){
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
    this.hoy = year+'-'+month+'-'+day;
  }

  anadirCampos(){
    this.contacto++;
    this.array_contactos.push(this.contacto);
    this.inscripcion.addControl('nombreContacto'+ this.contacto, new FormControl( '', Validators.required));
    this.inscripcion.addControl('emailContacto'+this.contacto,  new FormControl('', [Validators.required]));
    this.inscripcion.addControl('telefonoContacto'+this.contacto,  new FormControl('', [Validators.required, Validators.minLength(9)]));
    
    // this.inscripcion.add
  }

}
