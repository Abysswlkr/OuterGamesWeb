import { Videojuego } from "./videojuego";

export interface Cart {
    idusuario: number;
    fechaCart: Date;
    videojuegos: Videojuego[];
  }