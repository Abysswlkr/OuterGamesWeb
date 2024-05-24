import { Component, OnInit } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { CartService } from '../../services/cart.service';
import { Pedido } from '../../interfaces/pedidos';
import { PedidosService } from '../../services/pedidos.service';
import { Videojuego } from '../../interfaces/videojuego';
import { Observable, map } from 'rxjs';
import { VideojuegosService } from '../../services/videojuegos.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

    //Cart
    cart$: Observable<Cart>;
    cantidad: { [key: number]: number } = {};
    totalPrecio: number = 0; 
    precioTotalPorVideojuego: { [key: number]: number } = {};
    totalItems: Observable<number>;
    
    //Order
    public pedido!: Pedido | null;

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

    //Alert
    showAlert: boolean = false;
    alertMessage: string = '';
    alertType: string = 'success';

  constructor (private cartService: CartService, private pedidoService: PedidosService, private videojuegoService: VideojuegosService) {
    this.cart$ = this.cartService.cart$;

    this.totalItems = this.cart$.pipe(
      map(cart$ => cart$.videojuegos.reduce((acc, videojuego) => acc + (videojuego.cantidad ?? 0), 0))
    );
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

    ngOnInit(): void {
      this.calcularTotalPrecio();
      localStorage.setItem('totalPrecioCart', this.totalPrecio.toString());
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

        this.alertMessage = 'Se ha creado tu pedido';
        this.alertType = 'success';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);

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
      }, error => {
        console.error('Error al crear los detalles del pedido', error);
      });
    }
}
