//edicion-del-producto.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuscarProdService } from '../core/services/buscarprod.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edicion-del-producto',
  standalone: true,
  imports: [FormsModule, CommonModule], // Importar FormsModule aquí
  templateUrl: './edicion-del-producto.component.html',
  styleUrls: ['./edicion-del-producto.component.css']
})
export class EdicionDelProductoComponent implements OnInit {
  product: any = {}; 
  errores: { [key: string]: string } = {
    nombre: '',
    catalogo: '',
    cantidad: '',
    precio: '',
    unidades: '',
    descripcion: '',
    imagen: ''
  };
  camposModificados: { [key: string]: boolean } = {};
  mostrarModal: boolean = false;
  mostrarModalGuardar: boolean = false; 
  constructor(private router: Router, private route: ActivatedRoute, private buscarProdService: BuscarProdService, private toastr: ToastrService) {}

  ngOnInit(): void {
    // Acceder al estado pasado mediante history.state
    if (history.state.product) {
      this.product = history.state.product;
      console.log('Producto recibido:', this.product);
    } else {
      console.error('Producto no recibido.');
    }
  }
  
  saveChanges(): void {
    
    // Crear un objeto con los datos del producto que se enviarán al backend
    const { id, quantity, ...productData } = this.product; // Excluir 'quantity' del envío
    console.log('Datos enviados al backend:', productData);

    this.buscarProdService.modifyProduct(id, productData).subscribe({
      next: (response) => {
        console.log('Producto modificado exitosamente:', response);
        this.router.navigate(['/inventario']); // Redirigir después de guardar
      },
      error: (error) => {
        console.error('Error al modificar el producto:', error);
        alert('Ocurrió un error al intentar guardar los cambios.');
      },
    });
  }
  

  cancel(): void {
    console.log('Edición cancelada.');
    this.router.navigate(['/inventario']);
  }

  onInputChange(campo: string): void {
    this.camposModificados[campo] = true;

    switch(campo) {
      case 'nombre':
        this.validarNombre();
        break;
      case 'catalogo':
        this.validarCatalogo();
        break;
      case 'cantidad':
        this.validarCantidad();
        break;
      case 'precio':
        this.validarPrecio();
        break;
      case 'unidades':
        this.validarUnidades();
        break;
      case 'descripcion':
        this.validarDescripcion();
        break;
      case 'imagen':
        this.validarImagen();
        break;
    }
  }

  validarNombre(): void {
    if (this.camposModificados['nombre']) {
      const nombre = this.product.nombre?.trim();
      if (!nombre) {
        this.errores['nombre'] = 'El nombre es obligatorio';
      } else if (nombre.length < 3) {
        this.errores['nombre'] = 'El nombre debe tener al menos 3 caracteres';
      } else if (nombre.length > 100) {
        this.errores['nombre'] = 'El nombre no puede exceder 100 caracteres';
      } else {
        this.errores['nombre'] = '';
      }
    }
  }

  validarCatalogo(): void {
    if (this.camposModificados['catalogo']) {
      const catalogosValidos = [
        'carnes',
        'lácteos',
        'frutas',
        'bebidas',
        'limpieza',
        'aseo_personal',
        'snacks',
        'verduras'
      ];
      const catalogo = this.product.catalogo?.trim().toLowerCase();
  
      if (!catalogo) {
        this.errores['catalogo'] = 'El catálogo es obligatorio';
      } else if (!catalogosValidos.includes(catalogo)) {
        this.errores['catalogo'] = `El catálogo debe ser uno de los siguientes: ${catalogosValidos.join(', ')}`;
      } else {
        delete this.errores['catalogo']; // Eliminar el error si es válido
      }
    }
  }
  

  validarCantidad(): void {
    if (this.camposModificados['cantidad']) {
      const cantidad = parseFloat(this.product.cantidad);
      if (isNaN(cantidad)) {
        this.errores['cantidad'] = 'La cantidad debe ser un número valido con su respectiva unidad de peso (100 g)';
      } else if (cantidad < 0) {
        this.errores['cantidad'] = 'La cantidad no puede ser negativa';
      } else if (!Number.isInteger(cantidad)) {
        this.errores['cantidad'] = 'La cantidad debe ser un número entero';
      } else {
        this.errores['cantidad'] = '';
      }
    }
  }

