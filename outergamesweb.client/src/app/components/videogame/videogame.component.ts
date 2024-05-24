import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Videojuego } from '../../interfaces/videojuego';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-videogame',
  templateUrl: './videogame.component.html',
  styleUrl: './videogame.component.css'
})
export class VideogameComponent implements OnInit{
videojuego!: Videojuego;
cantidad: { [key: number]: number } = {};
maxQuantity: number = 5;

  //Alert
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
      this.videojuego = history.state.data;
      console.log(this.videojuego);
      if (!this.cantidad[this.videojuego.idvideojuego]) {
        this.cantidad[this.videojuego.idvideojuego] = 1;
      }
      console.log(this.videojuego);
    }

    increaseQuantity(id: number): void {
      if (this.cantidad[id] < this.maxQuantity) {
        this.cantidad[id]++;
      }
    }
  
    decreaseQuantity(id: number): void {
      if (this.cantidad[id] > 1) {
        this.cantidad[id]--;
      }
    }

  addToCart(videojuego: Videojuego) {
    const cantidadToAdd = this.cantidad[videojuego.idvideojuego] || 1;
    const videojuegoToAdd = {...videojuego, cantidad: cantidadToAdd};
    this.cartService.addToCart(videojuegoToAdd);
    this.alertMessage = 'Se ha añadido el producto al carrito';
    this.alertType = 'info';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
