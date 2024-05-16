import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { FormBuilder } from '@angular/forms';
import { Videojuego } from '../../interfaces/videojuego';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Cart } from '../../interfaces/cart';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrl: './videogames.component.css'
})
export class VideogamesComponent implements OnInit{
  public videojuegos: Videojuego[] = []; 
  public videojuego!: Videojuego | null; 
  public videojuegosFilterGenre: Videojuego[] | null = [];
  public videojuegosFilterPlatform: Videojuego[] | null = [];
  public videojuegosFilterName: Videojuego[] | null = [];
  public videojuegosFilterPrice: Videojuego[] | null = [];
  public errorMessage!: string;

  //Cart
  cart$: Observable<Cart>;
  cantidad: { [key: number]: number } = {};
  totalPrecio: number = 0; 
  precioTotalPorVideojuego: { [key: number]: number } = {};
  

  public newVideojuegoForm: Videojuego = {
    idvideojuego: 0,
    nombreVideojuego: '',
    descripcion: '',
    precio: 0,
    cantidadStock: 0,
    plataforma: '',
    genero1: '',
    genero2: '',
    genero3: '',
    imagen: ''
  };

  public editVideojuegoForm: Videojuego = {
    idvideojuego: 0,
    nombreVideojuego: '',
    descripcion: '',
    precio: 0,
    cantidadStock: 0,
    plataforma: '',
    genero1: '',
    genero2: '',
    genero3: '',
    imagen: ''
  };

  constructor(private videojuegoService: VideojuegosService, 
              private auth: AuthService, 
              private cartService: CartService) {

    //initializer cart 
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.getAllVideojuegos();

    //Cart numbers begin in 1
    this.videojuegos.forEach(videojuego => {
      this.cantidad[videojuego.idvideojuego] = 1;
    })
    //Total price cart
    this.calcularTotalPrecio();
  }

  getAllVideojuegos() {
    this.videojuegoService.getAllVideojuegos().subscribe(
      (videojuegos) => {
        this.videojuegos = videojuegos;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getVideojuegoById(event: Event, id: string) {
    event.preventDefault();
    this.videojuegoService.getVideojuegosById(Number(id)).subscribe(
      (videojuego) => {
        this.videojuego = videojuego;
        this.errorMessage = '';
      },
      (err) => {
        console.error(err)
        this.errorMessage = 'No hay videojuego con esa id';
        this.videojuego = null;
      }
    )
  }

  getVideojuegosByGenre(event: Event, genre: string) {
    event.preventDefault();
    this.videojuegoService.getVideojuegosByGenre(genre).subscribe(
      (videojuegos) => {
        this.videojuegosFilterGenre = videojuegos;
        console.log(this.videojuegosFilterGenre);
        this.errorMessage = '';
      },
      (err) => {
        console.error(err)
        this.errorMessage = 'No se encontraron videojuegos con el género proporcionado.';
        this.videojuegosFilterGenre = null;
      }
    )
  }

  getVideojuegosByPlatform(event: Event, plataforma: string) {
    event.preventDefault();
    this.videojuegoService.getVideojuegosByPlatform(plataforma).subscribe(
      (videojuegos) => {
        this.videojuegosFilterPlatform = videojuegos;
        this.errorMessage = '';
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'No se encontraron videojuegos para la plataforma proporcionada.';
        this.videojuegosFilterPlatform = null;
      }
    );
  }

  getVideojuegosByName(event: Event, nombre: string) {
    event.preventDefault();
    this.videojuegoService.getVideojuegosByName(nombre).subscribe(
      (videojuegos) => {
        this.videojuegosFilterName = videojuegos;
        this.errorMessage = '';
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'No se encontraron videojuegos para el nombre proporcionado.';
        this.videojuegosFilterName = null;
      }
    );
  }

  getVideogamesByPriceRange(event: Event, minPrice: string, maxPrice: string) {
    event.preventDefault();
    this.videojuegoService.getVideojuegosByPriceRange(Number(minPrice), Number(maxPrice)).subscribe(
      (videojuegos) => {
        this.videojuegosFilterPrice = videojuegos;
        this.errorMessage = '';
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'No se encontraron videojuegos dentro del rango de precios proporcionado.';
        this.videojuegosFilterPrice = null;
      }
    );
  }

  createVideojuego(): void {
    this.videojuegoService.createVideojuego(this.newVideojuegoForm).subscribe(videojuego => {
      console.log('Videojuego creado:', videojuego);
    });
  }

  // editVideojuego and submitEdit are functions for edit videojuego
  editVideojuego(videojuego: Videojuego) {
    this.editVideojuegoForm = {...videojuego};
  }

  submitEdit() {
    this.videojuegoService.editVideojuego(this.editVideojuegoForm.idvideojuego, this.editVideojuegoForm).subscribe(
      (response) => {
        console.log('Videojuego actualizado con éxito', response);
      },
      (error) => {
        console.error('Error al actualizar el videojuego', error);
      }
    );
  }

  deleteVideojuego(idvideojuego: number) {
    this.videojuegoService.deleteVideojuego(idvideojuego).subscribe(
      (response) => {
        console.log('Videojuego eliminado con éxito', response);
        // Aquí puedes agregar más lógica, como actualizar la lista de videojuegos
      },
      (error) => {
        console.error('Error al eliminar el videojuego', error);
      }
    );
  }


  //CartShop
  addToCart(videojuego: Videojuego) {
    const cantidadToAdd = this.cantidad[videojuego.idvideojuego] || 1;
    const videojuegoToAdd = {...videojuego, cantidad: cantidadToAdd};
    this.cartService.addToCart(videojuegoToAdd);
  }

  removeFromCart(idvideojuego: number) {
    this.cartService.removeFromCart(idvideojuego);
    this.calcularTotalPrecio();
  }

  clearCart() {
    this.cartService.clearCart();
    this.totalPrecio = 0;
    this.precioTotalPorVideojuego = {};
  }

  calcularTotalPrecio() {
    this.cart$.subscribe(cart => {
      this.totalPrecio = cart.videojuegos.reduce((total, videojuego) => {
        const cantidad = videojuego.cantidad ?? 0; 
        return total + (videojuego.precio * cantidad);
      }, 0);

      // Calcular precio total por videojuego
      this.precioTotalPorVideojuego = {};
      cart.videojuegos.forEach(videojuego => {
        const cantidadPorV = videojuego.cantidad ?? 0; 
        this.precioTotalPorVideojuego[videojuego.idvideojuego] = videojuego.precio * cantidadPorV;
      });
    });
  }




  logout() {
    this.auth.logout();
    console.log('Sesión finalizada.')
  }
}
