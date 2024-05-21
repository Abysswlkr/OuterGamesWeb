import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Transaccion } from '../interfaces/transacciones';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private apiUrl = 'https://localhost:7017/Transacciones'

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T); 
    };
  }

  simulatePayment(amount: number): Observable<any> {
    const request = { amount: amount };
    return this.http.post(`${this.apiUrl}/simulatePayment`, request);
  }

  createTransaction(transaccion: Transaccion): Observable<Transaccion> {
    const pedidoIdString = localStorage.getItem('idPedido');
    console.log(pedidoIdString);
    if (pedidoIdString) {
      const idPedido = parseInt(pedidoIdString, 10);
      transaccion.idpedido = idPedido;
    } else {
      console.error('El ID del pedido no esta disponible en el almacenamiento local')
    }
    return this.http.post<Transaccion>(`${this.apiUrl}/CreateTransaction`, transaccion).pipe(
      catchError(this.handleError<Transaccion>('createTransaction'))
    )
  }
}
