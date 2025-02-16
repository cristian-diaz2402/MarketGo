import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CarruselComponent } from '../carrusel/carrusel.component'; 
import { BarraDeBusquedaComponent } from '../barra-de-busqueda/barra-de-busqueda.component';
import { BarraNavegacionComponent } from '../barra-navegacion/barra-navegacion.component';
import { HamburguesaComponent } from '../hamburguesa/hamburguesa.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CarruselComponent, BarraNavegacionComponent, HamburguesaComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navCarnicos() {
    this.router.navigate(['carnicos']);
  }

  navLacteos() {
    this.router.navigate(['lacteos']);
  }

  navAseoP() {
    this.router.navigate(['aseo_personal']);
  }

  navBebidas() {
    this.router.navigate(['bebidas']);
  }

  navFrutas() {
    this.router.navigate(['frutas']);
  }

  navLimpieza() {
    this.router.navigate(['limpieza']);
  }

  navSnacks() {
    this.router.navigate(['snacks']);
  }

  navVerduras() {
    this.router.navigate(['verduras']);
  }

  ngOnInit(): void {
    // Escuchar el fragmento de la URL
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'catalogo') {
        this.scrollToCatalogo();
      }
    });
  }

  // Función para hacer scroll hacia la sección "catalogo"
  scrollToCatalogo() {
    const catalogoSection = document.getElementById('catalogo');
    if (catalogoSection) {
      catalogoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
