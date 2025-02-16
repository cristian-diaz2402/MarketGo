//inventario.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarraAdminComponent } from '../../barra-admin/barra-admin.component';
import { BuscarProdService } from '../../core/services/buscarprod.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraAdminComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  inventoryItems: any[] = [];
  selectedCatalog: string = 'carnes'; // Catálogo seleccionado por defecto

  isChanged: { [key: string]: boolean } = {};
  originalQuantity: { [key: string]: number } = {};
  isEditing: { [key: string]: boolean } = {};
  showRemoveProductConfirmation: { [key: string]: boolean } = {};

  constructor(private toastr: ToastrService, private buscarProdService: BuscarProdService, private router: Router) {}


  ngOnInit() {
    this.loadProductsFromCatalog();
  }

  loadProductsFromCatalog() {
    this.buscarProdService.getProductsForCatalogo(this.selectedCatalog).subscribe(
      (products) => {
        this.inventoryItems = products.map((product: any) => ({
          ...product,
          quantity: product.unidades, // Asignamos las unidades del backend
          iva: product.iva === true || product.iva === 'true' // Convertimos el IVA a booleano
        }));
        this.inventoryItems.forEach((item) => {
          this.originalQuantity[item.id] = item.quantity;
          this.isEditing[item.id] = false;
        });
      },
      (error) => {
        console.error('Error al cargar productos:', error);
        alert('No se pudieron cargar los productos. Inténtelo más tarde.');
      }
    );
  }

  increment(item: any) {
    item.quantity++;
    this.isChanged[item.id] = true;
  }

  decrement(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.isChanged[item.id] = true;
    }
  }

  save(item: any) {
    this.isChanged[item.id] = false;
    this.originalQuantity[item.id] = item.quantity;
    this.isEditing[item.id] = false;
    this.showNotification('Cambios guardados con éxito.');
  }

  discard(item: any) {
    item.quantity = this.originalQuantity[item.id];
    this.isChanged[item.id] = false;
    this.isEditing[item.id] = false;
    this.showNotification('Cambios descartados.');
  }

// Método editProduct
editProduct(item: any): void {
  console.log('Producto seleccionado para edición:', item); // Log para verificar el producto
  this.router.navigate(['edicion-del-producto'], { state: { product: item } });
}

  removeProduct(item: any) {
    this.inventoryItems = this.inventoryItems.filter(i => i.id !== item.id);
  }

  addProduct() {
    this.showNotification('Funcionalidad para agregar producto aún no implementada.');
  }

  showNotification(message: string): void {
    const notificationContainer = document.getElementById('notification');
    if (notificationContainer) {
      notificationContainer.innerText = message;
      notificationContainer.classList.add('visible');

      setTimeout(() => {
        notificationContainer.classList.remove('visible');
      }, 2999);
    }
  }
  irAggProd() {
    this.router.navigate(['/agregar-producto']); // Redirige a la edición 
  }
  openRemoveProductmModal(item: any): void {
    this.showRemoveProductConfirmation[item.id] = true;
  }

  // Confirmar la eliminación del producto
  confirmRemoveProduct(item: any): void {
    this.buscarProdService.eliminarProducto(item.id).subscribe(
      (response) => {
        console.log('Producto eliminado:', response);
        this.inventoryItems = this.inventoryItems.filter((i) => i.id !== item.id);
        this.showRemoveProductConfirmation[item.id] = false;
        this.toastr.success('Producto eliminado exitosamente.');
      },
      (error) => {
        console.error('Error al eliminar el producto:', error);
        this.toastr.error('Error al eliminar el producto. Inténtalo nuevamente.');
      }
    );
  }
  

  // Cancelar la eliminación
  cancelRemoveProduct(item: any): void {
    this.showRemoveProductConfirmation[item.id] = false;
  }
}
