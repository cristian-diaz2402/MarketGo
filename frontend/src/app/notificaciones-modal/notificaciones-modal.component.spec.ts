import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesModalComponent } from './notificaciones-modal.component';

describe('NotificacionesModalComponent', () => {
  let component: NotificacionesModalComponent;
  let fixture: ComponentFixture<NotificacionesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
