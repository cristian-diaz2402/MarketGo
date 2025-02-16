//modal.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  isModalOpen = false;
  user: { name: string; email: string; picture: string, rol:string } | null = null;
  userType: string = ''; // Esta variable debe existir o ser seteada desde otro lugar

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.userType = this.user?.rol || ''; // Asignar el rol si existe, de lo contrario, una cadena vacía
  }

  // Método para alternar la visibilidad del modal
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.user) {
      this.user = this.userService.getUser();
    }
  }

  // Método para cerrar el modal y cerrar sesión
  async closeModalAndLogout() {
    try {
      await this.authService.logout();
      this.userService.setUser(null);
      this.isModalOpen = false;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Método para cerrar solo el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para cambiar el rol de usuario
// Método para cambiar entre inventario y home
changeUserRole() {
  const currentRoute = this.router.url; // Obtiene la ruta actual
  if (currentRoute === '/inventario') {
    this.router.navigate(['/home']); // Si está en inventario, redirige a home
  } else {
    this.router.navigate(['/inventario']); // Si está en otra ruta, redirige a inventario
  }
}
}