import { TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// Stub para AuthService
class AuthServiceStub {
  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());
}

// Stub para UserService
class UserServiceStub {
  private user = { name: 'Test User', email: 'test@example.com', picture: 'test-picture-url' };
  getUser = jasmine.createSpy('getUser').and.returnValue(this.user);
  setUser = jasmine.createSpy('setUser');
}

// Stub para Router
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let authService: AuthServiceStub;
  let userService: UserServiceStub;
  let router: RouterStub;

  beforeEach(async () => {
    authService = new AuthServiceStub();
    userService = new UserServiceStub();
    router = new RouterStub();

    await TestBed.configureTestingModule({
      imports: [ModalComponent], // Componente standalone
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar los datos del usuario al inicializar', () => {
    component.ngOnInit();
    expect(component.user).toEqual({ name: 'Test User', email: 'test@example.com', picture: 'test-picture-url' });
    expect(userService.getUser).toHaveBeenCalled();
  });

  it('debería alternar el estado del modal al llamar toggleModal', () => {
    expect(component.isModalOpen).toBeFalse();
    component.toggleModal();
    expect(component.isModalOpen).toBeTrue();
    expect(userService.getUser).toHaveBeenCalled();
  });

  it('debería cerrar el modal y cerrar sesión al llamar closeModalAndLogout', async () => {
    await component.closeModalAndLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(userService.setUser).toHaveBeenCalledWith(null);
    expect(component.isModalOpen).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería cerrar solo el modal al llamar closeModal', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
  });

  it('debería no cambiar el estado del modal si no se llama closeModal o toggleModal', () => {
    expect(component.isModalOpen).toBeFalse();
  });
});
