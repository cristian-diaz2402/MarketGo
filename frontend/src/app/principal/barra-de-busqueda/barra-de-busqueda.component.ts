//barra-de-busqueda.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barra-de-busqueda',
  standalone: true,
  templateUrl: './barra-de-busqueda.component.html',
  styleUrls: ['./barra-de-busqueda.component.css'],
  imports: [CommonModule]
})
export class BarraDeBusquedaComponent {
  searchTerm$ = new Subject<string>();
  suggestions: any[] = [];
  inputFocused = false; // Nueva propiedad para manejar el foco

  constructor(private http: HttpClient, private router: Router) {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchProducts(term.toLowerCase()).pipe(
        catchError(() => of([]))
      ))
    ).subscribe(results => {
      this.suggestions = results;
    });
  }

  searchProducts(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any[]>(`https://backend-marketgo.onrender.com/autosuggest?nombre=${term}`);
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchTerm$.next(target.value);
      if (target.value === '') {
        this.suggestions = [];
      }
    }
  }

  onSuggestionClick(suggestion: any) {
    console.log('Producto seleccionado:', suggestion);
    this.router.navigate(['/detalles', suggestion.id], { state: { product: suggestion } });
  }

  onBlur() {
    this.inputFocused = false; // Actualiza el estado de foco
    setTimeout(() => {
      if (!this.inputFocused) {
        this.suggestions = []; // Limpia las sugerencias si no está enfocado
      }
    }, 200); // Retraso breve para evitar conflictos con el clic en las sugerencias
  }

  onFocus() {
    this.inputFocused = true; // Marca el estado como enfocado
  }
}

