import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotonRegistrarComponent } from './boton-registrar.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

describe('BotonRegistrarComponent', () => {
  let component: BotonRegistrarComponent;
  let fixture: ComponentFixture<BotonRegistrarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'signInWithGoogleProvider',
      'getIdToken',
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['setUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [BotonRegistrarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonRegistrarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia mostrar un error si el CAPTCHA es invalido', async () => {
    component.isCaptchaValid = false;
    await component.signUpWithGoogle();
    expect(toastr.error).toHaveBeenCalledWith('Por favor, complete el CAPTCHA primero.');
    expect(authService.signInWithGoogleProvider).not.toHaveBeenCalled();
  });

  it('Deberia manejar un registro exitoso', async () => {
    component.isCaptchaValid = true;

    // Mock para signInWithGoogleProvider
    authService.signInWithGoogleProvider.and.returnValue(
      Promise.resolve({ user: { uid: 'mockUid' } } as any) // Simulando UserCredential
    );

    // Mock para getIdToken
    authService.getIdToken.and.returnValue('mockIdToken'); // Devuelve directamente el token

    // Mock de fetch
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({
        isValid: true,
        registrado: true,
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
          name: 'Mock User',
          email: 'mockuser@example.com',
          picture: 'mock-picture-url',
        },
      })))
    );

    await component.signUpWithGoogle();

    expect(authService.signInWithGoogleProvider).toHaveBeenCalled();
    expect(authService.getIdToken).toHaveBeenCalled();
    expect(userService.setUser).toHaveBeenCalledWith({
      name: 'Mock User',
      email: 'mockuser@example.com',
      picture: 'mock-picture-url',
    });
    expect(router.navigate).toHaveBeenCalledWith(['home']);
    expect(toastr.success).toHaveBeenCalledWith('Usuario registrado exitosamente');
  });

  it('Debería manejar el escenario de usuario no registrado', async () => {
    component.isCaptchaValid = true;

    authService.signInWithGoogleProvider.and.returnValue(
      Promise.resolve({ user: { uid: 'mockUid' } } as any)
    );

    authService.getIdToken.and.returnValue('mockIdToken'); // Devuelve directamente el token

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({
        isValid: true,
        registrado: false,
        mensaje: 'Usuario no registrado',
      })))
    );

    await component.signUpWithGoogle();

    expect(authService.signInWithGoogleProvider).toHaveBeenCalled();
    expect(authService.getIdToken).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Usuario no registrado');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('Deberia manejar el caso de un token invalido', async () => {
    component.isCaptchaValid = true;

    authService.signInWithGoogleProvider.and.returnValue(
      Promise.resolve({ user: { uid: 'mockUid' } } as any)
    );

    authService.getIdToken.and.returnValue(null); // Simula un token no generado

    await component.signUpWithGoogle();

    expect(authService.signInWithGoogleProvider).toHaveBeenCalled();
    expect(authService.getIdToken).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Ocurrió un error. Inténtelo de nuevo.');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('Deberia manejar errores durante el registro', async () => {
    component.isCaptchaValid = true;

    authService.signInWithGoogleProvider.and.returnValue(
      Promise.resolve({ user: { uid: 'mockUid' } } as any)
    );

    authService.getIdToken.and.returnValue('mockIdToken'); // Devuelve directamente el token

    spyOn(window, 'fetch').and.returnValue(Promise.reject('Network error'));

    await component.signUpWithGoogle();

    expect(authService.signInWithGoogleProvider).toHaveBeenCalled();
    expect(authService.getIdToken).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Ocurrió un error. Inténtelo de nuevo.');
  });
});

