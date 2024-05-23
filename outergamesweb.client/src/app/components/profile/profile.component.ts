import { Component, OnInit, TemplateRef } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from '../../interfaces/pedidos';
import { Usuario } from '../../interfaces/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Transaccion } from '../../interfaces/transacciones';
import { Observable } from 'rxjs';
import { Cart } from '../../interfaces/cart';
import { CartService } from '../../services/cart.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
  usuario!: Usuario 

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

  //Edit user data
  userId: number = 0
  newEmail: string = '';
  newDireccion: string = '';
  newPassword: string = '';

  //Modal
  modalRef?: BsModalRef;
  
  constructor(private pedidoService: PedidosService, 
              private usuarioService: UsuariosService,
              private transaccionService: TransaccionService,
              private cartService: CartService,
              private modalService: BsModalService) {
      
                this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
      this.getPedidosByUser(userId);
      this.getUserAuth(userId);

          // Load user data
      this.usuarioService.getUserById(userId).subscribe(
        user => this.usuario = user,
        error => console.error(error)
      );
      this.userId = userId;
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

  //Modals
  openModal1(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  openModal2(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  openModal3(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
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

  //Edit user data
  updateEmail() {
    console.log(this.userId);
    console.log(this.newEmail)
    this.usuarioService.updateEmail(this.userId, this.newEmail).subscribe(response => {
      console.log('Email actualizado:', response);
      // Aquí puedes manejar la respuesta como desees
    }, error => {
      console.error('Error al actualizar el email:', error);
    });
  }

  updateDireccion() {
    console.log(this.userId);
    console.log(this.newDireccion)
    this.usuarioService.updateAddress(this.userId, this.newDireccion).subscribe(response => {
      console.log('Dirección actualizada:', response);
      // Aquí puedes manejar la respuesta como desees
    }, error => {
      console.error('Error al actualizar la Dirección:', error);
    });
  }

  updatePassword() {
    console.log(this.userId);
    console.log(this.newPassword)
    this.usuarioService.updatePassword(this.userId, this.newPassword).subscribe(response => {
      console.log('Contraseña actualizada:', response);
      // Aquí puedes manejar la respuesta como desees
    }, error => {
      console.error('Error al actualizar la contraseña:', error);
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
