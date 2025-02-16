//app-routing.ts
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard} from './core/services/auth.guard';
import { UnauthGuard} from './core/services/unauth.guard';
import { AdminGuard} from './core/services/admin.guard';

export const routes: Routes = [
  { 
    path: '', redirectTo: 'home', pathMatch: 'full' // Sin guards aquí
  },
  { path:'login', loadComponent:() =>import('./login/login/login.component'), canActivate: [UnauthGuard] },

  { path:'home', loadComponent:() =>import('./principal/main/main.component'), canActivate: [AuthGuard],},
    
  { path:'about', loadComponent:() =>import('./principal/about/about.component' ), canActivate: [AuthGuard],},

  { path:'carnicos', loadComponent:() =>import('./productosXcatalogo/carnes/carnes.component'), canActivate: [AuthGuard],},

  { path:'carrito', loadComponent: () => import('./carrito-de-compras/carrito/carrito.component').then(m => m.CarritoComponent),  canActivate: [AuthGuard] },

  { path:'lacteos', loadComponent:() =>import('./productosXcatalogo/lacteos/lacteos.component'), canActivate: [AuthGuard],},

  { path:'aseo_personal', loadComponent:() =>import('./productosXcatalogo/aseo-personal/aseo-personal.component'), canActivate: [AuthGuard],},

  { path:'bebidas', loadComponent:() =>import('./productosXcatalogo/bebidas/bebidas.component'), canActivate: [AuthGuard],},

  { path:'frutas', loadComponent:() =>import('./productosXcatalogo/frutas/frutas.component'), canActivate: [AuthGuard],},

  { path:'limpieza', loadComponent:() =>import('./productosXcatalogo/limpieza/limpieza.component'), canActivate: [AuthGuard],},

  { path:'snacks', loadComponent:() =>import('./productosXcatalogo/snacks/snacks.component'), canActivate: [AuthGuard],},

  { path:'verduras', loadComponent:() =>import('./productosXcatalogo/verduras/verduras.component'),canActivate: [AuthGuard],},
  
  { path: 'detalles/:id', loadComponent: () => import('./detalles-del-producto/detalles-del-producto.component').then(m => m.DetallesDelProductoComponent), canActivate: [AuthGuard], },

  { path: 'edicion-del-producto', loadComponent: () => import('./edicion-del-producto/edicion-del-producto.component').then(m => m.EdicionDelProductoComponent), canActivate: [AdminGuard],},

  { path: 'agregar-producto', loadComponent: () => import('./agregar-productos/agregar-productos.component').then(m => m.AgregarProductosComponent), canActivate: [AdminGuard],},

  { path: 'ventana-admin', loadComponent: () => import('./ventana-admin/ventana-admin.component').then(m => m.VentanaAdminComponent), canActivate: [AdminGuard]},

  { path: 'datos-del-pedido', loadComponent: () => import('./datos-del-pedido/datos-del-pedido.component').then(m => m.DatosDelPedidoComponent),  canActivate: [AuthGuard]},

  { path: 'inventario', loadComponent: () => import('./gestion-inventario/inventario/inventario.component').then(m => m.InventarioComponent), canActivate: [AdminGuard]},
   
  { path: 'transaccion-exitosa', loadComponent: () => import('./transaccion-exitosa/transaccion-exitosa.component').then(m => m.TransaccionExitosaComponent), canActivate: [AuthGuard]},

  { path: 'transaccion-fallida', loadComponent: () => import('./transaccion-fallida/transaccion-fallida.component').then(m => m.TransaccionFallidaComponent), canActivate: [AuthGuard]},

  { path: 'administracion', loadComponent: () => import('./administracion/administracion.component').then(m => m.AdministracionComponent), canActivate: [AdminGuard] }
  
];


