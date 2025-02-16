//inactividad.services.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactividadService {
  private inactividadMaxima = 5 * 60 * 1000; // 15 minutos en milisegundos
  private temporizador: any;
  private tiempoExpiracion: number | null = null; // Guardar la marca de tiempo cuando expira la sesión


  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  iniciarDeteccion(): void {
    this.reiniciarTemporizador();
    this.escucharEventos();
    this.detectarCambioDePestania();
  }

  private escucharEventos(): void {
    const eventos = ['mousemove', 'keydown', 'click', 'scroll'];
    eventos.forEach(evento => {
      window.addEventListener(evento, () => this.reiniciarTemporizador());
    });
  }

  private reiniciarTemporizador(): void {
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this.cerrarSesionPorInactividad();
    }, this.inactividadMaxima);
    this.tiempoExpiracion = Date.now() + this.inactividadMaxima; // Guardar el tiempo de expiración
  }

  private cerrarSesionPorInactividad(): void {
    this.ngZone.run(() => {
      console.warn('Sesión cerrada por inactividad');
      this.authService.logout(); // Llamar al servicio de autenticación
      this.router.navigate(['/login']).then(() => {
        window.location.reload(); // Recargar la página después de cerrar sesión
      });
    });
    }

    private detectarCambioDePestania(): void {
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden) { // Cuando el usuario regresa a la pestaña
            const ahora = Date.now();
            if (this.tiempoExpiracion && ahora >= this.tiempoExpiracion) {
              console.warn('Sesión cerrada porque el usuario regresó después de la expiración.');
              this.cerrarSesionPorInactividad();
            }
          }
        });
      }
}
