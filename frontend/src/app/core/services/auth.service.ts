// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, UserCredential, signInWithPopup, signOut } from '@angular/fire/auth';
import { CarritoService } from './carrito.service'; // Importar el servicio del carrito


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private carritoService: CarritoService) {}

  async signInWithGoogleProvider(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
  
    try {
      const credential = await signInWithPopup(this.auth, provider);
      const token = await credential.user.getIdToken();
  
      // Almacenar el token y los datos del usuario en localStorage
      const userProfile = {
        name: credential.user.displayName || '',
        email: credential.user.email || '',
        picture: credential.user.photoURL || '',
        rol: 'cliente',
      };
  
      localStorage.setItem('authToken', token);
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
  
      return credential;
    } catch (error: unknown) {
      if (this.isFirebaseAuthError(error) && error.code === 'auth/popup-closed-by-user') {
        console.warn('El popup de Google se cerró antes de completar la autenticación.');
        throw new Error('Proceso de autenticación cancelado.');
      } else if (error instanceof Error) {
        console.error('Error inesperado:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }
  
  private isFirebaseAuthError(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error;
  }
  
  

  getIdToken(): string | null {
    return localStorage.getItem('authToken'); // Recuperar el token del almacenamiento
  }

  getUserProfile(): { name: string; email: string; picture: string; rol:string } | null {
    const userProfile = localStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null; // Recuperar los datos del usuario
  }

  async logout(): Promise<void> {
    await signOut(this.auth);

    // Limpiar el almacenamiento al cerrar sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');

    // Vaciar el carrito de compras
    this.carritoService.clearCart();
  }

  isAuthenticated(): boolean {
    return !!this.getIdToken(); // Verificar si hay un token en localStorage
  }
}
