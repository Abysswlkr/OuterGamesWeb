import { Component } from '@angular/core';
import { TransaccionService } from '../../services/transaccion.service';
import { Transaccion } from '../../interfaces/transacciones';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  amount!: number;
  response: any;

  public newTransaction: Transaccion = {
    idtransaccion: 0,
    idpedido: 2,
    fechaTransaccion: new Date().toISOString(),
    montoTransaccion: 0,
    estadoTransaccion: 'Realizada'
  };

  constructor(private transaccionService: TransaccionService) {}

  createTransaction() {
    try {
      this.transaccionService.simulatePayment(this.amount).subscribe(
        response => {
          this.response = response;
          console.log(response);
  
          // Este código ahora se encuentra dentro del callback de subscribe
          console.log(this.response.amount);
          const montoTransaccion = this.response.amount;
          console.log(montoTransaccion);
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
}