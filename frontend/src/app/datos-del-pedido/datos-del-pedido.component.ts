//datos-del-pedido.component.ts
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidacionesService } from '../services/validaciones.service';
import { FormsModule } from '@angular/forms';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { CarritoService } from '../core/services/carrito.service';
import { UserService } from '../core/services/user.service';

declare var google: any;

@Component({
  selector: 'app-datos-del-pedido',
  standalone :true,
  templateUrl: './datos-del-pedido.component.html',
  styleUrl: './datos-del-pedido.component.css',
  imports: [CommonModule, FormsModule],
})
export class DatosDelPedidoComponent implements OnInit{
  
  cartItems: any[] = [];
  cartSummary: { subtotal: number; iva: number; total: number } = { subtotal: 0, iva: 0, total: 0 };
  
  constructor(private router: Router, private validationService: ValidacionesService, private http: HttpClient, private carritoService: CarritoService, private userService: UserService) {}
  
  ngOnInit() {
    this.carritoService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      console.log('Items del carrito:', this.cartItems);
    });
  
    this.carritoService.cartSummary$.subscribe((summary) => {
      this.cartSummary = summary;
      console.log('Resumen del carrito:', this.cartSummary);
    });
  
    // Sincronizar datos iniciales explícitamente
    this.carritoService.sendCartData(
      this.carritoService.getCartItems(),
      { ...this.carritoService['cartSummary'] }
    );
  }
  
  toggleMapa() {
    this.mostrarMapa = true;
    setTimeout(() => this.initMap(), 0); // Asegura que el mapa se inicialice después de renderizar el DOM
  }

  initMap() {
    const mapOptions = {
      center: { lat: -0.1807, lng: -78.4678 }, // Quito como ejemplo inicial
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Crea el marcador en el mapa
    this.marker = new google.maps.Marker({
      position: mapOptions.center,
      map: this.map,
      draggable: true,
    });

    // Habilitar cuadro de búsqueda
    const searchBox = new google.maps.places.SearchBox(this.searchBox.nativeElement);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      this.map.setCenter(place.geometry.location);
      this.marker.setPosition(place.geometry.location);

      // Asignar dirección seleccionada
      this.datosCliente.direccion = place.formatted_address || '';
    });

    // Escucha el arrastre del marcador
    google.maps.event.addListener(this.marker, 'dragend', () => {
      const position = this.marker.getPosition();
      if (position) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK && results[0]) {
            this.datosCliente.direccion = results[0].formatted_address;
          }
        });
      }
    });

      // Listener para restaurar los controles después de salir de Street View
      this.map.getStreetView().addListener('visible_changed', () => {
        const isStreetViewVisible = this.map.getStreetView().getVisible();
        const searchBoxElement = this.searchBox.nativeElement;
        const closeButton = document.querySelector('.close-btn') as HTMLElement;
      
        if (isStreetViewVisible) {
          // Ocultar controles en Street View
          searchBoxElement.style.display = 'none';
          if (closeButton) closeButton.style.display = 'none';
        } else {
          // Restaurar visibilidad de controles
          searchBoxElement.style.display = 'block';
          if (closeButton) closeButton.style.display = 'block';
        }
      });
      
  }


  cerrarMapa() {
    this.mostrarMapa = false;
  }

  // Guardar datos en localStorage
  private saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('cartSummary', JSON.stringify(this.cartSummary));
  }  
  
  
  @Output() paymentMethodSelected: EventEmitter<string> = new EventEmitter<string>();
  selectedPaymentMethod: string = '';
  
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('searchBox') searchBox!: ElementRef;

  datosCliente = {
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    cedula: ''
  };

  mostrarMapa = false; // Controla la visibilidad del mapa
  map: any;
  marker: any;

  errores = {
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    cedula: ''
  };

  camposTocados = {
    nombre: false,
    correo: false,
    telefono: false,
    direccion: false,
    cedula: false
  };

  formValido = false;

  

  onPaymentMethodChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedPaymentMethod = selectedValue;

    if (selectedValue !== 'paypal') {
      this.showNotification('Disponible próximamente');
    }

    this.paymentMethodSelected.emit(selectedValue);
  }

  showNotification(message: string): void {
    const notificationContainer = document.getElementById('notification');
    if (notificationContainer) {
      notificationContainer.innerText = message;
      notificationContainer.classList.add('visible');

      // Ocultar después de 3 segundos
      setTimeout(() => {
        notificationContainer.classList.remove('visible');
      }, 3000);
    }
  }

  validarDatos() {
    // Validar todos los campos cada vez que hay un cambio
    Object.keys(this.datosCliente).forEach(campo => {
      const key = campo as keyof typeof this.datosCliente;
      this.camposTocados[key] = true;
      this.validarCampo(key);
    });
    this.actualizarEstadoFormulario();
  }

  private validarCampo(campo: keyof typeof this.datosCliente) {
    const valor = this.datosCliente[campo];
    if (valor.length > 0) {
      switch(campo) {
        case 'nombre':
          this.errores.nombre = this.validationService.validarNombre(valor);
          break;
        case 'correo':
          this.errores.correo = this.validationService.validarCorreo(valor);
          break;
        case 'telefono':
          this.errores.telefono = this.validationService.validarTelefono(valor);
          break;
        case 'direccion':
          this.errores.direccion = this.validationService.validarDireccion(valor);
          break;
        case 'cedula':
          this.errores.cedula = this.validationService.validarCedula(valor);
          break;
      }
    }
  }

  private actualizarEstadoFormulario() {
    const todosLosCamposLlenos = Object.values(this.datosCliente)
      .every(valor => valor.trim().length > 0);
      
    const todosLosCamposValidos = Object.keys(this.datosCliente)
      .every(campo => {
        const key = campo as keyof typeof this.datosCliente;
        return this.datosCliente[key].trim().length > 0 && !this.errores[key];
      });

    this.formValido = todosLosCamposLlenos && todosLosCamposValidos;
  }

  esValido(campo: keyof typeof this.errores): boolean {
  // Se usa el servicio de validación para validar el campo
  if (this.camposTocados[campo] && !this.errores[campo] && this.datosCliente[campo].length > 0) {
    switch (campo) {
      case 'nombre':
        return !this.validationService.validarNombre(this.datosCliente[campo]);
      case 'correo':
        return !this.validationService.validarCorreo(this.datosCliente[campo]);
      case 'telefono':
        return !this.validationService.validarTelefono(this.datosCliente[campo]);
      case 'direccion':
        return !this.validationService.validarDireccion(this.datosCliente[campo]);
      case 'cedula':
        return !this.validationService.validarCedula(this.datosCliente[campo]);
      default:
        return false;
    }
  }
  return false;
}

