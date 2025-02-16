//hamburgesa.component.ts
import { Component, HostListener, ViewChild, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BarraDeBusquedaComponent } from '../barra-de-busqueda/barra-de-busqueda.component';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { NotificacionesModalComponent } from '../../notificaciones-modal/notificaciones-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hamburguesa',
  standalone: true,
  imports: [CommonModule, BarraDeBusquedaComponent, NotificacionesModalComponent],
  templateUrl: './hamburguesa.component.html',
  styleUrls: ['./hamburguesa.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HamburguesaComponent implements OnInit, OnDestroy {
  menuOpen: boolean = false;
  user: { name: string; email: string; picture: string; rol: string } | null = null;
  notificaciones: { producto: string, leido: boolean }[] = [];
  private notificacionesSubscription: Subscription | undefined;

  @ViewChild(NotificacionesModalComponent) notificacionesModal!: NotificacionesModalComponent;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private notificacionesService: NotificacionesService
  ) {
    this.user = this.userService.getUser(); 
  }

  ngOnInit() {
    this.notificacionesSubscription = this.notificacionesService.notificaciones$.subscribe(data => {
      this.notificaciones = data.map(n => ({ producto: n.mensaje, leido: n.leido }));
    });
  }
  

  ngOnDestroy() {
    // Nos aseguramos de cancelar la suscripción cuando el componente se destruya
    if (this.notificacionesSubscription) {
      this.notificacionesSubscription.unsubscribe();
    }
  }

  notificacionesNoLeidas: number = 0;

  actualizarContador(nuevoContador: number) {
    this.notificacionesNoLeidas = nuevoContador;
  }
  

  toggleMenu() {
    this.menuOpen = !this.menuOpen; 
    const menu = document.querySelector('.menu');
    if (menu) {
      if (this.menuOpen) {
        menu.classList.add('show'); 
      } else {
        menu.classList.remove('show'); 
      }
    }
  }

  async cerrarSesion() {
    try {
      await this.authService.logout(); 
      this.userService.setUser(null); 
      this.menuOpen = false; 
      this.router.navigate(['/login']); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  irAlInicio() {
    if (this.router.url === '/home') {
      window.scrollTo(0, 0);
    } else {
      this.router.navigate(['/home']).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  irCatalogo() {
    this.router.navigate(['/home'], { fragment: 'catalogo' });
  }

  irNosotros() {
    this.router.navigate(['about']);
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']); 
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const menuElement = document.querySelector('.menu');
    const hamburguesaButton = document.querySelector('.hamburguesa-button');

    if (menuElement && hamburguesaButton && !menuElement.contains(event.target as Node) && !hamburguesaButton.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.menuOpen = false;
  }

  changeUserRole() {
    const currentRoute = this.router.url; 
    if (currentRoute === '/inventario') {
      this.router.navigate(['/home']); 
    } else {
      this.router.navigate(['/inventario']); 
    }
  }

  abrirNotificaciones() {
    if (this.notificacionesModal) {
      this.notificacionesModal.toggleModal();
    } else {
      console.error('El modal de notificaciones no está disponible');
    }
  }
}