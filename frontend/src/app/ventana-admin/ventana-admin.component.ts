import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BuscarProdService } from '../core/services/buscarprod.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventana-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventana-admin.component.html',
  styleUrls: ['./ventana-admin.component.css']
})
export class VentanaAdminComponent {
  adminForm: FormGroup;
  isAdminFound: boolean = false;  // Para verificar si el admin existe
  searchQuery: string = '';       // Variable para la búsqueda
  isSearchActive: boolean = false;
  userRole: string | null = null;
  canAddAdmin: boolean = false; 
  showConfirmation: boolean = false;  // Variable para mostrar el modal de confirmación

  constructor(private toastr: ToastrService, private fb: FormBuilder, private buscarProdService: BuscarProdService, private router: Router) {
    this.adminForm = this.fb.group({
      search: ['', [Validators.required, Validators.email]], // Validaciones añadidas
      name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  userId: string | null = null; // Guardar el ID del usuario encontrado

  // Función que simula la búsqueda del admin
  searchAdmin() {
    const email = this.adminForm.get('search')?.value;
  
    // Validar que el campo no esté vacío y que tenga un formato de correo válido
    if (!email || !this.adminForm.get('search')?.valid) {
      this.toastr.warning('Por favor, ingrese un correo válido para buscar.');
      this.isSearchActive = false; // Desactivar el estado de búsqueda
      this.isAdminFound = false;  // Asegurarse de que no se muestre el mensaje ni el botón
      this.canAddAdmin = false;  // Deshabilitar el botón "Agregar"
      return; // Detener la ejecución
    }
  
    // Continuar con la búsqueda si el correo es válido
    this.isSearchActive = true; // Activar el estado de búsqueda
    this.buscarProdService.getUserByEmail(email).subscribe({
      next: (response) => {
        const user = response.usuario;
        this.isAdminFound = true;
        this.userId = user.id;
        this.userRole = user.rol;  // Guardar el rol del usuario
  
        this.adminForm.patchValue({
          name: user.name,
          email: user.email,
          rol: user.rol,
        });
  
        // Habilitar el botón "Agregar" solo si el rol es "cliente"
        this.canAddAdmin = this.userRole === 'cliente';
  
        // Mostrar en la consola el rol del usuario
        this.toastr.info(` ${user.name} es ${user.rol}`);
      },
      error: (err) => {
        console.error('Error al buscar usuario:', err);
        this.isAdminFound = false;
        this.userId = null; // Reiniciar el ID del usuario
  
        // Mensaje de correo no existente
        this.toastr.success('Este correo no existe, es hora de ser Parte de MarketGo!!.' );
        this.canAddAdmin = false;  // Deshabilitar el botón "Agregar" en caso de error
      },
    });
  }

  // Actualiza el estado del botón "Agregar"
  updateAddButtonState() {
    if (this.userRole === 'administrador') {
      // Deshabilitar el botón "Agregar" si el rol es "administrador"
      this.adminForm.get('name')?.disable();
      this.adminForm.get('email')?.disable();
    } else {
      // Habilitar el botón "Agregar" si el rol es "cliente"
      this.adminForm.get('name')?.enable();
      this.adminForm.get('email')?.enable();
    }
  }
 
  // Actualizamos el valor de la búsqueda a medida que se escribe
  onSearchChange() {
    const email = this.adminForm.get('search')?.value;
    // Si el campo está vacío, desactivar estados
    if (!email) {
      this.isSearchActive = false;
      this.isAdminFound = false;
      this.userId = null; // Reiniciar cualquier dato relacionado
      return;
    }
    // Actualizar la consulta actual
    this.searchQuery = email;
  }

  // Acción cuando el usuario hace click en "Invitar"
  onInviteClick() {
    const email = this.adminForm.get('search')?.value; // Obtener el correo del campo de búsqueda
  
    if (email) {
      this.buscarProdService.sendInvitation(email).subscribe({
        next: (response) => {
          console.log('Invitación enviada exitosamente:', response);
          this.toastr.success('Invitacion enviada exitosamente');
          this.isSearchActive = false;  // Ocultar mensaje y botón de invitar
          this.adminForm.get('search')?.setValue('');  // Limpiar campo de búsqueda
        },
        error: (err) => {
          console.error('Error al enviar la invitación:', err);
          this.toastr.error('Hubo un error al enviar la invitación');
        }
      });
    } else {
      this.toastr.warning('Por favor, ingrese un correo válido antes de enviar la invitación');
    }
  }

  // Función para abrir la ventana emergente de confirmación
  openConfirmationDialog() {
    this.showConfirmation = true;  // Mostrar el modal
  }

  // Confirmar la acción de agregar el administrador
  onConfirmAdd() {
    this.showConfirmation = false;  // Cerrar el modal

    // Llamar al método para agregar el administrador
    if (this.adminForm.valid && this.isAdminFound && this.userId) {
      this.buscarProdService.agregarAdmin(this.userId).subscribe({
        next: (response) => {
          console.log('Administrador agregado exitosamente:', response);
          this.toastr.success('Administrador agregado con éxito');
          this.adminForm.reset();
          this.isAdminFound = false;
          this.userId = null; // Reiniciar el ID del usuario
          this.isSearchActive = false;  // Ocultar mensaje y botón de invitar
          this.adminForm.get('search')?.setValue('');  // Limpiar campo de búsqueda
        },
        error: (err) => {
          console.error('Error al agregar administrador:', err);
          this.toastr.error('No se pudo agregar al administrador');
        }
      });
    } else {
      this.toastr.warning('Por favor, complete los campos correctamente.');
    }
  }

  // Función para cancelar la acción y cerrar el modal
  onCancelAdd() {
    this.showConfirmation = false;  // Cerrar el modal
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    // Se ha manejado en el modal de confirmación
  }
  
  // Cancelar y resetear el formulario
  onCancelClick() {
    this.adminForm.reset();        // Reinicia el formulario
    this.isAdminFound = false;     // Restablece el estado de búsqueda
    this.isSearchActive = false;   // Oculta el mensaje y el botón de invitar
    this.userId = null;            // Limpia el ID del usuario
    this.searchQuery = '';         // Limpia el valor del campo de búsqueda
    this.toastr.warning('Formulario desecho');
  }
  onBackClick(): void {
    this.router.navigate(['/administracion']);
  }
}





