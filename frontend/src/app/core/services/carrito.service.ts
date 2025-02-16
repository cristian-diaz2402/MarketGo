//carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class CarritoService {
  private cartItems: any[] = [];
  private cartSummary = { subtotal: 0, iva: 0, total: 0 };

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartSummarySubject = new BehaviorSubject<{ subtotal: number; iva: number; total: number }>(this.cartSummary);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartSummary$ = this.cartSummarySubject.asObservable();

  constructor(private http: HttpClient) {
    const savedCart = localStorage.getItem('cartItems');
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];

    const savedSummary = localStorage.getItem('cartSummary');
    this.cartSummary = savedSummary ? JSON.parse(savedSummary) : { subtotal: 0, iva: 0, total: 0 };

    this.updateSummary(); // Inicializar resumen
    this.cartItemsSubject.next(this.cartItems); // Emitir los valores iniciales
  }

  // Método para obtener los productos del carrito
  getCartItems() {
    return this.cartItems;
  }

  // Método para agregar un producto al carrito
  addToCart(product: any) {
    console.log('Agregando producto al carrito:', product);
    const existingProduct = this.cartItems.find(item => item.nombre === product.nombre);
  
    if (existingProduct) {
      existingProduct.quantity += product.quantity; // Incrementa la cantidad con la nueva cantidad seleccionada
      console.log('Producto existente actualizado:', existingProduct);
      this.updateItemTotals(existingProduct);
    } else {
      const newItem = {
        ...product,
        ivaIndicator: '', 
        subtotal: product.price * product.quantity, // Calcula el subtotal con la cantidad seleccionada
        iva: 0,
        total: product.price * product.quantity // Calcula el total con la cantidad seleccionada
      };
      this.updateItemTotals(newItem);
      console.log('Nuevo producto agregado:', newItem);
      this.cartItems.push(newItem);
    }
  
    console.log('Estado actual del carrito:', this.cartItems);
    this.saveCart();
  }
  
  
  

  // Método para actualizar subtotales, IVA y totales de un ítem
  private updateItemTotals(item: any) {
    item.subtotal = item.precio * item.quantity;
    item.iva = item.ivaIndicator === 'I' ? item.subtotal * 0.15 : 0;
    item.total = item.subtotal + item.iva;
  }

  updateItem(item: any): void {
    this.updateItemTotals(item);
    this.cartItems = this.cartItems.map(cartItem => 
      cartItem.id === item.id ? item : cartItem
    ); // Asegura que el ítem actualizado se reemplace correctamente
    this.saveCart(); // Guardar cambios en LocalStorage y actualizar resumen
  }
  

  // Método para eliminar un producto del carrito
  removeItem(item: any) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    this.saveCart(); // Guardar cambios en LocalStorage
  }

  // Incrementar cantidad
  increaseQuantity(item: any) {
    item.quantity++;
    this.saveCart(); // Guardar cambios en LocalStorage
  }

  
  // Disminuir la cantidad de un producto en el carrito
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCart(); // Guardar cambios en LocalStorage
    }
  }

  // Método para vaciar el carrito
  clearCart() {
    this.cartItems = []; // Vaciar el array de productos
    this.cartSummary = { subtotal: 0, iva: 0, total: 0 }; // Resetear los totales
    localStorage.removeItem('cartItems'); // Limpiar LocalStorage del carrito
    localStorage.removeItem('cartSummary'); // Limpiar LocalStorage del resumen
    this.cartItemsSubject.next(this.cartItems); // Emitir la lista vacía
    this.cartSummarySubject.next(this.cartSummary); // Emitir el resumen vacío
    console.log('Carrito limpiado tras cierre de sesión.');
  }
  

  // Método para guardar el carrito en LocalStorage
  private saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.updateSummary(); // Actualizar totales
    localStorage.setItem('cartSummary', JSON.stringify(this.cartSummary));
    this.cartItemsSubject.next(this.cartItems);
  }
  


  private updateSummary() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = this.cartItems.reduce((sum, item) => sum + item.iva, 0);
    const total = subtotal + iva;

    this.cartSummary = { subtotal, iva, total };
    this.cartSummarySubject.next(this.cartSummary); // Emitir nuevo resumen
  }
    

  sendCartData(items: any[], summary: { subtotal: number; iva: number; total: number }) {
    this.cartItemsSubject.next(items);
    this.cartSummarySubject.next(summary);
  }

}
