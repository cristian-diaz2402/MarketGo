//notificaciones.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of  } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private notificaciones: { mensaje: string; timestamp: number; leido: boolean }[] = [];
  private notificacionesSubject = new BehaviorSubject<{ mensaje: string; timestamp: number; leido: boolean }[]>([]);

  notificaciones$ = this.notificacionesSubject.asObservable();

  constructor() {
    this.cargarDesdeLocalStorage();
  }

  private cargarDesdeLocalStorage() {
    const savedNotifications = localStorage.getItem('notificaciones');
    this.notificaciones = savedNotifications 
      ? JSON.parse(savedNotifications).map((n: any) => ({ ...n, leido: n.leido ?? false })) // Agrega 'leido' si falta
      : [];
      
    this.notificacionesSubject.next(this.notificaciones);
  }

  agregarNotificacion(mensaje: string) {
    if (!this.notificaciones.some(n => n.mensaje === mensaje)) { // Evita duplicados
      const nuevaNotificacion = { mensaje, timestamp: Date.now(), leido: false };
      this.notificaciones.unshift(nuevaNotificacion);
      localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
      this.notificacionesSubject.next(this.notificaciones);
    }
  }

  obtenerNotificaciones() {
    return this.notificaciones.map(n => ({
      producto: n.mensaje, // Renombramos "mensaje" a "producto"
      leido: n.leido
    }));
  }
  

  limpiarNotificaciones() {
    this.notificaciones = [];
    localStorage.removeItem('notificaciones');
    this.notificacionesSubject.next(this.notificaciones);
  }
  marcarLeida(mensaje: string): Observable<void> {
    this.notificaciones = this.notificaciones.map(n =>
      n.mensaje === mensaje ? { ...n, leido: true } : n
    );
    this.notificacionesSubject.next(this.notificaciones);
    localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
    return of(); // Retorna un Observable vacío para permitir `subscribe()`
  }
  
  marcarTodasComoLeidas(): Observable<void> {
    this.notificaciones = this.notificaciones.map(n => ({ ...n, leido: true }));
    this.notificacionesSubject.next(this.notificaciones);
    localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
    return of();
  }
  getProductosSinUnidades(): Observable<{ mensaje: string; timestamp: number; leido: boolean }[]> {
    return this.notificaciones$.pipe();
  }
}
