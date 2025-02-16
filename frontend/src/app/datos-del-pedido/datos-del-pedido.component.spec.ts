import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatosDelPedidoComponent } from './datos-del-pedido.component';
import { ValidacionesService } from '../services/validaciones.service';
import { CarritoService } from '../core/services/carrito.service';
import { of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

describe('DatosDelPedidoComponent', () => {
  let component: DatosDelPedidoComponent;
  let fixture: ComponentFixture<DatosDelPedidoComponent>;
  let httpTestingController: HttpTestingController;
  let validacionesService: ValidacionesService;
  let carritoService: CarritoService;
  let router: Router;

  beforeEach(async () => {
    const mockValidacionesService = {
      validarNombre: jasmine.createSpy('validarNombre').and.returnValue(''),
      validarCorreo: jasmine.createSpy('validarCorreo').and.returnValue(''),
      validarTelefono: jasmine.createSpy('validarTelefono').and.returnValue(''),
      validarDireccion: jasmine.createSpy('validarDireccion').and.returnValue(''),
      validarCedula: jasmine.createSpy('validarCedula').and.returnValue('')
    };

    const mockCarritoService = {
      cartItems$: new BehaviorSubject<any[]>([]),
      cartSummary$: new BehaviorSubject({ subtotal: 0, iva: 0, total: 0 }),
      getCartItems: jasmine.createSpy('getCartItems').and.returnValue([]),
      sendCartData: jasmine.createSpy('sendCartData')
    };

    await TestBed.configureTestingModule({
      imports: [
        DatosDelPedidoComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: ValidacionesService, useValue: mockValidacionesService },
        { provide: CarritoService, useValue: mockCarritoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelPedidoComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    validacionesService = TestBed.inject(ValidacionesService);
    carritoService = TestBed.inject(CarritoService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el método de pago seleccionado', () => {
    spyOn(component.paymentMethodSelected, 'emit');

    component.onPaymentMethodChange({ target: { value: 'paypal' } } as unknown as Event);

    expect(component.selectedPaymentMethod).toBe('paypal');
    expect(component.paymentMethodSelected.emit).toHaveBeenCalledWith('paypal');
  });

  it('debería validar los datos del cliente correctamente', () => {
    component.datosCliente = {
      nombre: 'John Doe',
      correo: 'john.doe@example.com',
      telefono: '1234567890',
      direccion: '123 Street Name',
      cedula: '1234567890'
    };

    component.validarDatos();

    expect(validacionesService.validarNombre).toHaveBeenCalledWith('John Doe');
    expect(validacionesService.validarCorreo).toHaveBeenCalledWith('john.doe@example.com');
    expect(validacionesService.validarTelefono).toHaveBeenCalledWith('1234567890');
    expect(validacionesService.validarDireccion).toHaveBeenCalledWith('123 Street Name');
    expect(validacionesService.validarCedula).toHaveBeenCalledWith('1234567890');
  });

  it('debería manejar errores al enviar datos al backend', fakeAsync(() => {
    spyOn(window, 'alert');

    component.enviarDatosAlBackend();

    const req = httpTestingController.expectOne('https://backend-marketgo.onrender.com/payment/create-order');
    req.error(new ErrorEvent('Network error'));

    tick();

    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al procesar el pago. Inténtelo de nuevo.');
    flush();
  }));

  it('debería mostrar el popup cuando se llama a mostrarVentanaEmergente', () => {
    component.mostrarVentanaEmergente();
    expect(component.mostrarPopup).toBeTrue();
  });

  it('debería cancelar la acción y cerrar el popup', () => {
    component.mostrarPopup = true;
    component.cancelarAccion();
    expect(component.mostrarPopup).toBeFalse();
  });

  it('debería navegar al carrito al confirmar la acción 2', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.confirmarAccion2();
    expect(navigateSpy).toHaveBeenCalledWith(['carrito']);
  });
});
