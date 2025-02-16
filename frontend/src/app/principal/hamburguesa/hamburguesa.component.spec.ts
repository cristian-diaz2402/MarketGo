import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburguesaComponent } from './hamburguesa.component';

describe('HamburguesaComponent', () => {
  let component: HamburguesaComponent;
  let fixture: ComponentFixture<HamburguesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HamburguesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HamburguesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
