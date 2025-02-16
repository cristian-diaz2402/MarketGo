import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BuscarProdService } from '../core/services/buscarprod.service';

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  picture: string;
}

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdministracionComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private buscarProdService: BuscarProdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buscarProdService.getAdmins().subscribe({
      next: (response) => {
        this.usuarios = response.administradores.map((admin: any) => ({
          id: admin.id,
          nombre: admin.name,
          correo: admin.email,
          rol: admin.rol,
          picture: admin.picture,
        }));
      },
      error: (error) => {
        console.error('Error al cargar administradores:', error);
        alert('No se pudieron cargar los administradores. Inténtelo más tarde.');
      },
    });
  }

  // Añadimos la función eliminarUsuario
  eliminarUsuario(usuario: Usuario): void {
    this.buscarProdService.eliminarAdmin(usuario.id).subscribe({
      next: () => {
        // Actualizar la lista local de usuarios
        this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
        console.log(`Usuario ${usuario.nombre} eliminado con éxito.`);
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        alert(`No se pudo eliminar el usuario ${usuario.nombre}. Inténtelo más tarde.`);
      },
    });
  }

  // Nueva función para agregar un nuevo usuario
  agregarNuevoUsuario(): void {
    this.router.navigate(['/ventana-admin']);
  }

  // Función para regresar al inventario
  regresarAlInventario(): void {
    this.router.navigate(['/inventario']);
  }
}