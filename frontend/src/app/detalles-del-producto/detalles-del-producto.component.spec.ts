import { TestBed } from '@angular/core/testing';
import { DetallesDelProductoComponent } from './detalles-del-producto.component';
import { ProductoService } from '../core/services/producto.service';
import { BuscarProdService } from '../core/services/buscarprod.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa este módulo
import { of } from 'rxjs';
import { AuthService } from '../core/services/auth.service'; // Agregar esta línea


// Stub para AuthService
class AuthServiceStub {
  isLoggedIn = true;
  user = { name: 'Test User' };
}

describe('DetallesDelProductoComponent', () => {
  let component: DetallesDelProductoComponent;
  let productoServiceStub: Partial<ProductoService>;
  let buscarProdServiceStub: Partial<BuscarProdService>;
  let mockActivatedRoute: any;
  let mockLocation: any;

  beforeEach(async () => {
    productoServiceStub = {
      getProductByName: jasmine.createSpy('getProductByName').and.returnValue({ image: 'test-image-url' }),
    };

    buscarProdServiceStub = {
      getProductByName: jasmine.createSpy('getProductByName').and.returnValue(of({ unidades: 10 })),
    };

    mockActivatedRoute = {
      paramMap: of({ get: () => '1' }),
    };

    mockLocation = {
      back: jasmine.createSpy('back'),
    };

    await TestBed.configureTestingModule({
      imports: [
        DetallesDelProductoComponent, // Componente standalone
        HttpClientTestingModule, // Importa para resolver dependencias de HttpClient
      ],
      providers: [
        { provide: ProductoService, useValue: productoServiceStub },
        { provide: BuscarProdService, useValue: buscarProdServiceStub },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
        { provide: AuthService, useClass: AuthServiceStub }, // Provee un stub para AuthService
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DetallesDelProductoComponent);
    component = fixture.componentInstance;
  });

  it('debe calcular el precio sin IVA correctamente', () => {
    component.product = { precio: 100, iva: false }; // Producto sin IVA
    component.calculatePrecioIva();
    expect(component.precioIva).toBeNull(); // No debe calcularse precio con IVA
  });
  
  it('debe verificar correctamente las unidades disponibles desde el backend', () => {
    component.product = { nombre: 'Producto Test' }; // Producto con nombre definido
    component.verificarUnidades();
    expect(component.unidadesBackend).toBe(10); // Verifica que las unidades coincidan con las del backend simulado
  });
  
  it('debe deshabilitar el botón incrementar cuando se alcanza el límite de unidades', () => {
    component.unidadesBackend = 5; // Establece el límite de unidades desde el backend
    component.cantidad = 5; // Cantidad igual al límite
    component.actualizarEstadoBoton();
    expect(component.botonDeshabilitado).toBeTrue(); // El botón debe estar deshabilitado
  });
  
  it('debe incrementar correctamente la cantidad si no se alcanza el límite', () => {
    component.unidadesBackend = 10; // Límite de unidades
    component.cantidad = 5; // Cantidad inicial
    component.incrementar();
    expect(component.cantidad).toBe(6); // La cantidad debe incrementarse
    expect(component.botonDeshabilitado).toBeFalse(); // El botón no debe estar deshabilitado
  });
  
  it('debe decrementar correctamente la cantidad sin pasar del límite inferior', () => {
    component.cantidad = 2; // Cantidad inicial
    component.decrementar();
    expect(component.cantidad).toBe(1); // La cantidad debe decrementarse
    expect(component.botonDeshabilitado).toBeFalse(); // El estado del botón no se ve afectado al decrementar
  });
  
  it('debe regresar a la página anterior al llamar goBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate'); // Espía el método navigate
    component.goBack();
    expect(routerSpy).toHaveBeenCalledWith(['/']); // Verifica que navega al inicio
  });   
});