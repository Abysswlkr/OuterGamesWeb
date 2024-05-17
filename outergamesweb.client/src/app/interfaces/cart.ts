import { Videojuego } from "./videojuego";

export interface Cart {
    idusuario: number;
    fechaPedido: Date;
    videojuegos: Videojuego[];
  }