import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderismoPpalComponent } from './senderismo-ppal.component';

describe('SenderismoPpalComponent', () => {
  let component: SenderismoPpalComponent;
  let fixture: ComponentFixture<SenderismoPpalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenderismoPpalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenderismoPpalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
