import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaAdminComponent } from './ventana-admin.component';

describe('VentanaAdminComponent', () => {
  let component: VentanaAdminComponent;
  let fixture: ComponentFixture<VentanaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentanaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
