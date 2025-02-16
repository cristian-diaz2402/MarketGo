import { ComponentFixture, TestBed } from '@angular/core/testing';

import  AseoPersonalComponent  from './aseo-personal.component';

describe('AseoPersonalComponent', () => {
  let component: AseoPersonalComponent;
  let fixture: ComponentFixture<AseoPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AseoPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AseoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
