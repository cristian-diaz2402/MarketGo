import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('UnauthGuard - Usuario autenticado:', isAuthenticated);
  
    if (isAuthenticated) {
      console.log('UnauthGuard - Redirigiendo a home...');
      this.router.navigate(['/home']); // Redirigir a home si está autenticado
      return false;
    }
    return true; // Permitir acceso al login
  }
  
}
