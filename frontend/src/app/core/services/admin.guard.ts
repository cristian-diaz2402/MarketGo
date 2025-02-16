//admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const user = this.userService.getUser();

    if (isAuthenticated && user?.rol === 'administrador') {
      return true; // Permitir acceso si el usuario es administrador
    } else {
      this.router.navigate(['/home']); // Redirigir si no tiene el rol adecuado
      return false;
    }
  }
}
