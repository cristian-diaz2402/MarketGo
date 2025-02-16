import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionDelProductoComponent } from './edicion-del-producto.component';

describe('EdicionDelProductoComponent', () => {
  let component: EdicionDelProductoComponent;
  let fixture: ComponentFixture<EdicionDelProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionDelProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionDelProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
