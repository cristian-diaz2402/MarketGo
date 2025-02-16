//transaccion-fallida.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaccion-fallida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaccion-fallida.component.html',
  styleUrls: ['./transaccion-fallida.component.css']
})
export class TransaccionFallidaComponent implements OnInit {
  productosSinStock: string[] = [];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
        const productos = params.get('productos');
        if (productos) {
            this.productosSinStock = productos.split(',');
            console.log('Productos sin stock obtenidos del backend:', this.productosSinStock);
        }
    });
}


  irInicio() {
    this.router.navigate(['home']);
  }
}
