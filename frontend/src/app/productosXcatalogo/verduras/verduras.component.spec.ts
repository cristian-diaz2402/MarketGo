import { ComponentFixture, TestBed } from '@angular/core/testing';

import  VerdurasComponent  from './verduras.component';

describe('VerdurasComponent', () => {
  let component: VerdurasComponent;
  let fixture: ComponentFixture<VerdurasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerdurasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerdurasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
