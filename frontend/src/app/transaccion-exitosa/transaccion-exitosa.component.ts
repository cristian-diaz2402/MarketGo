//transaccion-exitosa.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../core/services/carrito.service';

@Component({
  selector: 'app-transaccion-exitosa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaccion-exitosa.component.html',
  styleUrls: ['./transaccion-exitosa.component.css']
})
export class TransaccionExitosaComponent implements OnInit {

  constructor(private router: Router, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.carritoService.clearCart();
  }

  irInicio() {
    this.router.navigate(['home']);
  }
}