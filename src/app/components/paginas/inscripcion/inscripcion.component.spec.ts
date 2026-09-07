import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InscripcionComponent } from './inscripcion.component';
import { UtilesService } from '../../../service/utiles/utiles.service';
import { of } from 'rxjs';

describe('InscripcionComponent', () => {
  let component: InscripcionComponent;
  let fixture: ComponentFixture<InscripcionComponent>;

  beforeEach(async () => {
    const utilesServiceMock = {
      obtenerJson: jasmine.createSpy('obtenerJson').and.returnValue(of({ tarifas: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InscripcionComponent],
      providers: [
        { provide: UtilesService, useValue: utilesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should remove required validators from email and telefono if under 18', () => {
    const nacimiento = component.inscripcion.get('nacimiento');
    const emailppal = component.inscripcion.get('emailppal');
    const telefonoPpal = component.inscripcion.get('telefonoPpal');

    expect(emailppal?.hasError('required')).toBeTrue();
    expect(telefonoPpal?.hasError('required')).toBeTrue();

    // Set to minor
    nacimiento?.setValue('2026-04-03');

    expect(emailppal?.hasError('required')).toBeFalse();
    expect(telefonoPpal?.hasError('required')).toBeFalse();

    // Set to empty string and check if there are any other errors
    emailppal?.setValue('');
    telefonoPpal?.setValue('');

    console.log("Email errors:", emailppal?.errors);
    console.log("Telefono errors:", telefonoPpal?.errors);
  });
});
