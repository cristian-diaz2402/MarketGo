import { Component } from '@angular/core';
import { BarraNavegacionComponent } from '../../principal/barra-navegacion/barra-navegacion.component';
import { HamburguesaComponent } from '../../principal/hamburguesa/hamburguesa.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ BarraNavegacionComponent, HamburguesaComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export default class AboutComponent {

}
