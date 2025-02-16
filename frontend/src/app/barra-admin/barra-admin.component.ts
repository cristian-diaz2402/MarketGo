import { Component, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../principal/perfil-usuario/modal.component';
import { NotificacionesModalComponent } from '../notificaciones-modal/notificaciones-modal.component'; // Asegúrate de importar correctamente
import { NotificacionesService } from '../core/services/notificaciones.service'; // Asegúrate de importar correctamente

@Component({
  selector: 'app-barra-admin',
  standalone: true,
  imports: [CommonModule, ModalComponent, NotificacionesModalComponent],
  templateUrl: './barra-admin.component.html',
  styleUrls: ['./barra-admin.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class BarraAdminComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild(ModalComponent) perfilModal!: ModalComponent;
  @ViewChild('notificacionesModal') notificacionesModal!: NotificacionesModalComponent;

  isMenuOpen = false;  
  nombreUsuario = 'Juan Pérez';  
  private resizeListener: () => void; 
  notificacionesNoLeidas: number = 0;
  notificaciones: { producto: string, leido: boolean }[] = [];

  constructor(private router: Router, private notificacionesService: NotificacionesService) {
    this.resizeListener = this.onWindowResize.bind(this);
    this.notificacionesService.getProductosSinUnidades().subscribe(notificaciones => {
      this.notificaciones = notificaciones.map(n => ({
        producto: n.mensaje, 
        leido: false
      }));
      this.notificacionesNoLeidas = this.notificaciones.filter(n => !n.leido).length;
    });
  }
  

  abrirModalPerfil() {
    if (this.perfilModal) {
      this.perfilModal.toggleModal();
    } else {
      console.error('El modal de perfil no está disponible');
    }
  }

  ngAfterViewInit() {
    if (!this.perfilModal) {
      console.warn('El modal de perfil no se ha inicializado correctamente.');
    } else {
      console.log('Modal de perfil inicializado.');
    }
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  onWindowResize() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      console.log('Menú hamburguesa cerrado automáticamente al redimensionar.');
    }
  }

  navegarAGestionRoles() {
    this.router.navigate(['/administracion']);
  }

  // Método para cambiar el rol de usuario
  changeUserRole() {
    const currentRoute = this.router.url;
    if (currentRoute === '/inventario') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/inventario']);
    }
  }

  actualizarContador(nuevoContador: number) {
    this.notificacionesNoLeidas = nuevoContador;
  }
  // Método para abrir el modal de notificaciones
  abrirNotificaciones() {
    if (this.notificacionesModal) {
      this.notificacionesModal.toggleModal();
    } else {
      console.error('El modal de notificaciones no está disponible');
    }
  }
}