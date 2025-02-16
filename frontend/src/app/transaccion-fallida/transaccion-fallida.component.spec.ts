import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionFallidaComponent } from './transaccion-fallida.component';

describe('TransaccionFallidaComponent', () => {
  let component: TransaccionFallidaComponent;
  let fixture: ComponentFixture<TransaccionFallidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionFallidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransaccionFallidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