  validarPrecio(): void {
    if (this.camposModificados['precio']) {
      const precioStr = this.product.precio?.toString().trim();
  
      // Validaciones de formato
      if (!precioStr) {
        this.errores['precio'] = 'El precio es obligatorio';
      } else if (precioStr.includes(',')) {
        this.errores['precio'] = 'Use punto (.) como separador decimal';
      } else if (precioStr.startsWith('.')) {
        this.errores['precio'] = 'El precio no puede comenzar con punto';
      } else if (precioStr.split('.').length > 2) {
        this.errores['precio'] = 'El precio debe tener un solo punto decimal';
      } else {
        // Validar decimales
        const partes = precioStr.split('.');
        if (partes.length === 2 && partes[1].length > 2) {
          this.errores['precio'] = 'Solo se permiten 2 decimales';
        } else {
          const precio = parseFloat(precioStr);
          
          if (isNaN(precio)) {
            this.errores['precio'] = 'El precio debe ser un número válido';
          } else if (precio < 0) {
            this.errores['precio'] = 'El precio no puede ser negativo';
          } else if (precio > 1000000) {
            this.errores['precio'] = 'El precio es demasiado alto';
          } else {
            this.errores['precio'] = '';
          }
        }
      }
    }
  }

  validarUnidades(): void {
    if (this.camposModificados['unidades']) {
      const unidades = parseFloat(this.product.unidades);
      if (isNaN(unidades)) {
        this.errores['unidades'] = 'Las unidades deben ser un número';
      } else if (unidades < 0) {
        this.errores['unidades'] = 'Las unidades no pueden ser negativas';
      } else if (!Number.isInteger(unidades)) {
        this.errores['unidades'] = 'Las unidades deben ser un número entero';
      } else {
        this.errores['unidades'] = '';
      }
    }
  }

  validarDescripcion(): void {
    if (this.camposModificados['descripcion']) {
      const descripcion = this.product.descripcion?.trim();
      if (!descripcion) {
        this.errores['descripcion'] = 'La descripción no puede estar vacía';
      } else if (descripcion.length > 500) {
        this.errores['descripcion'] = 'La descripción no puede exceder 500 caracteres';
      } else {
        this.errores['descripcion'] = '';
      }
    }
   }

  validarImagen(): void {
    if (this.camposModificados['imagen']) {
      const imagen = this.product.imagen?.trim();
      if (imagen && imagen.length > 500) {
        this.errores['imagen'] = 'La URL de imagen es demasiado larga';
      } else if (imagen && !/^(https?:\/\/)/.test(imagen)) {
        this.errores['imagen'] = 'La URL de imagen debe comenzar con http:// o https://';
      } else {
        this.errores['imagen'] = '';
      }
    }
  }

  esValido(campo: string): boolean {
    return this.errores[campo] === '';
  }

  esInvalido(campo: string): boolean {
    return this.camposModificados[campo] && this.errores[campo] !== '';
  }
  
  guardar(): void {
    // Validar todos los campos
    this.validarNombre();
    this.validarCatalogo();
    this.validarCantidad();
    this.validarPrecio();
    this.validarUnidades();
    this.validarDescripcion();
    this.validarImagen();
  
    // Verificar si hay errores
    const tieneErrores = Object.values(this.errores).some(error => error !== '');
  
    if (!tieneErrores) {
      this.saveChanges();
    } else {
      alert('Corrige los errores antes de guardar.');
    }
  }

  // Agregar una función que compruebe si hay campos modificados
hayModificaciones(): boolean {
  return Object.values(this.camposModificados).some((modificado) => modificado);
}

onCancel(): void {
  if (this.hayModificaciones()) {
    this.mostrarModal = true; // Muestra el modal si hay cambios
  } else {
    this.cancel(); // Ejecuta la lógica de cancelación directamente si no hay modificaciones
  }
}

cerrarModal(event?: MouseEvent): void {
  if (!event || (event.target as HTMLElement).classList.contains('modal')) {
    this.mostrarModal = false; // Cierra el modal
  }
}

confirmarCancelar(): void {
  this.mostrarModal = false; // Cierra el modal
  this.cancel(); // Ejecuta la lógica de cancelación
  this.toastr.info('Los cambios han sido descartados', 'Cancelado', {
    timeOut: 3000,
    positionClass: 'toast-top-right',
    closeButton: true,
  });
}

onSave(): void {
  this.mostrarModalGuardar = true;
}

cerrarModalGuardar(event?: MouseEvent): void {
  if (!event || (event.target as HTMLElement).classList.contains('modal')) {
    this.mostrarModalGuardar = false;
  }
}

confirmarGuardar(): void {
  this.mostrarModalGuardar = false;
  this.saveChanges();
  this.toastr.success('Los cambios han sido guardados', 'Guardado', {
    timeOut: 3000,
    positionClass: 'toast-top-right',
    closeButton: true,
  });
}

puedeGuardar(): boolean {
  // Verificar que HAY modificaciones Y que TODOS los campos son válidos
  return this.hayModificaciones() && Object.values(this.errores).every(error => error === '');
}


}
