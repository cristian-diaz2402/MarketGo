//detalles-del-producto.component.ts
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../core/services/producto.service';
import { BarraNavegacionComponent } from '../principal/barra-navegacion/barra-navegacion.component';
import { BuscarProdService } from '../core/services/buscarprod.service'; // Servicio para obtener datos del backend
import { Router } from '@angular/router'; // Importar Router
import { CarritoService } from '../core/services/carrito.service';
import { v4 as uuidv4 } from 'uuid';
import { HamburguesaComponent } from '../principal/hamburguesa/hamburguesa.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-detalles-del-producto',
  standalone: true,
  imports: [BarraNavegacionComponent, HamburguesaComponent],
  templateUrl: './detalles-del-producto.component.html',
  styleUrls: ['./detalles-del-producto.component.css']
})
export class DetallesDelProductoComponent implements OnInit {
  cantidad: number = 1; // Valor inicial para la cantidad seleccionada por el usuario
  product: any; // Variable para almacenar los datos del producto desde el estado de navegación
  precioIva: number | null = 0; // Precio con IVA calculado (o null si no aplica)
  imageUrl: string = ''; // URL de la imagen del producto
  unidadesBackend: number | null = null; // Cantidad de unidades disponibles desde el backend
  botonDeshabilitado: boolean = false; // Estado del botón "Incrementar"

  constructor(
    private router: Router, // Inyectar Router
    private location: Location,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private buscarProdService: BuscarProdService, // Servicio para interactuar con el backend
    private carritoService: CarritoService,
    private toastr: ToastrService // Inyectar el servicio Toastr
  ) {}

  addToCart(product: any) {
    if (!product) {
      console.error('Datos del producto no válidos:', product);
      return;
    }

    // Verificar stock disponible antes de agregar al carrito
    this.buscarProdService.getAvailableUnits(product.nombre).subscribe({
      next: (data) => {
        const availableUnits = data?.unidades || 0;

        if (this.cantidad > availableUnits) {
          this.toastr.warning('Stock no disponible para la cantidad seleccionada.');
          return;
        }

        const normalizedProduct = {
          id: product.id || product.codigo || uuidv4(),
          nombre: product.nombre || product.name || 'Producto sin nombre',
          precio: product.precio || product.price || 0,
          imagen: this.imageUrl || './assets/default-image.jpg',
          quantity: this.cantidad
        };

        if (!normalizedProduct.id || !normalizedProduct.nombre || !normalizedProduct.precio) {
          console.error('Datos del producto no válidos tras la normalización:', normalizedProduct);
          return;
        }

        this.carritoService.addToCart(normalizedProduct);
        console.log('Producto añadido al carrito:', normalizedProduct);
        this.toastr.success('Producto añadido al carrito!');
      },
      error: (err) => {
        console.error('Error al verificar unidades:', err);
        this.toastr.warning('Error al verificar el stock.');
      }
    });
  }
  
  showNotification(message: string): void {
    const notificationContainer = document.getElementById('notification');
    if (notificationContainer) {
      notificationContainer.innerText = message;
      notificationContainer.classList.add('visible');

      // Ocultar después de 3 segundos
      setTimeout(() => {
        notificationContainer.classList.remove('visible');
      }, 2999);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      const state = window.history.state;
      console.log('Estado de navegación recibido:', state); 
      this.product = state.product || {};
      this.product.id = this.product.id || uuidv4();
      this.product.nombre = this.product.nombre || 'Producto sin nombre';
      this.product.precio = this.product.precio || 0;
      this.imageUrl = this.product.imagen || './assets/default-image.jpg';
  
      this.calculatePrecioIva(); // Calcula el precio con IVA
      this.verificarUnidades();
      console.log('Valores iniciales del producto:', this.product);
    });
  }

// Método para cargar la imagen del producto desde ProductoService
loadProductImage() {
  if (!this.product || !this.product.nombre) {
    console.error('El producto o su nombre no está definido:', this.product);
    this.imageUrl = './assets/default-image.jpg';
    return;
  }

  console.log('Buscando imagen para el producto:', this.product.nombre);

  const foundProduct = this.productoService.getProductByName(this.product.nombre?.trim().toLowerCase());
  if (foundProduct) {
    this.imageUrl = foundProduct.image;
    console.log('Imagen encontrada:', this.imageUrl);
  } else {
    this.imageUrl = './assets/default-image.jpg';
    console.warn('No se encontró imagen para el producto. Usando imagen predeterminada:', this.imageUrl);
  }
}

  
  

  // Método para calcular el precio con IVA (si aplica)
  calculatePrecioIva() {
    if (this.product && this.product.precio) {
      if (this.product.iva) {
        this.precioIva = +(this.product.precio + this.product.precio * 0.15).toFixed(2); // IVA del 15%
      } else {
        this.precioIva = null; // Producto sin IVA
      }
    }
  }


  // Método para verificar las unidades disponibles en el backend
  verificarUnidades() {
    this.buscarProdService.getAvailableUnits(this.product.nombre).subscribe(data => {
      this.unidadesBackend = data?.unidades || 0;
      this.actualizarEstadoBoton();
    });
  }

  // Método para habilitar o deshabilitar el botón de incremento// Método para habilitar o deshabilitar el botón de incremento
actualizarEstadoBoton() {
  if (this.unidadesBackend !== null) {
    this.botonDeshabilitado = this.cantidad >= this.unidadesBackend; // Deshabilita si la cantidad excede las unidades
  }
}


  // Incrementar cantidad
  incrementar(): void {
    if (this.unidadesBackend !== null && this.cantidad < this.unidadesBackend) { // Verifica si unidadesBackend no es null
      this.cantidad++;
      this.actualizarEstadoBoton(); // Verifica el estado del botón después de incrementar
    } else {
      this.toastr.warning('Máximo de unidades disponibles');
      this.botonDeshabilitado = true; // Deshabilita el botón
    }
  }
  
  

  // Decrementar cantidad
  decrementar(): void {
    if (this.cantidad > 1) { // Límite inferior
      this.cantidad--;
      this.actualizarEstadoBoton(); // Verifica el estado del botón después de decrementar
    }
  }
  // Método para ir al Home
  goBack() {
    this.limpiarDatos(); // Limpia los datos del componente
    this.router.navigate(['/']); // Navega explícitamente al Home
  }
    // Método para limpiar los datos del componente
    limpiarDatos() {
      this.cantidad = 1;
      this.product = null;
      this.precioIva = 0;
      this.imageUrl = '';
      this.unidadesBackend = null;
      this.botonDeshabilitado = false;
    }
}