esInvalido(campo: keyof typeof this.errores): boolean {
  // Se usa el servicio de validación para verificar si hay un error
  if (this.camposTocados[campo] && !!this.errores[campo]) {
    switch (campo) {
      case 'nombre':
        return !!this.validationService.validarNombre(this.datosCliente[campo]);
      case 'correo':
        return !!this.validationService.validarCorreo(this.datosCliente[campo]);
      case 'telefono':
        return !!this.validationService.validarTelefono(this.datosCliente[campo]);
      case 'direccion':
        return !!this.validationService.validarDireccion(this.datosCliente[campo]);
      case 'cedula':
        return !!this.validationService.validarCedula(this.datosCliente[campo]);
      default:
        return false;
    }
  }
  return false;
}


  submitForm() {
    Object.keys(this.camposTocados).forEach(campo => {
      this.camposTocados[campo as keyof typeof this.camposTocados] = true;
      this.validarCampo(campo as keyof typeof this.datosCliente);
    });
    
    this.actualizarEstadoFormulario();
    
  }

  get confirmar(): boolean {
    return this.formValido && this.selectedPaymentMethod === 'paypal';
  }

  mostrarPopup = false;

  // Controla la apertura del popup
  mostrarVentanaEmergente() {
    this.mostrarPopup = true;
  }

// Función para enviar datos del formulario al backend y abrir el popup
enviarDatosAlBackend() {
  const url = 'https://backend-marketgo.onrender.com/payment/create-order';

  const subtotal = parseFloat(this.cartSummary.subtotal.toFixed(2));
  const iva = parseFloat(this.cartSummary.iva.toFixed(2));
  const total = parseFloat(this.cartSummary.total.toFixed(2));
  const user = this.userService.getUser();
  if (!user) {
    alert('No se ha encontrado un usuario autenticado. Por favor, inicie sesión.');
    return;
  }
  const payload = {
    emailUserMarketgo: user.email, // Agregar el email al objeto datosCliente
    cartItems: this.cartItems.map(item => ({
      name: item.nombre,
      price: item.precio,
      quantity: item.quantity,
      iva: item.iva,
      subtotal: item.subtotal,
      total: item.total,
      ivaIndicador: item.iva === 0 ? "Sin IVA" : "Con IVA",

    })),
    subtotal,
    iva,
    total,
    datosCliente: this.datosCliente, // Añadir datos del cliente 
    cartSummary: this.cartSummary // Añadir resumen del carrito
  };

  console.log('Payload enviado al backend:', payload);

  this.http.post<{ approveUrl: string }>(url, payload).subscribe({
    next: (response) => {
      console.log('Respuesta del backend:', response);

      if (response.approveUrl) {
        window.location.href = response.approveUrl;
      } else {
        alert('No se pudo obtener la URL de aprobación de PayPal.');
      }
    },
    error: (error) => {
      console.error('Error al enviar datos al backend:', error);
      alert('Ocurrió un error al procesar el pago. Inténtelo de nuevo.');
    },
  });
}

// Confirmar acción y llamar al backend
confirmarAccion() {
  if (this.confirmar) {
    this.enviarDatosAlBackend();
    console.log('Pedido confirmado. Procesando pago con PayPal...');
  } else {
    alert('Por favor, complete todos los campos correctamente y seleccione PayPal como método de pago.');
  }
}

  // Acción al cancelar
  cancelarAccion() {
    this.mostrarPopup = false;
    console.log('Acción cancelada.');
  }

  mostrarPopup2 = false;

  // Controla la apertura del popup
  mostrarVentanaEmergente2() {
    this.mostrarPopup2 = true;
  }

  // Acción al confirmar
  confirmarAccion2() {
    this.mostrarPopup2 = true;
    this.router.navigate(['carrito']);
    console.log('Pedido confirmado.');
  }

  // Acción al cancelar
  cancelarAccion2() {
    this.mostrarPopup2 = false;
    console.log('Acción cancelada.');
  }
}
