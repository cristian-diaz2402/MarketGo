// notificaciones-modal.component.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificacionesService } from '../core/services/notificaciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones-modal.component.html',
  styleUrls: ['./notificaciones-modal.component.css']
})
export class NotificacionesModalComponent {
  @Input() notificaciones: { producto: string, leido: boolean }[] = [];
  @Output() actualizarContador = new EventEmitter<number>(); // Para actualizar la barra de navegación

  isModalOpen = false;
  notificationCount: number = 0;

  constructor(private notificacionesService: NotificacionesService) {}

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
  ngOnInit() {
    this.notificacionesService.notificaciones$.subscribe(notificaciones => {
      this.notificaciones = notificaciones.map(n => ({ producto: n.mensaje, leido: n.leido }));
      this.actualizarContadorNotificaciones();
    });
  }
  
  cargarNotificaciones() {
    this.notificaciones = this.notificacionesService.obtenerNotificaciones();
    this.actualizarContadorNotificaciones();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  actualizarContadorNotificaciones() {
    this.notificationCount = this.notificaciones.filter(n => !n.leido).length;
    this.actualizarContador.emit(this.notificationCount); // Enviar actualización a la barra de navegación
  }

  // Marca una notificación individual como leída
  marcarLeida(notificacion: { producto: string; leido: boolean }) {
    if (!notificacion.leido) {
      notificacion.leido = true;
      this.notificationCount--;
      this.notificacionesService.marcarLeida(notificacion.producto).subscribe();
    }
  }
  
  marcarTodasComoLeidas() {
    this.notificacionesService.marcarTodasComoLeidas().subscribe(() => {
      this.notificaciones.forEach(n => n.leido = true);
      this.notificationCount = 0;
      this.actualizarContador.emit(this.notificationCount);
    });
  }
  
  eliminarNotificaciones() {
    this.notificacionesService.limpiarNotificaciones(); // Borra de localStorage
    this.notificaciones = []; // Limpia la vista
    this.notificationCount = 0;
    this.actualizarContador.emit(this.notificationCount); // Actualiza la barra de navegación
  }
  
}