import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Importar las rutas desde app-routing.ts
import { routes } from './app-routing';
import { BarraDeBusquedaComponent } from './principal/barra-de-busqueda/barra-de-busqueda.component';
import { BarraNavegacionComponent } from './principal/barra-navegacion/barra-navegacion.component';
import { ModalComponent } from './principal/perfil-usuario/modal.component';
import { HamburguesaComponent } from './principal/hamburguesa/hamburguesa.component';
import CarnesComponent from './productosXcatalogo/carnes/carnes.component';
import LacteosComponent from './productosXcatalogo/lacteos/lacteos.component';
import { DetallesDelProductoComponent } from './detalles-del-producto/detalles-del-producto.component';
import { DatosDelPedidoComponent } from './datos-del-pedido/datos-del-pedido.component';
import { ValidacionesService } from './services/validaciones.service';
import { CarritoComponent } from './carrito-de-compras/carrito/carrito.component';
import { InventarioComponent } from './gestion-inventario/inventario/inventario.component';
import { EdicionDelProductoComponent } from './edicion-del-producto/edicion-del-producto.component';
import { TransaccionFallidaComponent } from './transaccion-fallida/transaccion-fallida.component';
import { AgregarProductosComponent } from './agregar-productos/agregar-productos.component';
import { VentanaAdminComponent } from './ventana-admin/ventana-admin.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModule, // Necesario para directivas como *ngIf, *ngFor
    ReactiveFormsModule, // Necesario para formularios reactivos
  ],
  providers: [ValidacionesService],
  bootstrap: [],
  declarations: [
  ],
})
export class AppModule {}

