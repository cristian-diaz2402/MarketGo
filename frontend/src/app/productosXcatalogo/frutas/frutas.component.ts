import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarraNavegacionComponent } from '../../principal/barra-navegacion/barra-navegacion.component';
import { HamburguesaComponent } from '../../principal/hamburguesa/hamburguesa.component';
import { BuscarProdService } from '../../core/services/buscarprod.service';
import { CarritoService } from '../../core/services/carrito.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-frutas',
  standalone: true,
  imports: [CommonModule, BarraNavegacionComponent, HamburguesaComponent],
  templateUrl: './frutas.component.html',
  styleUrls: ['./frutas.component.css']
})
export default class FrutasComponent implements OnInit{
  products: any[] = []; // Lista dinámica de productos
  isNameAsc: boolean = true; // Comienza con A-Z
  isPriceAsc: boolean = true; // Comienza con precios ascendentes

  constructor(
    private buscarProdService: BuscarProdService,
    private carritoService: CarritoService,
    private toastr: ToastrService // Inyectar el servicio Toastr
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Cargar productos desde el servicio.
   */
  private loadProducts(): void {
    this.buscarProdService
      .getProductsForCatalogo('frutas')
      .subscribe({
        next: (data) => {
          this.products = data; // Asignar productos obtenidos
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          alert('No se pudieron cargar los productos. Inténtelo más tarde.');
        },
      });
  }

  addToCart(product: any): void {
    if (product.unidades === 0) {
      this.toastr.warning('Producto no disponible');
    } else {
      const productWithQuantity = { ...product, quantity: 1 }; // Añadir cantidad predeterminada
      this.carritoService.addToCart(productWithQuantity);
      this.showNotification('Producto añadido!');
    }
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

  /**
   * Ordenar los productos por nombre (A-Z o Z-A).
   */
  sortByName(): void {
    this.products.sort((a, b) => {
      if (this.isNameAsc) {
        return a.nombre.localeCompare(b.nombre); // A-Z
      } else {
        return b.nombre.localeCompare(a.nombre); // Z-A
      }
    });
    this.isNameAsc = !this.isNameAsc; // Alternar orden
  }

  /**
   * Ordenar los productos por precio (ascendente o descendente).
   */
  sortByPrice(): void {
    this.products.sort((a, b) => {
      if (this.isPriceAsc) {
        return a.precio - b.precio; // Ascendente
      } else {
        return b.precio - a.precio; // Descendente
      }
    });
    this.isPriceAsc = !this.isPriceAsc; // Alternar orden
  }

  detalleProd(productName: string): void {
    this.buscarProdService.getProductByName(productName).subscribe();
  }
}
