import { TestBed, ComponentFixture, fakeAsync, flush, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BarraDeBusquedaComponent } from './barra-de-busqueda.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('BarraDeBusquedaComponent', () => {
  let component: BarraDeBusquedaComponent;
  let fixture: ComponentFixture<BarraDeBusquedaComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BarraDeBusquedaComponent, // Importar directamente el componente standalone
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarraDeBusquedaComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener sugerencias cuando se proporciona un término de búsqueda', fakeAsync(() => {
    const resultadosMock = [
      {
        id: "P029",
        nombre: "Naranja Navel",
        precio: 1.17,
        descripcion: "Producen un fruto sin semillas, con cáscara de color naranja intenso que se pela fácilmente, y tienen un sabor dulce y agradable",
        unidades: 10,
        catalogo: "frutas",
        cantidad: "350 G / 0.77 LB",
        iva: false
      }
    ];

    component.searchTerm$.next('naranja');
    tick(300); // Simula el tiempo de debounce

    const req = httpTestingController.expectOne('https://backend-marketgo.onrender.com/autosuggest?nombre=naranja');
    expect(req.request.method).toBe('GET');

    req.flush(resultadosMock);
    flush(); // Procesa las operaciones asíncronas
    fixture.detectChanges();

    expect(component.suggestions).toEqual(resultadosMock);
  }));

  it('debería manejar un término de búsqueda vacío', () => {
    component.searchTerm$.next('');
    expect(component.suggestions).toEqual([]);
  });

  it('debería navegar a los detalles al hacer clic en una sugerencia', () => {
    const sugerencia = {
      id: "P029",
      nombre: "Naranja Navel",
      precio: 1.17,
      descripcion: "Producen un fruto sin semillas, con cáscara de color naranja intenso que se pela fácilmente, y tienen un sabor dulce y agradable",
      unidades: 10,
      catalogo: "frutas",
      cantidad: "350 G / 0.77 LB",
      iva: false
    };
    const navigateSpy = spyOn(router, 'navigate');

    component.onSuggestionClick(sugerencia);

    expect(navigateSpy).toHaveBeenCalledWith(['/detalles', sugerencia.id], { state: { product: sugerencia } });
  });

  it('debería limpiar las sugerencias cuando se limpia el campo de entrada', () => {
    component.onInputChange({ target: { value: '' } } as unknown as Event);
    expect(component.suggestions).toEqual([]);
  });

  it('debería actualizar las sugerencias con una entrada válida', () => {
    const eventoMock = { target: { value: 'naranja' } } as unknown as Event;

    component.onInputChange(eventoMock);

    expect(component.searchTerm$.observers.length).toBeGreaterThan(0);
  });
});
