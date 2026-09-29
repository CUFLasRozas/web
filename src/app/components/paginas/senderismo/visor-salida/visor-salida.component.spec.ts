import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorSalidaComponent } from './visor-salida.component';

describe('VisorSalidaComponent', () => {
  let component: VisorSalidaComponent;
  let fixture: ComponentFixture<VisorSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorSalidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
