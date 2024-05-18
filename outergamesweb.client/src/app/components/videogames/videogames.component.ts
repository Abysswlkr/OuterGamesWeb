import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { FormBuilder } from '@angular/forms';
import { Videojuego } from '../../interfaces/videojuego';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Cart } from '../../interfaces/cart';
import { Pedido } from '../../interfaces/pedidos';
import { PedidosService } from '../../services/pedidos.service';

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

  //Cart
  cart$: Observable<Cart>;
  cantidad: { [key: number]: number } = {};
  totalPrecio: number = 0; 
  precioTotalPorVideojuego: { [key: number]: number } = {};
  
  //Order
  public pedido!: Pedido | null;

  //Remember to take the methods before split the modules
  constructor(private videojuegoService: VideojuegosService, 
              private auth: AuthService, 
              private cartService: CartService,
              private pedidoService: PedidosService) {

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


  //Create Order and details
  createPedido() {
    const cart: Cart =this.cartService.getCart();
    const pedido: Pedido = {
      idpedido: 0,
      idusuario: cart.idusuario,
      fechaPedido: cart.fechaPedido,
      estadoPedido: 'Solicitado'
    };

    this.pedidoService.createPedido(pedido).subscribe(response => {
      console.log('Pedido creado', response);
      this.createDetails(response);
    }, error => {
      console.error('Error al crear el pedido', error);
    })
  }

  createDetails(pedidoResponse: any) {
    console.log('Datos para crear los detalles', pedidoResponse);
  
    const cart: Cart = this.cartService.getCart();
    const detalles = cart.videojuegos.map(videojuego => {
      console.log(videojuego);
      return {
        iddetallePedido: 0,
        idpedido: pedidoResponse.idpedido,
        idvideojuego: videojuego.idvideojuego,
        cantidad: videojuego.cantidad || 0, // Asegurarse de que cantidad esté definida
        precio: videojuego.precio
      };
    });
  
    this.pedidoService.createDetallesPedido(detalles).subscribe(response => {
      console.log('Detalles del pedido creado', response);
  
      // Ahora actualizamos el stock de cada videojuego
      cart.videojuegos.forEach(videojuego => {
        if (videojuego.cantidad !== undefined) {
          const updatedVideojuego = {
            ...videojuego,
            cantidadStock: (videojuego.cantidadStock || 0) - videojuego.cantidad 
          };
  
          this.editVideojuego(updatedVideojuego);
          this.submitEdit();
        } else {
          console.error('La cantidad del videojuego no está definida');
        }
      });
    }, error => {
      console.error('Error al crear los detalles del pedido', error);
    });
  }

  logout() {
    this.auth.logout();
    console.log('Sesión finalizada.')
  }
}
