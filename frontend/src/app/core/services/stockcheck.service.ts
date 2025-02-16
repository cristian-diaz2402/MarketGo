//stockcheck.service.ts
import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CarritoService } from './carrito.service';
import { BuscarProdService } from './buscarprod.service';
import { NotificacionesService } from './notificaciones.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class StockCheckService {
  private stockCheckSubscription: Subscription | null = null;
  private isCheckingStock = false; // Para evitar múltiples instancias
  private productosNotificados: Set<string> = new Set(); // Evita múltiples notificaciones

  constructor(
    private carritoService: CarritoService,
    private buscarProdService: BuscarProdService,
    private notificacionesService: NotificacionesService,
    private toastr: ToastrService
  ) {}

  startStockCheck() {
    if (this.isCheckingStock) return; // Evita múltiples verificaciones
    this.isCheckingStock = true;

    this.stockCheckSubscription = interval(10000).subscribe(() => {
      this.verifyStock();
    });
  }


  stopStockCheck() {
    if (this.stockCheckSubscription) {
      this.stockCheckSubscription.unsubscribe();
      this.stockCheckSubscription = null;
      this.isCheckingStock = false;
    }
  }

  private verifyStock() {
    const cartItems = this.carritoService.getCartItems();
    if (cartItems.length === 0) {
      this.stopStockCheck(); // Detener solo si el carrito está vacío
      return;
    }

    cartItems.forEach((item) => {
        this.buscarProdService.getAvailableUnits(item.nombre).subscribe({
          next: (response) => {
            const unidadesDisponibles = response?.unidades ?? 0;
            if (item.quantity > unidadesDisponibles && !this.productosNotificados.has(item.nombre)) {
              this.toastr.info(`El producto "${item.nombre}" ya no está disponible.`);
              this.notificacionesService.agregarNotificacion(`El producto "${item.nombre}" se ha agotado.`);
              this.productosNotificados.add(item.nombre);
            }
          },
        error: (error) => console.error('Error al verificar stock:', error),
      });
    });
  }
}
