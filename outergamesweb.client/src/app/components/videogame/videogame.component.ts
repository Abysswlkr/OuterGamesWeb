import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Videojuego } from '../../interfaces/videojuego';

@Component({
  selector: 'app-videogame',
  templateUrl: './videogame.component.html',
  styleUrl: './videogame.component.css'
})
export class VideogameComponent implements OnInit{
videojuego!: Videojuego;

  constructor() {}

  ngOnInit(): void {
      this.videojuego = history.state.data;
      console.log(this.videojuego);
    }
}
