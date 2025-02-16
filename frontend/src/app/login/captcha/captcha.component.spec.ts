import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaptchaComponent } from './captcha.component';

describe('CaptchaComponent', () => {
  let component: CaptchaComponent;
  let fixture: ComponentFixture<CaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptchaComponent], // Importa el componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe generar un captcha válido al inicializar', () => {
    spyOn(component, 'createCaptcha').and.callThrough();
    component.ngOnInit();
    expect(component.createCaptcha).toHaveBeenCalled();
    expect(component.code).toBeTruthy();
    expect(component.code.length).toBe(6); // Asegura que el captcha tenga la longitud correcta
  });


  it('debe emitir false y generar un nuevo captcha si el ingresado es incorrecto', () => {
    const mockEvent = { preventDefault: () => {} } as Event;
    spyOn(component, 'createCaptcha');
    spyOn(component.captchaValidated, 'emit');
    
    // Configurar el captcha generado
    component.code = 'ABC123';

    // Crear el campo de entrada en el DOM
    const inputElement = document.createElement('input');
    inputElement.id = 'cpatchaTextBox';
    inputElement.value = 'WRONG'; // Simula una entrada incorrecta
    document.body.appendChild(inputElement);

    // Ejecutar la validación
    component.validateCaptcha(mockEvent);

    // Verificar resultados
    expect(component.isValidCaptcha).toBeFalse();
    expect(component.captchaValidated.emit).toHaveBeenCalledWith(false);
    expect(component.createCaptcha).toHaveBeenCalled();

    // Limpiar el DOM
    document.body.removeChild(inputElement);
  });

  it('debe generar un nuevo captcha cuando se llama a createCaptcha', () => {
    const previousCode = component.code;
    component.createCaptcha();
    expect(component.code).toBeTruthy();
    expect(component.code).not.toBe(previousCode); // Asegura que el captcha cambie
  });

  it('debe generar un canvas con el captcha visual', () => {
    component.createCaptcha();
    const canvasElement = document.getElementById('captchaCanvas') as HTMLCanvasElement;
    expect(canvasElement).toBeTruthy();
    expect(canvasElement.tagName).toBe('CANVAS');
  });
});