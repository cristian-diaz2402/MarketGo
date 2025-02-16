//buscarprod.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BuscarProdService {

  private apiUrl = 'https://backend-marketgo.onrender.com/buscarproducto';

  constructor(private http: HttpClient, private router: Router) { }

  getProductByName(name: string): Observable<any> {
    const params = new HttpParams().set('nombre', name);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(product => {
        if (product) {
          this.router.navigate(['/detalles', product.id], { state: { product } }); // Cambia la ruta
        } else {
          alert('Producto no encontrado');
        }
      })
    );
  }
    // Nuevo método: Obtiene los datos del producto sin redirigir (para el carrito)
    fetchProductDetails(name: string): Observable<any> {
      const params = new HttpParams().set('nombre', name);
      return this.http.get<any>(this.apiUrl, { params });
    }

    // buscarprod.service.ts
    getAvailableUnits(productName: string) {
      const url = `https://backend-marketgo.onrender.com/buscarproducto?nombre=${encodeURIComponent(productName)}`;
      return this.http.get<any>(url);
    }
    
    
    getProductsForCatalogo(catalogoName: string) {
      const url = `https://backend-marketgo.onrender.com/buscarproductosxcatalogo?catalogo=${encodeURIComponent(catalogoName)}`;
      return this.http.get<any>(url);
    }

    modifyProduct(productId: string, productData: any): Observable<any> {
      console.log('Datos enviados al backend:', productData);
      const url = `https://backend-marketgo.onrender.com/modifyproduct/${productId}`;
      return this.http.put<any>(url, productData);
    }
    
    createProduct(productData: any): Observable<any> {
      const url = 'https://backend-marketgo.onrender.com/createproduct';
      return this.http.post<any>(url, productData);
    }
    
    getAdmins(): Observable<any> {
      const url = 'https://backend-marketgo.onrender.com/buscaradmin';
      return this.http.get<any>(url);
    }
    eliminarAdmin(adminId: string): Observable<any> {
      const url = `https://backend-marketgo.onrender.com/eliminaradmin/${adminId}`;
      return this.http.put<any>(url, {}); // La API no requiere body, pero debe enviarse vacío
    }
    
    getUserByEmail(email: string): Observable<any> {
      const url = `https://backend-marketgo.onrender.com/buscarusuario/${email}`;
      return this.http.get<any>(url);
    }

    sendInvitation(email: string): Observable<any> {
      const url = 'https://backend-marketgo.onrender.com/invitacion';
      return this.http.post<any>(url, { email });
    }
    agregarAdmin(adminId: string): Observable<any> {
      const url = `https://backend-marketgo.onrender.com/agregaradmin/${adminId}`;
      return this.http.put<any>(url, {}); // Se envía un body vacío, ya que no es requerido
    }

    eliminarProducto(productId: string): Observable<any> {
      const url = `https://backend-marketgo.onrender.com/deleteproduct/${productId}`;
      return this.http.delete<any>(url);
    }
    
    
}
