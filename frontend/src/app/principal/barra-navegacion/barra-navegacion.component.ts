//barra-navegacion.component.ts 
import { Component, ViewChild, AfterViewInit, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../perfil-usuario/modal.component';
import { BarraDeBusquedaComponent } from '../barra-de-busqueda/barra-de-busqueda.component';
import { NotificacionesModalComponent } from '../../notificaciones-modal/notificaciones-modal.component';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, ModalComponent, BarraDeBusquedaComponent, NotificacionesModalComponent],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class BarraNavegacionComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(ModalComponent) perfilModal!: ModalComponent;
  @ViewChild(NotificacionesModalComponent) notificacionesModal!: NotificacionesModalComponent;

  notificacionesNoLeidas: number = 0;
  // Array de notificaciones
  notificaciones: { producto: string, leido: boolean }[] = [];

  // Suscripción para las notificaciones
  private notificacionesSubscription: Subscription | undefined;

  constructor(private router: Router, private notificacionesService: NotificacionesService) {}

  ngOnInit() {
    this.notificacionesService.notificaciones$.subscribe((notificaciones) => {
      this.notificaciones = notificaciones.map(n => ({
        producto: n.mensaje, 
        leido: false 
      }));
    });
  }
  

  ngAfterViewInit() {
    if (!this.perfilModal) {
      console.warn('El modal de perfil no se ha inicializado correctamente.');
    } else {
      console.log('Modal de perfil inicializado.');
    }
  }

  ngOnDestroy() {
    // Nos aseguramos de cancelar la suscripción cuando el componente se destruya
    if (this.notificacionesSubscription) {
      this.notificacionesSubscription.unsubscribe();
    }
  }


  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irInicio() {
    if (this.router.url === '/home') {
      window.scrollTo(0, 0);
    } else {
      this.router.navigate(['/home']).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
  
  actualizarContador(nuevoContador: number) {
    this.notificacionesNoLeidas = nuevoContador;
  }

  irCatalogo() {
    this.router.navigate(['/home'], { fragment: 'catalogo' });
  }

  abrirModalPerfil() {
    if (this.perfilModal) {
      this.perfilModal.toggleModal();
    } else {
      console.error('El modal de perfil no está disponible');
    }
  }

  irNosotros(){
    this.router.navigate(['about']);
  }

  abrirNotificaciones() {
    if (this.notificacionesModal) {
      this.notificacionesModal.toggleModal();
    } else {
      console.error('El modal de notificaciones no está disponible');
    }
  }
}