//auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AuthGuard - Usuario autenticado:', isAuthenticated);
  
    if (isAuthenticated) {
      return true; // Permitir acceso
    } else {
      console.log('AuthGuard - Redirigiendo al login...');
      this.router.navigate(['/login']); // Redirigir explícitamente al login
      return false;
    }
  }  
}
