// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonIniciarsesionComponent } from '../boton-iniciarsesion/boton-iniciarsesion.component';
import { BotonRegistrarComponent } from '../boton-registrar/boton-registrar.component';
import { CaptchaComponent } from '../captcha/captcha.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    BotonIniciarsesionComponent,
    BotonRegistrarComponent,
    CaptchaComponent,
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  isCaptchaValid: boolean = false;
  isOtherButtonDisabled: boolean = false; // Nueva propiedad

  constructor(private toastr: ToastrService) {}

  onCaptchaValidated(isValid: boolean): void {
    this.isCaptchaValid = isValid;
    if (isValid) {
      this.toastr.success('CAPTCHA validado correctamente.');
    } else {
      this.toastr.error('Por favor, complete el CAPTCHA.');
    }
  }

    // Método para gestionar el estado de desactivación del botón opuesto
    setOtherButtonState(state: boolean): void {
      this.isOtherButtonDisabled = state;
    }

    
}
