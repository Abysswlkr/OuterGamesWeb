import { Injectable } from '@angular/core';
import { Cart } from '../interfaces/cart';
import { BehaviorSubject } from 'rxjs';
import { Videojuego } from '../interfaces/videojuego';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = {
    idusuario: 0,
    fechaPedido: new Date(),
    videojuegos: []
  }

  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  cart$ = this.cartSubject.asObservable();
  lastCart$ = this.cartSubject.asObservable();

  constructor(private authService: AuthService) { }

  getCart(): Cart {
    return this.cart;
  }

  addToCart(videojuego: Videojuego) {
    const userIdString = localStorage.getItem('userId');
    console.log(userIdString);
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
      this.cart.idusuario = userId;
    } else {
      console.error('El ID de usuario no esta disponible en el almacenamiento local')
    }
    const existingVideojuego = this.cart.videojuegos.find(v => v.idvideojuego === videojuego.idvideojuego)

    if (existingVideojuego) {
      existingVideojuego.cantidadStock += videojuego.cantidadStock;
    } else {
      this.cart.videojuegos.push(videojuego);
    }
    this.cartSubject.next(this.cart);
    console.log(this.cart);
  }

  removeFromCart(idvideojuego: number) {
    this.cart.videojuegos = this.cart.videojuegos.filter(v => v.idvideojuego !== idvideojuego);
    this.cartSubject.next(this.cart);
  }

  clearCart() {
    this.cart.videojuegos = [];
    this.cartSubject.next(this.cart);
  }

  getCartItems() {
    return this.cart.videojuegos;
  }


}
