import { ComponentFixture, TestBed } from '@angular/core/testing';

import LacteosComponent from './lacteos.component';

describe('LacteosComponent', () => {
  let component: LacteosComponent;
  let fixture: ComponentFixture<LacteosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LacteosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LacteosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
