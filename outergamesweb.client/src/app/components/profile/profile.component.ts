import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from '../../interfaces/pedidos';
import { Usuario } from '../../interfaces/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Transaccion } from '../../interfaces/transacciones';
import { Observable } from 'rxjs';
import { Cart } from '../../interfaces/cart';
import { CartService } from '../../services/cart.service';

interface ListItem {
  icon: string;
  text: string;
  hover: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit{
  //menu context
  userData: boolean = true;
  orderData: boolean = false;
  isHovered1: boolean = false;
  isHovered2: boolean = false;

  //Orders list
  pedidos: Pedido[] = [];

  //user data
  usuario: Usuario | undefined;

  //Payment
  amount!: number;
  response: any;
  totalPrecio: number = 0; 
  cart$: Observable<Cart>;
  cantidad: { [key: number]: number } = {};
  precioTotalPorVideojuego: { [key: number]: number } = {};
  
  public newTransaction: Transaccion = {
    idtransaccion: 0,
    idpedido: 2,
    fechaTransaccion: new Date().toISOString(),
    montoTransaccion: 0,
    estadoTransaccion: 'Realizada'
  };
  
  constructor(private pedidoService: PedidosService, 
              private usuarioService: UsuariosService,
              private transaccionService: TransaccionService,
              private cartService: CartService) {
      
                this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
      this.getPedidosByUser(userId);
      this.getUserAuth(userId);
    } else {
      console.error('No se encontró el ID de usuario en el almacenamiento local');
    }

    const orderTotal = localStorage.getItem('totalPrecioCart');
    if (orderTotal !== null) {
      const orderTotalNumber = parseInt(orderTotal, 10);
      console.log(orderTotalNumber);
    } else {
      console.error('No se encontró ningún valor asociado a la clave "totalPrecioCart" en localStorage');
    }
  }

  getPedidosByUser(userId: number): void {
    this.pedidoService.getPedidosByUser(userId)
      .subscribe(pedidos => {
        this.pedidos = pedidos;
      }, error => {
        console.error('Error al obtener los pedidos:', error);
      });
  }

  getUserAuth(userId: number): void {
    this.usuarioService.getUserById(userId)
      .subscribe(usuario => {
        this.usuario = usuario;
      }, error => {
        console.error('Error al obtener el usuario:', error);
      });
  }

  //Transaction (payment) Method
  createTransaction() {
    try {
      const orderTotal = localStorage.getItem('totalPrecioCart');
      console.log('TOTAL DE LA ORDEN', orderTotal);
      if (orderTotal !== null) {
        const orderTotalNumber = parseFloat(orderTotal);
        this.transaccionService.simulatePayment(orderTotalNumber).subscribe(
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
      } else {
        console.error('No se encontró ningún valor asociado a la clave "totalPrecioCart" en localStorage');
      }
    } catch (ex) {
      console.error('Error al crear la transacción', ex);
    }
  }

  toggleHover(state: boolean, ulNumber: number) {
    if (ulNumber === 1) {
      this.isHovered1 = state;
    } else if (ulNumber === 2) {
      this.isHovered2 = state;
    }
  }

  onClick(ulNumber: number) {
    if (this.isHovered1) {
      this.userData = true;
      this.orderData = false;
    } else {
      this.orderData = true;
      this.userData = false;
    }
  }
}
