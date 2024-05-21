import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../interfaces/videojuego';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Cart } from '../../interfaces/cart';
import { Pedido } from '../../interfaces/pedidos';
import { PedidosService } from '../../services/pedidos.service';
import { Transaccion } from '../../interfaces/transacciones';
import { TransaccionService } from '../../services/transaccion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrl: './videogames.component.css'
})
export class VideogamesComponent implements OnInit{
  //Toast
  show = false;

  public videojuegos: Videojuego[] = []; 
  public videojuego!: Videojuego | null; 
  public videojuegosFilterGenre: Videojuego[] | null = [];
  public videojuegosFilterPlatform: Videojuego[] | null = [];
  public videojuegosFilterName: Videojuego[] | null = [];
  public videojuegosFilterPrice: Videojuego[] | null = [];
  public errorMessage!: string;

  //Genre filter
  generos: string[] = [
    'Acción', 'Aventura', 'Rol (RPG)', 'Estrategia', 'Simulación',
    'Deportes', 'Carreras', 'Puzzle', 'Plataformas', 'Terror',
    'Disparos en primera persona (FPS)', 'Disparos en tercera persona (TPS)', 
    'Lucha', 'Música y Ritmo', 'Educativos'
  ];

  //Platform filter
  selectedPlatform: string = '';
  plataformas: string[] = [
    'PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series X', 
    'Nintendo Switch', 'iOS', 'Android', 'VR', 'Mac'
  ];

  //Search name Filter
  searchTerm: string = '';

  //Price filter
  minPrice: number = 0;
  maxPrice: number = 0;

  //error
  error = false;


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

  //Payment
  amount!: number;
  response: any;

  public newTransaction: Transaccion = {
    idtransaccion: 0,
    idpedido: 2,
    fechaTransaccion: new Date().toISOString(),
    montoTransaccion: 0,
    estadoTransaccion: 'Realizada'
  };

  //Remember to take the methods before split the modules
  constructor(private videojuegoService: VideojuegosService, 
              private auth: AuthService, 
              private cartService: CartService,
              private pedidoService: PedidosService,
              private transaccionService: TransaccionService,
              private router: Router,
              ) {

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
        this.errorMessage = 'Error al obtener la lista de videojuegos.';
        this.videojuegos = [];
      }
    );
  }

  getVideojuegoById(id: number) {
    this.videojuegoService.getVideojuegosById(id).subscribe(
      (videojuego) => {
        this.router.navigate(['/videogame', videojuego.idvideojuego], { state: { data: videojuego } });
        this.errorMessage = '';
        console.log(videojuego);
      },
      (err) => {
        console.error(err)
        this.errorMessage = 'No hay videojuego con esa id';
        this.videojuego = null;
      }
    )
  }

  getVideojuegosByGenre(event: Event) {
    const target = event.target as HTMLSelectElement;
    const genre = target.value;

    if (genre === '') {
      this.getAllVideojuegos();
    } else {
      this.videojuegoService.getVideojuegosByGenre(genre).subscribe(
        (videojuegos) => {
          this.videojuegos = videojuegos;
          this.errorMessage = '';
        },
        (err) => {
          console.error(err)
          this.errorMessage = 'No se encontraron videojuegos con el género proporcionado.';
          this.videojuegos = [];
        }
      )
    }
  }

  getVideojuegosByPlatform(event: Event) {
    const target = event.target as HTMLSelectElement;
    const plataforma = target.value;

    if (plataforma === '') {
      this.getAllVideojuegos();
    } else {
      this.videojuegoService.getVideojuegosByPlatform(plataforma).subscribe(
        (videojuegos) => {
          this.videojuegos = videojuegos;
          this.errorMessage = '';
        },
        (err) => {
          console.error(err);
          this.errorMessage = 'No se encontraron videojuegos para la plataforma proporcionada.';
          this.videojuegos = [];
        }
      );
    }
  }

  getVideojuegosByName() {
    this.videojuegos = [];
    if (this.searchTerm === '') {
      this.getAllVideojuegos()
    } else {
      this.videojuegoService.getVideojuegosByName(this.searchTerm).subscribe(
        (videojuegos) => {
          if (videojuegos && videojuegos.length > 0) {
            this.videojuegos = videojuegos;
            this.errorMessage = '';
            this.error = false;
          } else {
            this.errorMessage = 'No se encontraron videojuegos para el nombre proporcionado.';
            this.error = true;
          }
        },
        (err) => {
          this.error = true;
          console.error(err);
          this.errorMessage = 'Ocurrió un error al buscar los videojuegos.';
        }
      );
    }
  }
  

  getVideogamesByPriceRange() {
    if (this.minPrice !== null || this.maxPrice !== null) {
      if (this.minPrice === null && this.maxPrice === null) {
        this.getAllVideojuegos();
      } else {
        this.videojuegoService.getVideojuegosByPriceRange(Number(this.minPrice), Number(this.maxPrice)).subscribe(
          (videojuegos) => {
            this.videojuegos = videojuegos;
            this.errorMessage = '';
          },
          (err) => {
            console.error(err);
            this.errorMessage = 'No se encontraron videojuegos dentro del rango de precios proporcionado.';
            this.videojuegos = [];
            this.error = true;
          }
        );
      }
    } else {
      // Manejar caso en el que los campos están vacíos
      this.getAllVideojuegos();
    }
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
      console.log(response.idpedido);
      this.createDetails(response);
      localStorage.setItem('idPedido', JSON.stringify(response.idpedido));
      this.clearCart();
    }, error => {
      console.error('Error al crear el pedido', error);
    })
  }

  createDetails(pedidoResponse: any) {
    console.log('Datos para crear los detalles', pedidoResponse);
    const cart: Cart = this.cartService.getCart();
    const detalles = cart.videojuegos.map(videojuego => {
      return {
        iddetallePedido: 0,
        idpedido: pedidoResponse.idpedido,
        idvideojuego: videojuego.idvideojuego,
        cantidad: videojuego.cantidad || 0, 
        precio: videojuego.precio
      };
    });

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

    this.pedidoService.createDetallesPedido(detalles).subscribe(response => {
      console.log('Detalles del pedido creado', response);
      console.log('aquí!!!!!!',)

    }, error => {
      console.error('Error al crear los detalles del pedido', error);
    });
  }

  //Transaction (payment) Method
  createTransaction() {
    try {
      this.transaccionService.simulatePayment(this.totalPrecio).subscribe(
        response => {
          this.response = response;
          console.log(this.response.amount);
          const montoTransaccion = this.response.amount;
          this.newTransaction.montoTransaccion = montoTransaccion;
          
          console.log(this.newTransaction.montoTransaccion);
          console.log(`La transacción se realizará por el monto: ${montoTransaccion}`);
          console.log(this.newTransaction);
  
          this.transaccionService.createTransaction(this.newTransaction).subscribe(
            response => {
              console.log('transacción creada:', response);
            }, error => {
              console.error('Error al crear la transacción', error);
            }
          );
        }, 
        error => {
          console.error(error);
        }
      );
    } catch (ex) {
      console.error('Error al crear la transacción', ex);
    }
  }

  //Toast

  logout() {
    this.auth.logout();
    console.log('Sesión finalizada.')
  }
}
