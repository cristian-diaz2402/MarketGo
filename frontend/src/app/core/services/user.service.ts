// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData: { name: string; email: string; picture: string; rol:string } | null = null;

  setUser(user: { name: string; email: string; picture: string; rol:string } | null): void {
    this.userData = user;

    // Actualizar localStorage cuando se establece el usuario
    if (user) {
      localStorage.setItem('userProfile', JSON.stringify(user));
    } else {
      localStorage.removeItem('userProfile');
    }
  }

  getUser(): { name: string; email: string; picture: string; rol:string } | null {
    // Si no hay datos en memoria, recuperarlos de localStorage
    if (!this.userData) {
      const storedUser = localStorage.getItem('userProfile');
      this.userData = storedUser ? JSON.parse(storedUser) : null;
    }

    return this.userData;
  }
}
