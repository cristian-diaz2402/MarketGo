//boton-registrar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-boton-registrar',
  standalone: true,
  templateUrl: './boton-registrar.component.html',
  styleUrls: ['./boton-registrar.component.css'],
  imports: [CommonModule] // Agregar CommonModule al array de imports
})
export class BotonRegistrarComponent {
  @Input() isCaptchaValid: boolean = false;
  @Input() isOtherButtonDisabled: boolean = false; // Nueva propiedad
  @Output() authProcessStarted = new EventEmitter<void>(); // Nuevo evento
  @Output() authProcessEnded = new EventEmitter<void>();   // Nuevo evento
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  async signUpWithGoogle(): Promise<void> {
    if (!this.isCaptchaValid) {
      this.toastr.error('Por favor, complete el CAPTCHA primero.');
      return;
    }

    this.isLoading = true;
    this.authProcessStarted.emit();

    try {
      await this.authService.signInWithGoogleProvider();
      const idToken = await this.authService.getIdToken();

      if (idToken) {
        const response = await fetch('https://backend-marketgo.onrender.com/registerUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken })
        });

        const data = await response.json();

        if (data.isValid) {
          if (data.registrado) {
            this.toastr.success(data.mensaje);
            this.userService.setUser(data.usuario);
            this.router.navigate(['home']);
          } else {
            this.toastr.error(data.mensaje);
          }
        } else {
          this.toastr.warning(data.mensaje);
        }
      } else {
        throw new Error('Token no generado');
      }
    } catch (error: unknown) {
    // Refinar el tipo del error antes de usarlo
    if (error instanceof Error) {
      if (error.message === 'Proceso de autenticación cancelado.') {
        this.toastr.info('Proceso de autenticación cancelado por el usuario.');
      } else {
        console.error('Error al registrar usuario:', error.message);
        this.toastr.error('Ocurrió un error. Inténtelo de nuevo.');
      }
    } else {
      console.error('Error desconocido:', error);
      this.toastr.error('Ocurrió un error inesperado. Inténtelo de nuevo.');
    }
    } finally {
      this.isLoading = false;
      this.authProcessEnded.emit();
    }
  }
}
