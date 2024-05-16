import { Injectable } from '@angular/core';
import { Cart } from '../interfaces/cart';
import { BehaviorSubject } from 'rxjs';
import { Videojuego } from '../interfaces/videojuego';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = {
    idusuario: 0,
    fechaCart: new Date(),
    videojuegos: []
  }

  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  cart$ = this.cartSubject.asObservable();

  constructor() { }

  addToCart(videojuego: Videojuego) {
    const existingVideojuego = this.cart.videojuegos.find(v => v.idvideojuego === videojuego.idvideojuego)

    if (existingVideojuego) {
      existingVideojuego.cantidadStock += videojuego.cantidadStock;
    } else {
      this.cart.videojuegos.push(videojuego);
    }
    this.cartSubject.next(this.cart);
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
