import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarruselComponent } from './carrusel.component';
import { CommonModule } from '@angular/common';

describe('CarruselComponent', () => {
  let component: CarruselComponent;
  let fixture: ComponentFixture<CarruselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselComponent, CommonModule] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el activeIndex inicial en 0', () => {
    expect(component.activeIndex).toBe(0);
  });

  it('debería tener una lista de imágenes', () => {
    expect(component.images.length).toBeGreaterThan(0);
  });

  it('debería ir a la siguiente imagen con next()', () => {
    const initialIndex = component.activeIndex;
    component.next();
    expect(component.activeIndex).toBe((initialIndex + 1) % component.images.length);
  });

  it('debería ir a la imagen anterior con prev()', () => {
    const initialIndex = component.activeIndex;
    component.prev();
    expect(component.activeIndex).toBe((initialIndex - 1 + component.images.length) % component.images.length);
  });

  it('debería establecer correctamente el activeIndex con setActive()', () => {
    const index = 2;
    component.setActive(index);
    expect(component.activeIndex).toBe(index);
  });

  it('debería llamar a reloadSlider cuando se invoque next()', () => {
    spyOn(component, 'reloadSlider');
    component.next();
    expect(component.reloadSlider).toHaveBeenCalled();
  });

  it('debería llamar a reloadSlider cuando se invoque prev()', () => {
    spyOn(component, 'reloadSlider');
    component.prev();
    expect(component.reloadSlider).toHaveBeenCalled();
  });

  it('debería llamar a reloadSlider cuando se invoque setActive()', () => {
    spyOn(component, 'reloadSlider');
    const index = 2;
    component.setActive(index);
    expect(component.reloadSlider).toHaveBeenCalled();
  });

  it('debería cambiar la imagen automáticamente cada 3 segundos', (done) => {
    const initialIndex = component.activeIndex;
    component.autoChangeImage();
    setTimeout(() => {
      expect(component.activeIndex).toBe((initialIndex + 1) % component.images.length);
      done();
    }, 3100); 
  });
});
