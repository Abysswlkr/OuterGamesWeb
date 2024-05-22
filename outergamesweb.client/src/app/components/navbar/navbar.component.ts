import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, map } from 'rxjs';
import { Cart } from '../../interfaces/cart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cart$: Observable<Cart>;
  totalItems: Observable<number>;

  constructor( private authService: AuthService , private auth: AuthService, private cartService: CartService) {
    this.cart$ = this.cartService.cart$;

    this.totalItems = this.cart$.pipe(
      map(cart$ => cart$.videojuegos.reduce((acc, videojuego) => acc + (videojuego.cantidad ?? 0), 0))
    );
  }
  


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.auth.logout();
    console.log('Sesión finalizada.')
  }
}
