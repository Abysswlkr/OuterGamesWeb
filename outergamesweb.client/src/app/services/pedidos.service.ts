import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../interfaces/pedidos';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'https://localhost:7017/Pedido';
  private apiUrlDetails = 'https://localhost:7017/DetallesPedido'

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T); 
    };
  }

  createPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/CreateOrder`, pedido).pipe(
      catchError(this.handleError<Pedido>('createPedido'))
    );
  }

  createDetallesPedido(detalles: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrlDetails}/CreateDetailsOrder`, detalles).pipe(
      catchError(this.handleError<any>('createDetallesPedido'))
    );
  }

  getPedidoById(id: number): Observable<Pedido> {
    const url = `${this.apiUrl}/GetOrderById/${id}`;
    return this.http.get<Pedido>(url).pipe(
      catchError(this.handleError<Pedido>('getPedidoById'))
    );
  }

  getPedidosByUser(userId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/GetOrdersByUserId/${userId}`);
  }

  editPedido(id: number, pedido: Pedido): Observable<Pedido> {
    const url = `${this.apiUrl}/EditOrder/${id}`;
    return this.http.put<Pedido>(url, pedido).pipe(
      catchError(this.handleError<Pedido>('editPedido'))
    );
  }




}
