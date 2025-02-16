import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private notificacionesSubject = new BehaviorSubject<{ producto: string, leido: boolean }[]>([]);
  notificaciones$ = this.notificacionesSubject.asObservable();

  constructor() {
    this.cargarNotificaciones();
  }

  private cargarNotificaciones() {
    const productosSinUnidades = [
      { producto: 'Producto D', leido: false },
    ];
    
    of(productosSinUnidades).pipe(delay(1000)).subscribe(data => {
      this.notificacionesSubject.next(data);
    });
  }

  // Método para marcar una notificación como leída
  marcarLeida(notificacion: { producto: string, leido: boolean }): Observable<{ producto: string, leido: boolean }[]> {
    return this.notificaciones$.pipe(
      map(notificaciones => {
        // Encontramos la notificación en el array y la marcamos como leída
        return notificaciones.map(n => 
          n.producto === notificacion.producto ? { ...n, leido: true } : n
        );
      }),
      tap(updatedNotificaciones => {
        // Actualizamos el BehaviorSubject con el array de notificaciones actualizado
        this.notificacionesSubject.next(updatedNotificaciones);
      }),
      delay(500) // Simulamos un delay para la actualización
    );
  }

  // Método para marcar todas las notificaciones como leídas
  marcarTodasComoLeidas(): Observable<{ producto: string, leido: boolean }[]> {
    return this.notificaciones$.pipe(
      map(notificaciones => notificaciones.map(n => ({ ...n, leido: true }))),
      tap(updatedNotificaciones => {
        this.notificacionesSubject.next(updatedNotificaciones);
      }),
      delay(500)
    );
  }

  // Método para obtener las notificaciones
  getProductosSinUnidades(): Observable<{ producto: string, leido: boolean }[]> {
    return this.notificaciones$;
  }
}