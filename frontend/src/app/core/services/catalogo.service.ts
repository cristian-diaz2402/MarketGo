import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; // Importamos la función uuidv4


@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  // Definimos un objeto que contiene arrays de productos por cada catálogo
  private catalogos: { [key: string]: any[] } = {
    'carnes': [
      { name: 'Carne de Paleta Especial', price: 14.33, image: '../../assets/Carnes/carne_paleta_especial.jpg' },
      { name: 'Carne Molida de Res Tipo I', price: 5.80, image: '../../assets/Carnes/Carne Molida de Res Tipo I.jpg' },
      { name: 'Carnes para Parrillada Federer', price: 3.49, image: '../../assets/Carnes/Carnes para Parrillada Federer.jpg' },
      { name: 'Carne Molida de Ternero', price: 2.44, image: '../../assets/Carnes/Carne Molida de Ternero.jpg' },
      { name: 'Carne de Res Picana Corte', price: 25.88, image: '../../assets/Carnes/Carne de Res Picana Corte.jpg' },
      { name: 'Carne Molida de Cerdo Tipo II Especial', price: 3.17, image: './assets/Carnes/Carne Molida de Cerdo Tipo II Especial.jpg' },      { name: 'Churrasco de Res', price: 6.37, image: '../../assets/Carnes/Churrasco de Res.jpg' },
      { name: 'Carne de Res Top Round Cecina', price: 5.86, image: '../../assets/Carnes/Carne de Res Top Round Cecina.jpg' },
      { name: 'Carne de Cerdo Osobuco', price: 1.86, image: '../../assets/Carnes/Carne de Cerdo Osobuco.jpg' },
      { name: 'Carne de Res para Sopa Sin Hueso', price: 6.15, image: '../../assets/Carnes/Carne de Res para Sopa Sin Hueso.jpg' },  
    ],
    'lácteos': [
      { name: 'Leche Semidescremada Vita', price: 1.34, image: '../../assets/lacteos/Leche Semidescremada Vita.jpg' },
      { name: 'Leche Deslactosada Vita Funda', price: 0.97, image: '../../assets/lacteos/Leche Deslactosada Vita Funda.jpg' },
      { name: 'Yogurt Bebible Natural Reyogurt', price: 1.36, image: '../../assets/lacteos/Yogurt Bebible Natural Reyogurt.jpg' },
      { name: 'Leche Entera Vita Funda', price: 1.02, image: '../../assets/lacteos/Leche Entera Vita Funda.jpg' },
      { name: 'Yogurt Bebible Funda Natural Kiosko Alpina', price: 1.46, image: '../../assets/lacteos/Yogurt Bebible Funda Natural Kiosko Alpina.jpg' },
      { name: 'Yogurt Bebible Trozos Mora Regeneris', price: 5.55, image: '../../assets/lacteos/Yogurt Bebible Trozos Mora Regeneris.jpg' },
      { name: 'Leche Entera Nutri Tetra Square', price: 0.68, image: '../../assets/lacteos/Leche Entera Nutri Tetra Square.jpg' },
      { name: 'Postre de Yogurt Lactel', price: 2.90, image: '../../assets/lacteos/Postre de Yogurt Lactel.jpg' },
      { name: 'Queso Crema Light Toni', price: 2.50, image: '../../assets/lacteos/Queso Crema Light Toni.jpg' },
      { name: 'Mantequilla Con Sal Miraflores', price: 1.86, image: '../../assets/lacteos/Mantequilla Con Sal Miraflores.jpg' },  
    ],
    'aseo personal': [
      { name: 'Crema Dental Menta Pura Colgate', price: 1.63, image: '../../assets/aseo_personal/Crema Dental Menta Pura Colgate.jpg' },
      { name: 'Cepillo Dental para Adulto Cepimax Suave', price: 0.69, image: '../../assets/aseo_personal/Cepillo Dental para Adulto Cepimax Suave.jpg' },
      { name: 'Crema Dental Luminous White con Carbón Activado Colgate', price: 2.99, image: '../../assets/aseo_personal/Crema Dental Luminous White con Carbón Activado Colgate.jpg' },
      { name: 'Enjuague Bucal Sabor Menta Suave Gama', price: 1.63, image: '../../assets/aseo_personal/Enjuague Bucal Sabor Menta Suave Gama.jpg' },
      { name: 'Hilo Dental Total Encerado Flúor y Menta Colgate', price: 2.53, image: '../../assets/aseo_personal/Hilo Dental Total Encerado Flúor y Menta Colgate.jpg' },
      { name: 'Jabón Líquido para Manos y Cuerpo Hidratante Antibacterial Bacterion', price: 2.16, image: '../../assets/aseo_personal/Jabón Líquido para Manos y Cuerpo Hidratante Antibacterial Bacterion.jpg' },
      { name: 'Shampoo Restauración Del Cabello Pantene', price: 9.14, image: '../../assets/aseo_personal/Shampoo Restauración Del Cabello Pantene.jpg' },
      { name: 'Jabón En Barra Blanco', price: 2.99, image: '../../assets/aseo_personal/Jabón En Barra Blanco.jpg' },
      { name: 'Acondicionador Frizz Ease Flawlessly Straight John Frieda', price: 8.33, image: '../../assets/aseo_personal/Acondicionador Frizz Ease Flawlessly Straight John Frieda.jpg' },
      { name: 'Cepillo de Cabello Plano Plástico Pequeño Vandux', price: 2.78, image: '../../assets/aseo_personal/Cepillo de Cabello Plano Plástico Pequeño Vandux.jpg' },
      
    ],
    'bebidas': [
      { name: 'Bebida De Almendra Sin Azúcar Natures Heart', price: 3.17, image: '../../assets/bebidas/Bebida De Almendra Sin Azúcar Natures Heart.jpg' },
      { name: 'Jugo de Naranja 100% Natural', price: 5.51, image: '../../assets/bebidas/Jugo de Naranja 100 Natural.jpg' },
      { name: 'Bebida Gaseosa Sin Azúcar Coca Cola', price: 0.36, image: '../../assets/bebidas/Bebida Gaseosa Sin Azúcar Coca Cola.jpg' },
      { name: 'Agua Sin Gas Dasani', price: 0.45, image: '../../assets/bebidas/Agua Sin Gas Dasani.jpg' },
      { name: 'Agua Mineral Sabor Toronja Imperial', price: 0.75, image: '../../assets/bebidas/Agua Mineral Sabor Toronja Imperial.jpg' },
      { name: 'Bebida De Mora Orangine', price: 1.45, image: '../../assets/bebidas/Bebida De Mora Orangine.jpg' },
      { name: 'Bebida de Malta Pony', price: 0.45, image: '../../assets/bebidas/Bebida de Malta Pony.jpg' },
      { name: 'Licor de Hierbas Jagermeister', price: 26.7, image: '../../assets/bebidas/Licor de Hierbas Jagermeister.jpg' },
      { name: 'Licor Switch Triple X Venetto', price: 2.77, image: '../../assets/bebidas/Licor Switch Triple X Venetto.jpg' },
      { name: 'Jugo de Coco Natures Heart', price: 3.86, image: '../../assets/bebidas/Juego de Coco Natures Heart.jpg' },
      
    ],
    'frutas': [
      { name: 'Manzana Ana Granel', price: 0.24, image: '../../assets/frutas/Manzana Ana Granel.jpg' },
      { name: 'Banano/plátano', price: 1.20, image: '../../assets/frutas/Bananoplátano.jpg' },
      { name: 'Pitahaya Fresca', price: 0.64, image: '../../assets/frutas/Pitahaya Fresca.jpg' },
      { name: 'Papaya Hawaiana', price: 0.80, image: '../../assets/frutas/Papaya Hawaiana.jpg' },
      { name: 'Platano Verde', price: 0.24, image: '../../assets/frutas/Platano Verde.jpg' },
      { name: 'Limón', price: 3.29, image: '../../assets/frutas/Limón.jpg' },
      { name: 'Piña Especial Al Granel', price: 1.48, image: '../../assets/frutas/Piña Especial Al Granel.jpg' },
      { name: 'Naranja Navel', price: 1.17, image: '../../assets/frutas/Naranja Navel.jpg' },
      { name: 'Frutilla Termosellada', price: 2.41, image: '../../assets/frutas/Frutilla Termosellada.jpg' },
      { name: 'Pera Al Granel', price: 0.36, image: '../../assets/frutas/Pera Al Granel.jpg' },
      
    ],
    'limpieza': [
      { name: 'Cloro Liquido Limpieza Cítrica Tips', price: 0.92, image: '../../assets/limpieza/Cloro Liquido Limpieza Cítrica Tips.jpg' },
      { name: 'Desinfectante Con Amonio Cuaternario Aroma Eucalipto Kalipto', price: 1.74, image: '../../assets/limpieza/Desinfectante Con Amonio Cuaternario Aroma Eucalipto Kalipto.jpg' },
      { name: 'Trapeador Microfibra con Algodón Estándar', price: 1.58, image: '../../assets/limpieza/Trapeador Microfibra con Algodón Estándar.jpg' },
      { name: 'Escoba con Cabeza Roscable de Neón con Cuerpo y Cerdas Plásticas La Brujita', price: 2.30, image: '../../assets/limpieza/Escoba con Cabeza Roscable de Neón con Cuerpo y Cerdas Plásticas La Brujita.jpg' },
      { name: 'Detergente en Polvo Aroma Brisa Primavera Deja', price: 4.88, image: '../../assets/limpieza/Detergente en Polvo Aroma Brisa Primavera Deja.jpg' },
      { name: 'Suavizante de Ropa Cuidado Superior Fresca Primavera Suavitel', price: 4.29, image: '../../assets/limpieza/Suavizante de Ropa Cuidado Superior Fresca Primavera Suavitel.jpg' },
      { name: 'Lavavajilla En Crema Manzana Lava', price: 2.97, image: '../../assets/limpieza/Lavavajilla En Crema Manzana Lava.jpg' },
      { name: 'Esponja Mixta Flash Lustre', price: 0.54, image: '../../assets/limpieza/Esponja Mixta Flash Lustre.jpg' },
      { name: 'Toalla de Cocina Kraft Generación Verde Generación Verde', price: 3.83, image: '../../assets/limpieza/Toalla de Cocina Kraft Generación Verde Generación Verde.jpg' },
      { name: 'Recogedor De Basura Plegable Mango Largo', price: 4.22, image: '../../assets/limpieza/Recogedor De Basura Plegable Mango Largo.jpg' },  
    ],
    'snacks': [
      { name: 'Snacks Mix Sabor Natural', price: 0.72, image: '../../assets/snacks/Snacks Mix Sabor Natural.jpg' },
      { name: 'Papas Fritas Sabor Naturales Ruffles', price: 4.85, image: '../../assets/snacks/Papas Fritas Sabor Naturales Ruffles.jpg' },
      { name: 'Bocaditos de Maíz Mega Queso Doritos', price: 0.90, image: '../../assets/snacks/Bocaditos de Maíz Mega Queso Doritos.jpg' },
      { name: 'Chifles de Sal La Original Funda', price: 0.24, image: '../../assets/snacks/Chifles de Sal La Original Funda.jpg' },
      { name: 'Snacks Mix Sabor Natural Pica Pica', price: 0.72, image: '../../assets/snacks/Snacks Mix Sabor Natural Pica Pica.jpg' },
      { name: 'Bocaditos de Maiz Sabor A Original K-Chitos', price: 1.32, image: '../../assets/snacks/Bocaditos de Maiz Sabor A Original K-Chitos.jpg' },
      { name: 'Habas Picantes Cerveceras Lanher Snacks', price: 2.20, image: '../../assets/snacks/Habas Picantes Cerveceras Lanher Snacks.jpg' },
      { name: 'Maní Salado Supermaxi Funda', price: 3.89, image: '../../assets/snacks/Maní Salado Supermaxi Funda.jpg' },
      { name: 'Cueritos Bocaditos Sabor Natural', price: 2.66, image: '../../assets/snacks/Cueritos Bocaditos Sabor Natural.jpg' },
      { name: 'Papas Fritas Artesanas Sabor Natural Lays', price: 0.53, image: '../../assets/snacks/Papas Fritas Artesanas Sabor Natural Lays.jpg' },
      
    ],
    'verduras': [
      { name: 'Zanahoria Amarilla', price: 0.13, image: '../../assets/verduras/Zanahoria Amarilla.jpg' },
      { name: 'Cebolla Paiteña Perla', price: 0.18, image: '../../assets/verduras/Cebolla Paiteña Perla.jpg' },
      { name: 'Tomate Riñón', price: 0.29, image: '../../assets/verduras/Gran fuente de Licopeno.jpg' },
      { name: 'Cebolla Paiteña Roja', price: 0.19, image: '../../assets/verduras/Cebolla Paiteña Roja.jpg' },
      { name: 'Pepinillo', price: 0.19, image: '../../assets/verduras/Pepinillo.jpg' },
      { name: 'Pimiento Verde', price: 0.16, image: '../../assets/verduras/Pimiento Verde.jpg' },
      { name: 'Brocoli Fresco', price: 0.77, image: '../../assets/verduras/Brocoli Fresco.jpg' },
      { name: 'Apio Fresco Al Granel', price: 0.65, image: '../../assets/verduras/Apio Fresco Al Granel.jpg' },
      { name: 'Suquini Fresco', price: 0.21, image: '../../assets/verduras/Suquini Fresco.jpg' },
      { name: 'Remolacha Granel', price: 0.18, image: '../../assets/verduras/Remolacha Granel.jpg' },
    ]
  };

  constructor() {
        // Generamos los IDs únicos al inicializar el servicio
        Object.keys(this.catalogos).forEach(catalogo => {
          this.catalogos[catalogo] = this.catalogos[catalogo].map(product => ({
            ...product,
            id: uuidv4()
          }));
        });
   }

  getProductsByCatalog(catalogName: string): Observable<any[]> {
    const products = this.catalogos[catalogName] || [];
    return of(products);
  }
}