export interface Videojuego {
    idvideojuego: number;
    nombreVideojuego: string;
    descripcion: string;
    precio: number;
    cantidadStock: number;
    plataforma: string;
    genero1: string;
    genero2: string;
    genero3: string;
    imagen: string;
    cantidad?: number;
    precioTotal?: number;
}