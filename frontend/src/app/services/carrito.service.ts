import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private cartItems: any[] = [];

  constructor() {}

  // Obtener los ítems del carrito
  getCartItems() {
    return this.cartItems;
  }

  // Agregar un producto al carrito
  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
  }

  // Incrementar la cantidad de un producto
  increaseQuantityById(id: string) {
    const item = this.cartItems.find(item => item.id === id);
    if (item) {
      item.quantity++;
    }
  }

  // Disminuir la cantidad de un producto
  decreaseQuantity(item: any) {
    const foundItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (foundItem && foundItem.quantity > 1) {
      foundItem.quantity--;
    }
  }

  // Eliminar un producto
  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  // Vaciar el carrito
  clearCart() {
    this.cartItems = [];
  }

  // Actualizar un ítem
  updateItem(item: any) {
    const index = this.cartItems.findIndex(existingItem => existingItem.id === item.id);
    if (index !== -1) {
      this.cartItems[index] = item;
    }
  }

  sendCartData(cartItems: any[], cartSummary: any) {
    // Aquí iría la lógica para enviar los datos del carrito al servidor
    console.log('Enviando carrito:', cartItems, 'Resumen:', cartSummary);
  }
}
