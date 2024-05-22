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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
      this.videojuego = history.state.data;
      console.log(this.videojuego);
    }

  addToCart(videojuego: Videojuego) {
    const cantidadToAdd = this.cantidad[videojuego.idvideojuego] || 1;
    const videojuegoToAdd = {...videojuego, cantidad: cantidadToAdd};
    this.cartService.addToCart(videojuegoToAdd);
  }

}
