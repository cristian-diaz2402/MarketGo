//agregar-productos.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BuscarProdService } from '../core/services/buscarprod.service';


@Component({
  selector: 'app-agregar-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-productos.component.html',
  styleUrls: ['./agregar-productos.component.css'],
})
export class AgregarProductosComponent {
  productForm: FormGroup;
  showModal: boolean = false; // Controlar si el modal está visible
  modalMessage: string = '';  // Mensaje del modal
  notifications: string[] = [];  
  // Lista de opciones válidas para el campo 'catalog'
  validCatalogs = ['carnes', 'lácteos', 'verduras', 'frutas', 'snacks', 'aseo_Personal', 'limpieza', 'bebidas'];

  constructor(private fb: FormBuilder, private router: Router, private buscarProdService: BuscarProdService) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      catalog: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern(/^[0-9]+(\s\w+)?$/)]],
      price: [null, [
        Validators.required, 
        Validators.min(0.01), 
        Validators.pattern(/^\d+(\.\d{1,2})?$/)  // Valida que el número tenga un máximo de 2 decimales con punto
      ]],
      units: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.maxLength(250)],
      imageUrl: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      iva: ['', Validators.required] // Agregar la validación de IVA
    });
  }
  loadProductsFromCatalog() {
    const selectedCatalog = this.productForm.get('catalog')?.value;
    console.log('Catálogo seleccionado:', selectedCatalog);

    // Aquí puedes agregar lógica para cargar productos específicos según el catálogo seleccionado
    // Por ejemplo, llamar a un servicio para obtener productos
  }

  // Validador personalizado para el campo 'catalog'
  catalogValidator(control: any) {
    if (!control.value || this.validCatalogs.includes(control.value)) {
      return null; // Si es válido, no retorna error
    } else {
      return { invalidCatalog: true }; // Si no es válido, devuelve un error
    }
  }

  // Función que se ejecuta cuando el usuario hace clic en el botón "Guardar"
  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        nombre: this.productForm.get('productName')?.value,
        catalogo: this.productForm.get('catalog')?.value,
        cantidad: this.productForm.get('quantity')?.value,
        precio: parseFloat(this.productForm.get('price')?.value),
        unidades: parseInt(this.productForm.get('units')?.value, 10),
        descripcion: this.productForm.get('description')?.value,
        imagen: this.productForm.get('imageUrl')?.value,
        iva: this.productForm.get('iva')?.value === 'yes', // Convertir 'yes'/'no' a booleano
      };

      this.buscarProdService.createProduct(productData).subscribe({
        next: (response) => {
          console.log('Producto creado exitosamente:', response);
          this.showNotification('Producto agregado correctamente.');
          this.router.navigate(['/inventario']); // Redirigir al inventario
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          this.showNotification('Error al agregar el producto.');
        },
      });
    } else {
      this.showNotification('El formulario tiene errores. Por favor, corrígelos antes de guardar.');
    }
  }

  onDiscardClick() {
    this.showConfirmationModal('¿Está seguro que desea descartar los cambios?');
  }

  showConfirmationModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  onConfirm() {
    this.showModal = false;
    if (this.modalMessage.includes('guardar')) {
      console.log('Formulario guardado:', this.productForm.value);
      // Lógica para guardar producto, por ejemplo, enviar a un API
      this.showNotification('Producto agregado');
    } else if (this.modalMessage.includes('descartar')) {
      console.log('Cambios descartados');
      this.productForm.reset();
      this.router.navigate(['/inventario']); // Redirige a la ruta /inventario
    }
  }

  onCancel() {
    this.showModal = false;
    this.showNotification('Acción cancelada');
  }

  showNotification(message: string) {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications.shift();  // Elimina la primera notificación después de 3 segundos
    }, 3000);
  }
  onPriceInput(event: any) {
    // Reemplazar las comas por puntos en el campo de texto
    const input = event.target.value;
    if (input.includes(',')) {
      event.target.value = input.replace(',', '.');
    }
  }
}


 


