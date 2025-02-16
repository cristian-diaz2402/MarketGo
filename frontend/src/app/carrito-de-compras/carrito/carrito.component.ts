//carrito.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarraNavegacionComponent } from '../../principal/barra-navegacion/barra-navegacion.component';
import { HamburguesaComponent } from '../../principal/hamburguesa/hamburguesa.component';
import { CarritoService } from '../../core/services/carrito.service';
import { Router } from '@angular/router';
import { BuscarProdService } from '../../core/services/buscarprod.service';
import { ToastrService } from 'ngx-toastr';
import { StockCheckService } from '../../core/services/stockcheck.service'; // Importar el nuevo servicio

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraNavegacionComponent, HamburguesaComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  cartItems: any[] = [];
  cartSummary: { subtotal: number; iva: number; total: number }[] = [];

  isEditing: { [key: string]: boolean } = {};  
  isChanged: { [key: string]: boolean } = {};  
  showConfirmation: { [key: string]: boolean } = {};
  showDiscardConfirmation: { [key: string]: boolean } = {};
  showClearCartConfirmation: boolean = false;
  showRemoveItemConfirmation: { [key: string]: boolean } = {};
  showClearItemConfirmation: boolean = false;
  originalQuantity: { [key: string]: number } = {};  
  tempQuantity: { [key: string]: number } = {}; // Propiedad para almacenar la cantidad temporal durante la edición
  
  constructor(  private stockCheckService: StockCheckService,private toastr: ToastrService, private carritoService: CarritoService, private buscarProdService: BuscarProdService, private router: Router) {}

  ngOnInit() {
    this.cartItems = this.carritoService.getCartItems();
    this.cartItems.forEach((item) => {
      this.setIvaIndicator(item);
    });
    this.updateCartSummary(); 
    this.stockCheckService.startStockCheck();// Inicia la verificación periódica de stock

  }  
  
  setIvaIndicator(item: any): void {
    this.buscarProdService.fetchProductDetails(item.nombre).subscribe((product) => {
      item.ivaIndicator = product.iva ? 'I' : ''; 
      this.carritoService.updateItem(item); 
    });
  }

  increaseQuantity(item: any) {
    this.carritoService.increaseQuantity(item.id); 
    this.cartItems = this.carritoService.getCartItems();
    this.updateCartSummary(); 
  }
  
  decreaseQuantity(item: any) {
    this.carritoService.decreaseQuantity(item); 
    this.cartItems = this.carritoService.getCartItems();
    this.updateCartSummary(); 

  }
  
  removeItem(item: any) {
    this.carritoService.removeItem(item); 
    this.cartItems = this.carritoService.getCartItems();
    this.updateCartSummary(); 
  }
  
  getTotalPrice(): number {
    const total = this.cartItems.reduce(
      (acc, item) => acc + (item.precio * item.quantity * (item.ivaIndicator === 'I' ? 1.15 : 1)),
      0
    );
    this.updateCartSummary(); 
    return total;
  }

  getSubtotal(): number {
    const subtotal = this.cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    this.updateCartSummary(); 
    return subtotal;
  }

  updateCartSummary(): void {
    const subtotal = this.cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const iva = this.cartItems
    .filter(item => item.ivaIndicator === 'I')
    .reduce((acc, item) => acc + (item.precio * item.quantity * 0.15), 0);
  const total = this.cartItems.reduce(
    (acc, item) => acc + (item.precio * item.quantity * (item.ivaIndicator === 'I' ? 1.15 : 1)),
    0
  );

  this.cartSummary = [{
    subtotal: parseFloat(subtotal.toFixed(2)),
    iva: parseFloat(iva.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  }];
  console.log('Resumen del carrito:', this.cartSummary);
}

getIVA(): number {
  const iva = this.cartItems
    .filter(item => item.ivaIndicator === 'I') 
    .reduce((acc, item) => acc + (item.precio * item.quantity * 0.15), 0);
  this.updateCartSummary(); 
  return iva;
}

toggleEdit(item: any) {
  this.isEditing[item.id] = !this.isEditing[item.id];
  this.isChanged[item.id] = false;
  this.originalQuantity[item.id] = item.quantity;
  this.tempQuantity[item.id] = item.quantity; 
      // Verificar unidades disponibles desde el backend usando el nombre del producto
      this.buscarProdService.getAvailableUnits(item.nombre).subscribe({
        next: (response) => {
          const unidades = response?.unidades;
    
          if (unidades !== undefined && unidades !== null) {
            item.maxUnits = unidades; // Actualizar el máximo permitido
            console.log(`Unidades máximas disponibles para ${item.nombre}: ${item.maxUnits}`);
          } else {
            console.error('El campo "unidades" está indefinido o es nulo en la respuesta:', response);
            alert('No se pueden obtener las unidades disponibles.');
          }
        },
        error: (error) => {
          console.error('Error al obtener las unidades:', error);
          alert('Hubo un error al obtener las unidades disponibles. Intente más tarde.');
        }
      });
}

increment(item: any) {
  // Si está en modo de edición
  if (this.isEditing[item.id]) {
    if (this.tempQuantity[item.id] < item.maxUnits) {
      this.tempQuantity[item.id]++;
      this.isChanged[item.id] = true;
    } else {
      this.toastr.warning('Máximo de uniadades disponibles');
    }
  } else {
    // Fuera de edición
    if (item.quantity < item.maxUnits) {
      this.increaseQuantity(item); // Incrementa la cantidad usando el método original
    } else {
      this.toastr.warning('Máximo de uniadades disponibles');
    }
  }
}


decrement(item: any) {
  if (this.isEditing[item.id]) {
    // En modo edición, reduce la cantidad temporal
    if (this.tempQuantity[item.id] > 1) {
      this.tempQuantity[item.id]--;
      this.isChanged[item.id] = true; // Marcar como cambiado
    }
  } else {
    // Fuera de edición, reduce la cantidad real
    if (item.quantity > 1) {
      this.decreaseQuantity(item);
    }
  }
}

save(item: any) {
  if (this.tempQuantity[item.id] !== undefined) {
    item.quantity = this.tempQuantity[item.id]; // Aplicar la cantidad temporal al modelo principal
    this.carritoService.updateItem(item); // Asegurar que se actualicen los datos en el servicio
  }

  this.showConfirmation[item.id] = true;
  this.isEditing[item.id] = false;
  this.isChanged[item.id] = false;
  this.updateCartSummary(); // Refrescar el resumen del carrito
}


closeConfirmation(item: any) {
  this.showConfirmation[item.id] = false;
}

discard(item: any) {
  if (this.isChanged[item.id]) {
    this.showDiscardConfirmation[item.id] = true;
  } else {
    this.isEditing[item.id] = false;
  }
}

cancelDiscard(item: any) {
  this.showDiscardConfirmation[item.id] = false;
}

discardChanges(item: any) {
  const originalQty = this.originalQuantity[item.id];  
  const foundItem = this.cartItems.find(cartItem => cartItem.id === item.id);
  if (foundItem) {
    foundItem.quantity = originalQty;  
  }
  this.showDiscardConfirmation[item.id] = false;
  this.isEditing[item.id] = false;
  this.isChanged[item.id] = false;
  this.toastr.info('Cambios descartados');
}

redirectToCheckout() {
  this.updateCartSummary(); // Asegurar resumen actualizado
  this.carritoService.sendCartData(this.cartItems, this.cartSummary[0]);
  this.router.navigate(['/datos-del-pedido']);
}

confirmClearCart() {
  
  this.showClearCartConfirmation = true;
}

clearCart() {
  this.carritoService.clearCart();  
  this.cartItems = [];  
  this.showClearCartConfirmation = false;  
  this.showNotification('Lista eliminada exitosamente');
}

cancelClearCart() {
  this.showClearCartConfirmation = false;
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

// Abrir el modal de confirmación
openRemoveItemModal(item: any): void {
  this.showRemoveItemConfirmation[item.id] = true;
}

// Confirmar la eliminación
confirmRemoveItem(item: any): void {
  this.removeItem(item); // Llama al método existente para eliminar el artículo
  this.showRemoveItemConfirmation[item.id] = false; // Cierra el modal
  this.showNotification('Artículo eliminado del carrito.');
}

// Cancelar la eliminación
cancelRemoveItem(item: any): void {
  this.showRemoveItemConfirmation[item.id] = false; // Cierra el modal sin eliminar
}
}