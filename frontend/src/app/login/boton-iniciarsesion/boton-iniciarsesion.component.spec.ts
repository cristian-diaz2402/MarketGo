import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotonIniciarsesionComponent } from './boton-iniciarsesion.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthService {
  signInWithGoogleProvider = jasmine.createSpy('signInWithGoogleProvider').and.returnValue(Promise.resolve());
  getIdToken = jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve('mock-id-token'));
}

class MockUserService {
  setUser = jasmine.createSpy('setUser');
}

class MockToastrService {
  error = jasmine.createSpy('error');
  success = jasmine.createSpy('success');
  warning = jasmine.createSpy('warning');
}

describe('BotonIniciarsesionComponent', () => {
  let component: BotonIniciarsesionComponent;
  let fixture: ComponentFixture<BotonIniciarsesionComponent>;
  let authService: AuthService;
  let userService: UserService;
  let toastr: ToastrService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonIniciarsesionComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
        { provide: ToastrService, useClass: MockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BotonIniciarsesionComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    toastr = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia mostrar un error si el CAPTCHA no es valido', async () => {
    component.isCaptchaValid = false;

    await component.signInWithGoogle();

    expect(toastr.error).toHaveBeenCalledWith('Por favor, complete el CAPTCHA primero.');
    expect(authService.signInWithGoogleProvider).not.toHaveBeenCalled();
  });

  it('debería llamar a AuthService.signInWithGoogleProvider y manejar el éxito', async () => {
    component.isCaptchaValid = true;

    const mockResponse = {
        isValid: true,
        mensaje: 'El usuario ya existe',
        usuario: {
          name: 'Test User',
          email: 'testuser@example.com', // Añade las propiedades requeridas
          picture: 'https://example.com/profile.jpg' // Añade esta propiedad si es necesaria
        }
      };      

    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    } as Response));

    await component.signInWithGoogle();

    expect(authService.signInWithGoogleProvider).toHaveBeenCalled();
    expect(authService.getIdToken).toHaveBeenCalled();
    expect(userService.setUser).toHaveBeenCalledWith(mockResponse.usuario);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
    expect(toastr.success).toHaveBeenCalledWith('Bienvenido de nuevo');
  });

  it('Deberia manejar errores durante el proceso de sign-in', async () => {
    component.isCaptchaValid = true;
  
    (authService.signInWithGoogleProvider as jasmine.Spy).and.returnValue(Promise.reject('Error mock'));
  
    await component.signInWithGoogle();
  
    expect(toastr.error).toHaveBeenCalledWith('Ocurrió un error. Inténtelo de nuevo.');
  });
  

  it('Deberia manejar respuestas invalidas del servidor', async () => {
    component.isCaptchaValid = true;

    const mockResponse = {
      isValid: false,
      mensaje: 'Error al iniciar sesión.'
    };

    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    } as Response));

    await component.signInWithGoogle();

    expect(toastr.error).toHaveBeenCalledWith('Error al iniciar sesión.');
  });
});